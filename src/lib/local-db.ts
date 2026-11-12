/**
 * The app's data, with no server. It replaces the Supabase project the site
 * used to run on (it disappeared in November 2026 and took sign-in and the
 * practice area down with it).
 *
 * - Content (`questions`, `passages`) ships with the site in src/data/*.json,
 *   loaded on first use. It's read-only.
 * - Everything a learner creates (profile, attempts, sessions, badges,
 *   reports) is kept in their own browser's localStorage.
 *
 * `db` mimics the small part of the Supabase client the pages used
 * (`from(table).select().eq()...`, `auth.getUser()`), so page code reads the
 * same as before. Learners were always anonymous, so a random id per browser
 * stands in for the old anonymous sign-in.
 */
import type { Database } from "@/lib/db-types";

type Tables = Database["public"]["Tables"];
export type TableName = keyof Tables;
type Row<T extends TableName> = Tables[T]["Row"];
type Insert<T extends TableName> = Tables[T]["Insert"];
type Update<T extends TableName> = Tables[T]["Update"];
type AnyRow = Record<string, unknown>;

export interface DbResult<D> {
  data: D;
  error: { message: string } | null;
}

// ── Content ────────────────────────────────────────────

const CONTENT_TABLES = new Set<TableName>(["questions", "passages"]);
let content: Promise<Record<"questions" | "passages", AnyRow[]>> | null = null;

function loadContent() {
  content ??= Promise.all([import("@/data/questions.json"), import("@/data/passages.json")]).then(
    ([questions, passages]) => ({
      questions: questions.default as unknown as AnyRow[],
      passages: passages.default as unknown as AnyRow[],
    }),
  );
  return content;
}

// ── Learner data (localStorage) ────────────────────────

const PREFIX = "cloe:";
const USER_KEY = `${PREFIX}user-id`;

function readTable(table: TableName): AnyRow[] {
  try {
    return JSON.parse(localStorage.getItem(PREFIX + table) ?? "[]") as AnyRow[];
  } catch {
    return [];
  }
}

function writeTable(table: TableName, rows: AnyRow[]) {
  try {
    localStorage.setItem(PREFIX + table, JSON.stringify(rows));
  } catch {
    // Storage full or blocked (private mode): progress just isn't kept.
  }
}

/** Column defaults, as the old database set them. */
function withDefaults(table: TableName, row: AnyRow): AnyRow {
  const now = new Date().toISOString();
  const base: AnyRow = { id: crypto.randomUUID(), created_at: now };
  if (table === "profiles") {
    Object.assign(base, {
      full_name: null,
      target_cefr_level: null,
      current_estimated_level: null,
      daily_goal_minutes: 15,
      onboarding_completed: false,
    });
  }
  if (table === "practice_sessions")
    Object.assign(base, { started_at: now, completed_at: null, summary: null });
  if (table === "badges") Object.assign(base, { earned_at: now });
  return { ...base, ...row };
}

// ── Queries ────────────────────────────────────────────

type Filter = (row: AnyRow) => boolean;

class Query<T extends TableName, D> implements PromiseLike<DbResult<D>> {
  private filters: Filter[] = [];
  private action: "select" | "insert" | "update" | "upsert" | "delete" = "select";
  private payload: AnyRow[] | AnyRow = [];
  private conflictKey = "id";
  private sort: { column: string; ascending: boolean } | null = null;
  private max = Infinity;
  private shape: "many" | "single" | "maybe" = "many";

  constructor(private table: T) {}

  /** Columns are ignored: whole rows are returned, which is a superset of any projection. */
  select(_columns?: string): this {
    return this;
  }

  eq(column: keyof Row<T> & string, value: unknown): this {
    this.filters.push((row) => row[column] === value);
    return this;
  }

  neq(column: keyof Row<T> & string, value: unknown): this {
    this.filters.push((row) => row[column] !== value);
    return this;
  }

  in(column: keyof Row<T> & string, values: readonly unknown[]): this {
    this.filters.push((row) => values.includes(row[column]));
    return this;
  }

  is(column: keyof Row<T> & string, _value: null): this {
    this.filters.push((row) => row[column] == null);
    return this;
  }

  /** Only `.not(column, "is", null)` is used. */
  not(column: keyof Row<T> & string, _operator: "is", _value: null): this {
    this.filters.push((row) => row[column] != null);
    return this;
  }

  gte(column: keyof Row<T> & string, value: string | number): this {
    this.filters.push((row) => (row[column] as string | number) >= value);
    return this;
  }

  order(column: keyof Row<T> & string, options: { ascending?: boolean } = {}): this {
    this.sort = { column, ascending: options.ascending ?? true };
    return this;
  }

  limit(count: number): this {
    this.max = count;
    return this;
  }

  single(): Query<T, Row<T>> {
    this.shape = "single";
    return this as unknown as Query<T, Row<T>>;
  }

  maybeSingle(): Query<T, Row<T> | null> {
    this.shape = "maybe";
    return this as unknown as Query<T, Row<T> | null>;
  }

  insert(rows: Insert<T> | Insert<T>[]): Query<T, Row<T>[]> {
    this.action = "insert";
    this.payload = rows as AnyRow | AnyRow[];
    return this as unknown as Query<T, Row<T>[]>;
  }

  upsert(rows: Insert<T> | Insert<T>[], options: { onConflict?: string } = {}): Query<T, Row<T>[]> {
    this.action = "upsert";
    this.payload = rows as AnyRow | AnyRow[];
    this.conflictKey = options.onConflict ?? "id";
    return this as unknown as Query<T, Row<T>[]>;
  }

  update(values: Update<T>): Query<T, Row<T>[]> {
    this.action = "update";
    this.payload = values as AnyRow;
    return this as unknown as Query<T, Row<T>[]>;
  }

  delete(): Query<T, Row<T>[]> {
    this.action = "delete";
    return this as unknown as Query<T, Row<T>[]>;
  }

  then<A = DbResult<D>, B = never>(
    onFulfilled?: ((value: DbResult<D>) => A | PromiseLike<A>) | null,
    onRejected?: ((reason: unknown) => B | PromiseLike<B>) | null,
  ): PromiseLike<A | B> {
    return this.run().then(onFulfilled, onRejected);
  }

  private matches = (row: AnyRow) => this.filters.every((f) => f(row));

  private async run(): Promise<DbResult<D>> {
    const isContent = CONTENT_TABLES.has(this.table);
    if (isContent && this.action !== "select") {
      return { data: null as D, error: { message: `${this.table} is read-only` } };
    }
    if (!isContent && typeof window === "undefined") {
      return { data: (this.shape === "many" ? [] : null) as D, error: null };
    }
    const rows = isContent
      ? (await loadContent())[this.table as "questions" | "passages"]
      : readTable(this.table);
    let result: AnyRow[];

    if (this.action === "select") {
      result = rows.filter(this.matches);
    } else if (this.action === "insert" || this.action === "upsert") {
      const incoming = (Array.isArray(this.payload) ? this.payload : [this.payload]).map((r) =>
        withDefaults(this.table, r),
      );
      const kept =
        this.action === "upsert"
          ? rows.filter((r) => !incoming.some((n) => n[this.conflictKey] === r[this.conflictKey]))
          : rows;
      writeTable(this.table, [...kept, ...incoming]);
      result = incoming;
    } else if (this.action === "update") {
      result = [];
      const next = rows.map((r) => {
        if (!this.matches(r)) return r;
        const updated = { ...r, ...(this.payload as AnyRow) };
        result.push(updated);
        return updated;
      });
      writeTable(this.table, next);
    } else {
      result = rows.filter(this.matches);
      writeTable(
        this.table,
        rows.filter((r) => !this.matches(r)),
      );
    }

    if (this.sort) {
      const { column, ascending } = this.sort;
      result = [...result].sort((a, b) => {
        const x = a[column] as string | number;
        const y = b[column] as string | number;
        return (x < y ? -1 : x > y ? 1 : 0) * (ascending ? 1 : -1);
      });
    }
    result = result.slice(0, this.max);

    if (this.shape === "many") return { data: result as D, error: null };
    if (this.shape === "single" && result.length !== 1) {
      return {
        data: null as D,
        error: { message: `Expected one ${this.table} row, found ${result.length}` },
      };
    }
    return { data: (result[0] ?? null) as D, error: null };
  }
}

// ── The learner ────────────────────────────────────────

export interface LocalUser {
  id: string;
  email: string | null;
  is_anonymous: true;
}

function currentUser(): LocalUser | null {
  if (typeof window === "undefined") return null;
  let id: string | null = null;
  try {
    id = localStorage.getItem(USER_KEY);
  } catch {
    // fall through to a per-visit id
  }
  if (!id) {
    id = crypto.randomUUID();
    try {
      localStorage.setItem(USER_KEY, id);
    } catch {
      // Storage blocked: the id lasts for this visit only.
    }
    // What the old database's new-user trigger did.
    writeTable("profiles", [...readTable("profiles"), withDefaults("profiles", { id })]);
  }
  return { id, email: null, is_anonymous: true };
}

export const db = {
  from<T extends TableName>(table: T): Query<T, Row<T>[]> {
    return new Query<T, Row<T>[]>(table);
  },
  auth: {
    async getUser(): Promise<DbResult<{ user: LocalUser | null }>> {
      return { data: { user: currentUser() }, error: null };
    },
    /** Forget this browser's progress and start again as a new learner. */
    async signOut(): Promise<{ error: null }> {
      try {
        for (const key of Object.keys(localStorage)) {
          if (key.startsWith(PREFIX)) localStorage.removeItem(key);
        }
      } catch {
        // nothing stored
      }
      return { error: null };
    },
  },
};
