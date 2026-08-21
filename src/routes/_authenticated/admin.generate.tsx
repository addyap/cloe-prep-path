import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { checkIsAdmin, claimFirstAdmin, generateQuestions } from "@/lib/admin.functions";
import {
  generateListeningAudio,
  generateListeningPassageAudio,
  previewVoice,
  PREVIEW_VOICES,
} from "@/lib/audio-gen.functions";
import { Sparkles, ShieldCheck, Loader2, Volume2, Play } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/generate")({
  component: AdminGenerate,
});

const SKILLS = ["listening", "reading", "grammar_vocab", "writing", "speaking"] as const;
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const CONTEXTS_BY_SKILL: Record<string, readonly string[]> = {
  listening: ["call", "meeting", "customer_service", "negotiation", "general"],
  reading: ["email", "general", "customer_service", "negotiation"],
  grammar_vocab: [
    "tenses",
    "prepositions",
    "business_vocab",
    "phrasal_verbs",
    "formal_register",
    "collocations",
  ],
  writing: ["email", "general", "customer_service", "negotiation"],
  speaking: ["interview", "role_play", "discussion"],
};

type PreviewItem = {
  prompt_text: string;
  type: string;
  options?: string[];
  correct_answer?: string;
  explanation: string;
};

function AdminGenerate() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const [skill, setSkill] = useState<(typeof SKILLS)[number]>("grammar_vocab");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("B1");
  const [contextTag, setContextTag] = useState<string>("business_vocab");
  const [count, setCount] = useState(5);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<PreviewItem[]>([]);
  const [lastInserted, setLastInserted] = useState<number | null>(null);

  const [revoiceAll, setRevoiceAll] = useState(false);
  const SAMPLE_TEXT =
    "Good morning everyone. The meeting will start at ten o'clock in the main room. Please bring your reports.";
  const [previewVoiceName, setPreviewVoiceName] = useState<string>(PREVIEW_VOICES[0]);
  const [previewText, setPreviewText] = useState<string>(SAMPLE_TEXT);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [audioBusy, setAudioBusy] = useState(false);
  const [audioStatus, setAudioStatus] = useState<{
    generated: number;
    remaining: number;
    errors: string[];
  } | null>(null);
  const [passageAudioBusy, setPassageAudioBusy] = useState(false);
  const [passageAudioStatus, setPassageAudioStatus] = useState<{
    generated: number;
    remaining: number;
    errors: string[];
  } | null>(null);

  const isAdminFn = useServerFn(checkIsAdmin);
  const claimFn = useServerFn(claimFirstAdmin);
  const genFn = useServerFn(generateQuestions);
  const audioFn = useServerFn(generateListeningAudio);
  const passageAudioFn = useServerFn(generateListeningPassageAudio);
  const previewFn = useServerFn(previewVoice);

  useEffect(() => {
    (async () => {
      try {
        const res = await isAdminFn();
        setIsAdmin(!!res.isAdmin);
      } catch {
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    })();
  }, [isAdminFn]);

  useEffect(() => {
    const allowed = CONTEXTS_BY_SKILL[skill];
    if (!allowed.includes(contextTag)) setContextTag(allowed[0]);
  }, [skill, contextTag]);

  const claim = async () => {
    setClaiming(true);
    try {
      await claimFn();
      toast.success("You're now an admin.");
      setIsAdmin(true);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setClaiming(false);
    }
  };

  const generate = async () => {
    setBusy(true);
    setPreview([]);
    setLastInserted(null);
    try {
      const res = await genFn({
        data: { skill, cefr_level: level, context_tag: contextTag as never, count },
      });
      setPreview(res.preview as PreviewItem[]);
      setLastInserted(res.inserted_count);
      toast.success(`Generated ${res.inserted_count} new questions.`);
    } catch (e) {
      const msg = (e as Error).message;
      if (msg === "RATE_LIMIT") toast.error("Rate limit hit. Try again in a moment.");
      else if (msg === "CREDITS_EXHAUSTED")
        toast.error("AI credits exhausted. Add credits to your OpenAI account.");
      else toast.error(msg || "Failed to generate questions.");
    } finally {
      setBusy(false);
    }
  };

  const playPreview = async () => {
    setPreviewBusy(true);
    try {
      const res = await previewFn({
        data: { voice: previewVoiceName, text: previewText.trim().slice(0, 400) },
      });
      const audio = new Audio(res.dataUrl);
      await audio.play();
    } catch (e) {
      const msg = (e as Error).message;
      if (msg === "CREDITS_EXHAUSTED")
        toast.error("AI credits exhausted. Add credits to your OpenAI account.");
      else toast.error(msg || "Couldn't play the sample.");
    } finally {
      setPreviewBusy(false);
    }
  };

  const generateAudio = async () => {
    setAudioBusy(true);
    try {
      const res = await audioFn({ data: { limit: 30, regenerateAll: revoiceAll } });
      setAudioStatus({
        generated: res.generated,
        remaining: res.remaining,
        errors: res.errors ?? [],
      });
      if (res.errors?.length) {
        toast.error(`${res.generated} generated, ${res.errors.length} failed. Try again.`);
      } else if (res.generated === 0) {
        toast.success("All listening audio already generated.");
      } else {
        toast.success(
          `Generated ${res.generated} clips. ${res.remaining} still to go — click again to continue.`,
        );
      }
    } catch (e) {
      const msg = (e as Error).message;
      if (msg === "RATE_LIMIT") toast.error("Rate limit hit. Try again in a moment.");
      else if (msg === "CREDITS_EXHAUSTED")
        toast.error("AI credits exhausted. Add credits to your OpenAI account.");
      else toast.error(msg || "Failed to generate audio.");
    } finally {
      setAudioBusy(false);
    }
  };

  const generatePassageAudio = async () => {
    setPassageAudioBusy(true);
    try {
      const res = await passageAudioFn({ data: { limit: 30, regenerateAll: revoiceAll } });
      setPassageAudioStatus({
        generated: res.generated,
        remaining: res.remaining,
        errors: res.errors ?? [],
      });
      if (res.errors?.length) {
        toast.error(`${res.generated} generated, ${res.errors.length} failed. Try again.`);
      } else if (res.generated === 0) {
        toast.success("All listening passage audio already generated.");
      } else {
        toast.success(
          `Generated ${res.generated} clips. ${res.remaining} still to go — click again to continue.`,
        );
      }
    } catch (e) {
      const msg = (e as Error).message;
      if (msg === "RATE_LIMIT") toast.error("Rate limit hit. Try again in a moment.");
      else if (msg === "CREDITS_EXHAUSTED")
        toast.error("AI credits exhausted. Add credits to your OpenAI account.");
      else toast.error(msg || "Failed to generate audio.");
    } finally {
      setPassageAudioBusy(false);
    }
  };

  if (checking) {
    return (
      <AppShell>
        <div className="p-5 md:p-10 max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-40 w-full" />
        </div>
      </AppShell>
    );
  }

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="p-5 md:p-10 max-w-2xl mx-auto">
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <ShieldCheck className="h-10 w-10 mx-auto text-muted-foreground" />
            <h1 className="mt-3 text-xl font-bold text-primary">Admins only</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This tool generates new practice questions. If you're the first user setting up CLOE
              Prep, you can claim admin access now.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Button variant="ghost" onClick={() => navigate({ to: "/dashboard" })}>
                Back
              </Button>
              <Button
                onClick={claim}
                disabled={claiming}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {claiming ? "Claiming…" : "Claim first admin"}
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Only works if no admin exists yet.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const contexts = CONTEXTS_BY_SKILL[skill];

  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-3xl mx-auto space-y-6">
        <header>
          <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wide">
            <Sparkles className="h-4 w-4" /> Admin tool
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mt-1">Generate questions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Use AI to expand the question bank. Items are inserted directly into the database.
          </p>
        </header>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Skill</Label>
              <Select value={skill} onValueChange={(v) => setSkill(v as (typeof SKILLS)[number])}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SKILLS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace("_", " & ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                CEFR level
              </Label>
              <Select value={level} onValueChange={(v) => setLevel(v as (typeof LEVELS)[number])}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Context / sub-topic
              </Label>
              <Select value={contextTag} onValueChange={setContextTag}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contexts.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                How many
              </Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                className="mt-1"
              />
            </div>
          </div>

          <Button
            onClick={generate}
            disabled={busy}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating…
              </>
            ) : (
              `Generate ${count} questions`
            )}
          </Button>
          {lastInserted !== null && !busy && (
            <p className="text-xs text-center text-muted-foreground">
              Last run: {lastInserted} inserted.
            </p>
          )}
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-3">
          <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wide">
            <Play className="h-4 w-4" /> Voice preview
          </div>
          <p className="text-sm text-muted-foreground">
            Hear a voice instantly — no re-voicing needed. Pick one, press Play, and compare. When
            you find the natural one, tell me its name and I'll lock it in, then you re-voice once.
          </p>
          <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Voice</Label>
              <Select value={previewVoiceName} onValueChange={setPreviewVoiceName}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PREVIEW_VOICES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                      {(v === "marin" || v === "cedar") && " — best quality"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={playPreview}
              disabled={previewBusy}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {previewBusy ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading…
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> Play sample
                </>
              )}
            </Button>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Sample text
            </Label>
            <Input
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="mt-1"
              maxLength={400}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-3">
          <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wide">
            <Volume2 className="h-4 w-4" /> Listening audio
          </div>
          <p className="text-sm text-muted-foreground">
            Listening items with no generated audio fall back to the browser's built-in
            text-to-speech, which sounds robotic. Generate natural-voice audio (OpenAI TTS) in
            batches of 30 — click again to keep going until nothing's left.
          </p>
          <label className="flex items-start gap-2 rounded-xl bg-muted/40 p-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={revoiceAll}
              onChange={(e) => setRevoiceAll(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-accent"
            />
            <span>
              <span className="font-medium text-foreground">Re-voice everything</span> — also
              replace clips made with the old robotic voices, not just fill in missing ones. Use
              this once to upgrade the whole bank to the natural voice.
            </span>
          </label>
          <Button onClick={generateAudio} disabled={audioBusy} variant="outline" className="w-full">
            {audioBusy ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating audio…
              </>
            ) : revoiceAll ? (
              "Re-voice item audio (next 30)"
            ) : (
              "Generate item audio (next 30)"
            )}
          </Button>
          {audioStatus && !audioBusy && (
            <>
              <p className="text-xs text-center text-muted-foreground">
                Last run: {audioStatus.generated} generated, {audioStatus.remaining} remaining.
              </p>
              {audioStatus.errors.length > 0 && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive space-y-1">
                  {audioStatus.errors.slice(0, 5).map((e, i) => (
                    <p key={i} className="break-words">
                      {e}
                    </p>
                  ))}
                  {audioStatus.errors.length > 5 && (
                    <p>…and {audioStatus.errors.length - 5} more.</p>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-3">
          <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wide">
            <Volume2 className="h-4 w-4" /> Listening passage audio
          </div>
          <p className="text-sm text-muted-foreground">
            Same idea, but for listening passages (multi-question dialogues/monologues) rather than
            single-sentence items — one clip per passage. Genuine two-party dialogues get a distinct
            natural voice per speaker; narration is read by a single narrator. The{" "}
            <span className="font-medium text-foreground">Re-voice everything</span> toggle above
            applies here too.
          </p>
          <Button
            onClick={generatePassageAudio}
            disabled={passageAudioBusy}
            variant="outline"
            className="w-full"
          >
            {passageAudioBusy ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating audio…
              </>
            ) : revoiceAll ? (
              "Re-voice passage audio (next 30)"
            ) : (
              "Generate passage audio (next 30)"
            )}
          </Button>
          {passageAudioStatus && !passageAudioBusy && (
            <>
              <p className="text-xs text-center text-muted-foreground">
                Last run: {passageAudioStatus.generated} generated, {passageAudioStatus.remaining}{" "}
                remaining.
              </p>
              {passageAudioStatus.errors.length > 0 && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive space-y-1">
                  {passageAudioStatus.errors.slice(0, 5).map((e, i) => (
                    <p key={i} className="break-words">
                      {e}
                    </p>
                  ))}
                  {passageAudioStatus.errors.length > 5 && (
                    <p>…and {passageAudioStatus.errors.length - 5} more.</p>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        {preview.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground">Preview</h2>
            {preview.map((q, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  #{i + 1} · {q.type}
                </div>
                <div className="mt-1 font-medium text-foreground whitespace-pre-wrap">
                  {q.prompt_text}
                </div>
                {q.options && (
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                    {q.options.map((o, k) => (
                      <li
                        key={k}
                        className={o === q.correct_answer ? "text-accent font-semibold" : ""}
                      >
                        • {o}
                        {o === q.correct_answer && " ✓"}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-2 text-xs text-muted-foreground italic">{q.explanation}</div>
              </div>
            ))}
          </section>
        )}
      </div>
    </AppShell>
  );
}
