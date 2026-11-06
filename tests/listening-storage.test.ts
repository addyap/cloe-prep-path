import { beforeEach, expect, mock, test } from "bun:test";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../src/integrations/supabase/types";
import { wav } from "./wav-fixture";

const questionId = "11111111-1111-4111-8111-111111111111";
const passageId = "22222222-2222-4222-8222-222222222222";
type Row = {
  id: string;
  skill: string;
  audio_url: string | null;
  prompt_text?: string;
  body?: string;
  passage_id?: string | null;
};
let rows: Record<string, Row[]>;
let files: Map<string, ArrayBuffer>;
let writes: string[];
let uploadFails = false;
let updateFails = false;
let queueFails = false;
let predicates: string[];

function query(table: string) {
  let matches = [...rows[table]];
  let update: Partial<Row> | undefined;
  let counting = false;
  const builder = {
    select(_fields: string, options?: { head?: boolean }) {
      counting = !!options?.head;
      return builder;
    },
    eq(key: keyof Row, value: unknown) {
      matches = matches.filter((r) => r[key] === value);
      return builder;
    },
    is(key: keyof Row, value: unknown) {
      return builder.eq(key, value);
    },
    or(predicate: string) {
      predicates.push(predicate);
      const stale = predicate.includes("not.ilike");
      matches = matches.filter(
        (r) =>
          !r.audio_url ||
          r.audio_url.startsWith("tts:") ||
          (stale && !r.audio_url.endsWith("#kokoro-browser-v1")),
      );
      return builder;
    },
    order() {
      return builder;
    },
    limit(n: number) {
      matches = matches.slice(0, n);
      return builder;
    },
    update(value: Partial<Row>) {
      update = value;
      return builder;
    },
    async single() {
      return {
        data: matches[0] ?? null,
        error: matches.length === 1 ? null : { message: "not found" },
      };
    },
    then(resolve: (value: unknown) => unknown) {
      if (queueFails && !update)
        return Promise.resolve({ data: null, error: { message: "database unavailable" } }).then(
          resolve,
        );
      if (update && !updateFails) matches.forEach((r) => Object.assign(r, update));
      return Promise.resolve({
        data: matches,
        count: counting ? matches.length : null,
        error: update && updateFails ? { message: "update failed" } : null,
      }).then(resolve);
    },
  };
  return builder;
}

const admin = {
  from: query,
  storage: {
    from(bucket: string) {
      expect(bucket).toBe("listening-audio");
      return {
        async exists(path: string) {
          return {
            data: files.has(path),
            error: files.has(path) ? null : { status: 404 },
          };
        },
        async createSignedUploadUrl(path: string, options: { upsert: boolean }) {
          expect(options.upsert).toBe(false);
          return {
            data: uploadFails ? null : { token: "test-scoped-token", path },
            error: uploadFails ? { message: "signing failed" } : null,
          };
        },
        async info(path: string) {
          const bytes = files.get(path);
          return {
            data: bytes ? { size: bytes.byteLength, contentType: "audio/wav" } : null,
            error: bytes ? null : { message: "not found" },
          };
        },
        async download(path: string) {
          const bytes = files.get(path);
          return {
            data: bytes ? new Blob([bytes], { type: "audio/wav" }) : null,
            error: bytes ? null : { message: "not found" },
          };
        },
        getPublicUrl(path: string) {
          return {
            data: {
              publicUrl: `https://example.supabase.co/storage/v1/object/public/listening-audio/${path}`,
            },
          };
        },
      };
    },
  },
};
mock.module("../src/integrations/supabase/client.server", () => ({ supabaseAdmin: admin }));
const { readListeningSource, storeListeningAudio, getAudioBatch, createAudioUpload } =
  await import("../src/lib/listening-audio.server");
const { speechCacheKey } = await import("../src/lib/speech-cache-key");
const client = admin as unknown as SupabaseClient<Database>;
beforeEach(() => {
  files = new Map();
  writes = [];
  predicates = [];
  uploadFails = updateFails = queueFails = false;
  rows = {
    questions: [
      {
        id: questionId,
        skill: "listening",
        audio_url: null,
        passage_id: null,
        prompt_text: 'You hear: "The train leaves at ten." When does it leave?',
      },
    ],
    passages: [
      { id: passageId, skill: "listening", audio_url: null, body: "Anna: Hello.\nBen: Morning." },
    ],
  };
});

test("extracts only spoken words and resolves linked questions to their passage", async () => {
  const target = { kind: "question" as const, id: questionId };
  expect((await readListeningSource(client, target)).script).toBe("The train leaves at ten.");
  rows.questions[0].passage_id = passageId;
  const source = await readListeningSource(client, target);
  expect(source.kind).toBe("passage");
  expect(source.script).toBe(rows.passages[0].body!);
  rows.questions[0].skill = "reading";
  await expect(readListeningSource(client, target)).rejects.toThrow("unavailable");
});

test("supports legacy tts: scripts", async () => {
  rows.questions[0].audio_url = "tts:Legacy spoken words.";
  expect((await readListeningSource(client, { kind: "question", id: questionId })).script).toBe(
    "Legacy spoken words.",
  );
});

async function upload(target: Parameters<typeof createAudioUpload>[0], bytes: ArrayBuffer) {
  const grant = await createAudioUpload(target);
  if (grant.token) {
    files.set(grant.path, bytes);
    writes.push(grant.path);
  }
  return storeListeningAudio(target);
}

test("issues scoped upload grants and publishes validated browser audio", async () => {
  const source = await readListeningSource(client, { kind: "question", id: questionId });
  const target = {
    kind: "question" as const,
    id: questionId,
    cacheKey: await speechCacheKey(source.script),
  };
  const url = await upload(target, wav());
  expect(url).toEndWith(".wav#kokoro-browser-v1");
  expect(rows.questions[0].audio_url).toBe(url);
  expect(writes[0]).toMatch(/^kokoro-browser-v1\/question-.+-[a-f0-9]{64}\.wav$/);
  expect((await createAudioUpload(target)).token).toBeNull();
  await upload(target, wav());
  expect(writes.length).toBe(1);
});

test("rejects stale scripts and malformed audio before changing the lesson", async () => {
  const target = {
    kind: "passage" as const,
    id: passageId,
    cacheKey: await speechCacheKey(rows.passages[0].body!),
  };
  await expect(upload(target, new ArrayBuffer(44))).rejects.toThrow("invalid WAV");
  expect(rows.passages[0].audio_url).toBeNull();
  rows.passages[0].body = "An edited script.";
  await expect(createAudioUpload(target)).rejects.toThrow("script changed");
});

test("signing and update failures preserve old audio; retries reuse the uploaded object", async () => {
  rows.questions[0].audio_url = "https://example.supabase.co/old.mp3#v3";
  const source = await readListeningSource(client, { kind: "question", id: questionId });
  const target = {
    kind: "question" as const,
    id: questionId,
    cacheKey: await speechCacheKey(source.script),
  };
  uploadFails = true;
  await expect(createAudioUpload(target)).rejects.toThrow("prepare");
  expect(rows.questions[0].audio_url).toBe(source.audioUrl);
  uploadFails = false;
  updateFails = true;
  await expect(upload(target, wav())).rejects.toThrow("exercise couldn't be updated");
  expect(files.size).toBe(1);
  updateFails = false;
  await upload(target, wav());
  expect(writes.length).toBe(1);
});

test("batches upgrade older clips, skip current clips and exclude passage-linked questions", async () => {
  rows.questions.push({
    ...rows.questions[0],
    id: "old",
    audio_url: "https://example.supabase.co/old.mp3#v3",
  });
  rows.questions.push({
    ...rows.questions[0],
    id: "current",
    audio_url: "https://example.supabase.co/current.wav#kokoro-browser-v1",
  });
  rows.questions.push({ ...rows.questions[0], id: "linked", passage_id: passageId });
  const batch = await getAudioBatch("question", true);
  expect(batch.remaining).toBe(2);
  expect(batch.items.length).toBe(2);
  expect(batch.items[0].cacheKey).toHaveLength(64);
  expect(predicates.every((p) => p.includes("not.ilike.*#kokoro-browser-v1"))).toBe(true);
  expect((await getAudioBatch("question", false)).remaining).toBe(1);
});

test("reports database failures instead of claiming the queue is empty", async () => {
  queueFails = true;
  await expect(getAudioBatch("question", false)).rejects.toThrow("queue");
});
