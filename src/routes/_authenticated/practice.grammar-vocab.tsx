import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Check, X, Loader2, Trophy, Flame, Timer, PenLine, Zap, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { PracticeErrorState, PracticeRouteError } from "@/components/practice-error";
import { ReportIssueDialog } from "@/components/report-issue-dialog";
import { cn, shuffle } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/practice/grammar-vocab")({
  component: GrammarVocabPractice,
  errorComponent: PracticeRouteError,
});

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
type Level = (typeof LEVELS)[number];
const SESSION_LENGTH = 12;
const AUTO_ADVANCE_MS = 1600;

const SUB_TOPICS = [
  { slug: "mixed", label: "Mixed", desc: "All sub-topics" },
  { slug: "tenses", label: "Tenses", desc: "Verb forms & time" },
  { slug: "prepositions", label: "Prepositions", desc: "in / on / at / for…" },
  { slug: "business_vocab", label: "Business vocabulary", desc: "Workplace terms" },
  { slug: "phrasal_verbs", label: "Phrasal verbs", desc: "put off, follow up…" },
  { slug: "formal_register", label: "Formal register", desc: "Polite & professional" },
  { slug: "collocations", label: "Collocations", desc: "Words that go together" },
] as const;
type Topic = (typeof SUB_TOPICS)[number]["slug"];

type Question = {
  id: string;
  cefr_level: Level;
  context_tag: string;
  prompt_text: string;
  options: string[];
  correct_answer: string;
  explanation: string | null;
};

type HistoryItem = { question: Question; answer: string; correct: boolean };

function bumpLevel(level: Level, delta: 1 | -1): Level {
  const i = LEVELS.indexOf(level);
  return LEVELS[Math.min(LEVELS.length - 1, Math.max(0, i + delta))];
}

function GrammarVocabPractice() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [pool, setPool] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<Level>("A2");
  const [asked, setAsked] = useState<Set<string>>(new Set());
  const [streakRight, setStreakRight] = useState(0);
  const [streakWrong, setStreakWrong] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Session timer
  useEffect(() => {
    if (!topic || done) return;
    if (!startedAt.current) startedAt.current = Date.now();
    const id = setInterval(() => {
      if (startedAt.current) setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 250);
    return () => clearInterval(id);
  }, [topic, done]);

  // Load questions when a topic is picked
  useEffect(() => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const { data: u } = await supabase.auth.getUser();
        const [profileRes, qRes] = await Promise.all([
          u.user
            ? supabase
                .from("profiles")
                .select("current_estimated_level")
                .eq("id", u.user.id)
                .maybeSingle()
            : Promise.resolve({ data: null } as const),
          topic === "mixed"
            ? supabase.from("questions").select("*").eq("skill", "grammar_vocab")
            : supabase
                .from("questions")
                .select("*")
                .eq("skill", "grammar_vocab")
                .eq("context_tag", topic),
        ]);
        if (qRes.error) throw qRes.error;
        setLevel((profileRes.data?.current_estimated_level as Level) ?? "A2");
        const list: Question[] = (qRes.data ?? [])
          .map((q) => ({
            id: q.id,
            cefr_level: q.cefr_level as Level,
            context_tag: q.context_tag,
            prompt_text: q.prompt_text,
            options: Array.isArray(q.options) ? shuffle(q.options as string[]) : [],
            correct_answer: q.correct_answer ?? "",
            explanation: q.explanation,
          }))
          // Guard against a malformed row (missing options/answer) breaking the session.
          .filter((q) => q.options.length > 0 && q.correct_answer);
        setPool(list);
      } catch (err) {
        console.error(err);
        setError("We couldn't load these questions. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [topic]);

  const pickNext = useCallback(
    (forLevel: Level, askedIds: Set<string>): Question | null => {
      const remaining = pool.filter((q) => !askedIds.has(q.id));
      if (remaining.length === 0) return null;
      const tryLevels: Level[] = [forLevel];
      for (let d = 1; d < LEVELS.length; d++) {
        const idx = LEVELS.indexOf(forLevel);
        if (idx - d >= 0) tryLevels.push(LEVELS[idx - d]);
        if (idx + d < LEVELS.length) tryLevels.push(LEVELS[idx + d]);
      }
      for (const lv of tryLevels) {
        const m = remaining.filter((q) => q.cefr_level === lv);
        if (m.length) return m[Math.floor(Math.random() * m.length)];
      }
      return remaining[0];
    },
    [pool],
  );

  // Start first question
  useEffect(() => {
    // `pool.length === 0` guards the load race: on topic pick this effect can
    // run before the fetch's setLoading(true) is visible here (stale closure),
    // which would call pickNext on an empty pool and instantly mark the drill
    // "done" with 0 questions. The pool is only ever empty pre-load — genuine
    // exhaustion is tracked via `asked`, so this never blocks a real finish.
    if (!topic || loading || current || done || pool.length === 0) return;
    const next = pickNext(level, asked);
    if (!next) {
      setDone(true);
      return;
    }
    setCurrent(next);
    // `pickNext` (useCallback on [pool]) changes identity when the pool loads,
    // so this effect already re-runs once questions arrive — no need to add
    // `pool.length` to the deps (doing so trips React's "deps size changed").
  }, [topic, loading, current, done, level, asked, pickNext]);

  useEffect(
    () => () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    },
    [],
  );

  async function pick(opt: string) {
    if (!current || submitted) return;
    setSelected(opt);
    setSubmitted(true);
    const isCorrect = opt === current.correct_answer;
    setHistory((h) => [...h, { question: current, answer: opt, correct: isCorrect }]);
    const newRight = isCorrect ? streakRight + 1 : 0;
    const newWrong = isCorrect ? 0 : streakWrong + 1;
    if (newRight > bestStreak) setBestStreak(newRight);
    setStreakRight(newRight);
    setStreakWrong(newWrong);
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      await supabase.from("attempts").insert({
        user_id: u.user.id,
        question_id: current.id,
        skill: "grammar_vocab",
        cefr_level: current.cefr_level,
        user_answer: opt,
        is_correct: isCorrect,
        score: isCorrect ? 1 : 0,
      });
    }
    autoAdvanceRef.current = setTimeout(advance, AUTO_ADVANCE_MS);
  }

  function advance() {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
    let newLevel = level;
    let resetStreaks = false;
    if (streakRight >= 2 && level !== "C2") {
      newLevel = bumpLevel(level, 1);
      resetStreaks = true;
    } else if (streakWrong >= 2 && level !== "A1") {
      newLevel = bumpLevel(level, -1);
      resetStreaks = true;
    }
    setLevel(newLevel);
    if (resetStreaks) {
      setStreakRight(0);
      setStreakWrong(0);
    }
    const newAsked = new Set(asked);
    if (current) newAsked.add(current.id);
    setAsked(newAsked);
    setSelected(null);
    setSubmitted(false);
    if (history.length >= SESSION_LENGTH || newAsked.size >= pool.length) {
      setDone(true);
      setCurrent(null);
      return;
    }
    const nextQ = pickNext(newLevel, newAsked);
    if (!nextQ) {
      setDone(true);
      setCurrent(null);
      return;
    }
    setCurrent(nextQ);
  }

  // Topic picker
  if (!topic) {
    return (
      <AppShell>
        <div className="p-5 md:p-10 max-w-3xl mx-auto">
          <Link to="/practice" className="text-sm text-muted-foreground hover:text-foreground">
            ← All practice
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <PenLine className="h-6 w-6 text-accent" />
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              Grammar & Vocabulary drill
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Fast, single-question drills. Pick a focus or go mixed.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {SUB_TOPICS.map((t) => (
              <button
                key={t.slug}
                onClick={() => setTopic(t.slug)}
                className={cn(
                  "text-left rounded-2xl border-2 p-5 transition bg-card",
                  "border-border hover:border-accent/60 hover:bg-accent/5",
                )}
              >
                <div className="font-semibold text-foreground flex items-center gap-2">
                  {t.slug === "mixed" && <Zap className="h-4 w-4 text-accent" />}
                  {t.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return <PracticeErrorState message={error} />;
  }

  if (loading) {
    return (
      <AppShell>
        <div className="p-10 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading drill…
        </div>
      </AppShell>
    );
  }

  if (!loading && pool.length === 0) {
    return (
      <PracticeErrorState message="No questions are available for this topic right now. Please try again later." />
    );
  }

  if (done || !current) {
    return (
      <Summary history={history} estimatedLevel={level} elapsed={elapsed} bestStreak={bestStreak} />
    );
  }

  const progress = history.length;
  const lastCorrect = submitted && selected === current.correct_answer;

  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <button onClick={() => setTopic(null)} className="hover:text-foreground">
            ← Change focus
          </button>
          <div>
            Question {progress + 1} of {SESSION_LENGTH}
          </div>
        </div>

        {/* HUD */}
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            {current.cefr_level} · {current.context_tag.replace("_", " ")}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold",
              streakRight >= 2 ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground",
            )}
          >
            <Flame className="h-3.5 w-3.5" /> {streakRight}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-muted-foreground">
            <Timer className="h-3.5 w-3.5" /> {formatTime(elapsed)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${(progress / SESSION_LENGTH) * 100}%` }}
          />
        </div>

        {/* Prompt */}
        <div className="mt-8 rounded-3xl bg-card border border-border shadow-card p-6 md:p-8">
          <div className="text-xl md:text-2xl font-semibold text-foreground leading-snug">
            {current.prompt_text}
          </div>
          <div className="mt-6 grid gap-3">
            {current.options.map((opt) => {
              const isSel = selected === opt;
              const isRight = submitted && opt === current.correct_answer;
              const isWrongPick = submitted && isSel && opt !== current.correct_answer;
              return (
                <button
                  key={opt}
                  onClick={() => pick(opt)}
                  disabled={submitted}
                  className={cn(
                    "text-left rounded-2xl border-2 p-4 transition flex items-center gap-3 bg-card",
                    !submitted && "border-border hover:border-accent/60 hover:bg-accent/5",
                    isRight && "border-success bg-success/10",
                    isWrongPick && "border-destructive bg-destructive/10",
                    submitted && !isRight && !isWrongPick && "border-border opacity-60",
                  )}
                >
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      !submitted && "border-muted-foreground/30",
                      isRight && "border-success bg-success text-white",
                      isWrongPick && "border-destructive bg-destructive text-white",
                    )}
                  >
                    {isRight && <Check className="h-4 w-4" />}
                    {isWrongPick && <X className="h-4 w-4" />}
                  </div>
                  <span className="text-base md:text-lg text-foreground">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {submitted && (
          <div
            className={cn(
              "mt-5 rounded-2xl p-4 border-2 flex items-start gap-3",
              lastCorrect
                ? "border-success/30 bg-success/5"
                : "border-destructive/30 bg-destructive/5",
            )}
          >
            <div className="mt-0.5">
              {lastCorrect ? (
                <Check className="h-5 w-5 text-success" />
              ) : (
                <X className="h-5 w-5 text-destructive" />
              )}
            </div>
            <div className="flex-1">
              <div
                className={cn("font-semibold", lastCorrect ? "text-success" : "text-destructive")}
              >
                {lastCorrect ? "Correct" : `Answer: ${current.correct_answer}`}
              </div>
              {current.explanation && (
                <p className="text-sm mt-1 text-foreground/80">{current.explanation}</p>
              )}
              <div className="mt-2">
                <ReportIssueDialog questionId={current.id} userAnswer={selected} />
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={advance}
              className="gap-1 text-muted-foreground hover:text-foreground"
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function Summary({
  history,
  estimatedLevel,
  elapsed,
  bestStreak,
}: {
  history: HistoryItem[];
  estimatedLevel: Level;
  elapsed: number;
  bestStreak: number;
}) {
  const total = history.length;
  const correct = history.filter((h) => h.correct).length;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;

  const tagStats = useMemo(() => {
    const m = new Map<string, { right: number; total: number }>();
    history.forEach((h) => {
      const t = h.question.context_tag;
      const s = m.get(t) ?? { right: 0, total: 0 };
      s.total++;
      if (h.correct) s.right++;
      m.set(t, s);
    });
    return [...m.entries()]
      .map(([tag, s]) => ({ tag, ...s, acc: s.total ? s.right / s.total : 0 }))
      .sort((a, b) => a.acc - b.acc);
  }, [history]);

  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-2xl mx-auto">
        <div className="rounded-3xl bg-card border border-border shadow-card p-8 md:p-10">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
            <Trophy className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl md:text-3xl font-bold text-primary text-center">
            Drill complete
          </h1>
          <p className="text-center text-sm text-muted-foreground mt-1">
            {total === 0 ? "No questions answered." : "Here's your breakdown."}
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Accuracy" value={`${accuracy}%`} sub={`${correct}/${total}`} />
            <Stat label="Time" value={formatTime(elapsed)} sub="this session" />
            <Stat label="Best streak" value={String(bestStreak)} sub="in a row" />
            <Stat label="Level" value={estimatedLevel} sub="estimated" />
          </div>

          {tagStats.length > 0 && (
            <div className="mt-8">
              <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-3">
                Accuracy by sub-topic
              </div>
              <div className="space-y-2">
                {tagStats.map((t) => (
                  <div key={t.tag}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground capitalize">
                        {t.tag.replace(/_/g, " ")}
                      </span>
                      <span className="text-muted-foreground">
                        {t.right}/{t.total} · {Math.round(t.acc * 100)}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all",
                          t.acc >= 0.75
                            ? "bg-success"
                            : t.acc >= 0.5
                              ? "bg-accent"
                              : "bg-destructive",
                        )}
                        style={{ width: `${t.acc * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {tagStats[0] && tagStats[0].acc < 0.6 && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Weakest area:{" "}
                  <span className="font-semibold text-foreground capitalize">
                    {tagStats[0].tag.replace(/_/g, " ")}
                  </span>
                  . Try a focused drill on it next.
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex gap-3 justify-center">
            <Button
              onClick={() => window.location.reload()}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Drill again
            </Button>
            <Link to="/dashboard">
              <Button variant="outline">Back to dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-muted/40 p-4">
      <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-primary">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}
