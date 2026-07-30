import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { BookOpen, Timer, Check, X, ArrowRight, Loader2, Trophy, TimerOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PracticeErrorState, PracticeRouteError } from "@/components/practice-error";
import { ReportIssueDialog } from "@/components/report-issue-dialog";
import { cn, shuffle } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/practice/reading")({
  component: ReadingPractice,
  errorComponent: PracticeRouteError,
});

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
type Level = (typeof LEVELS)[number];
const SESSION_PASSAGES = 4;

type Question = {
  id: string;
  type: string;
  cefr_level: Level;
  context_tag: string;
  prompt_text: string;
  options: string[];
  correct_answer: string;
  explanation: string | null;
};

type Passage = {
  id: string;
  title: string;
  body: string;
  cefr_level: Level;
  context_tag: string;
  questions: Question[];
};

type AnsweredQ = {
  question: Question;
  answer: string;
  correct: boolean;
};

type PassageResult = {
  passage: Passage;
  answers: AnsweredQ[];
  seconds: number | null;
};

function bumpLevel(l: Level, d: 1 | -1): Level {
  const i = LEVELS.indexOf(l);
  return LEVELS[Math.min(LEVELS.length - 1, Math.max(0, i + d))];
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function ReadingPractice() {
  const [pool, setPool] = useState<Passage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<Level>("A2");
  const [asked, setAsked] = useState<Set<string>>(new Set());
  const [streakRight, setStreakRight] = useState(0);
  const [streakWrong, setStreakWrong] = useState(0);
  const [results, setResults] = useState<PassageResult[]>([]);
  const [current, setCurrent] = useState<Passage | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data: u } = await supabase.auth.getUser();
        const [profileRes, passRes, qRes] = await Promise.all([
          u.user
            ? supabase
                .from("profiles")
                .select("current_estimated_level")
                .eq("id", u.user.id)
                .maybeSingle()
            : Promise.resolve({ data: null } as const),
          supabase.from("passages").select("*").eq("skill", "reading"),
          supabase
            .from("questions")
            .select("*")
            .eq("skill", "reading")
            .not("passage_id", "is", null),
        ]);
        if (passRes.error) throw passRes.error;
        if (qRes.error) throw qRes.error;
        const starting = (profileRes.data?.current_estimated_level as Level) ?? "A2";
        setLevel(starting);
        const qsByPassage = new Map<string, Question[]>();
        (qRes.data ?? []).forEach((q) => {
          if (!q.passage_id) return;
          // Guard against a malformed row (missing options/answer) breaking the session.
          if (!Array.isArray(q.options) || q.options.length === 0 || !q.correct_answer) return;
          const list = qsByPassage.get(q.passage_id) ?? [];
          list.push({
            id: q.id,
            type: q.type,
            cefr_level: q.cefr_level as Level,
            context_tag: q.context_tag,
            prompt_text: q.prompt_text,
            options: shuffle(q.options as string[]),
            correct_answer: q.correct_answer ?? "",
            explanation: q.explanation,
          });
          qsByPassage.set(q.passage_id, list);
        });
        const passages: Passage[] = (passRes.data ?? [])
          .map((p) => ({
            id: p.id,
            title: p.title,
            body: p.body,
            cefr_level: p.cefr_level as Level,
            context_tag: p.context_tag,
            questions: qsByPassage.get(p.id) ?? [],
          }))
          .filter((p) => p.questions.length > 0);
        setPool(passages);
      } catch (err) {
        console.error(err);
        setError("We couldn't load the reading passages. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pickNext = useCallback(
    (forLevel: Level, askedIds: Set<string>): Passage | null => {
      const remaining = pool.filter((p) => !askedIds.has(p.id));
      if (!remaining.length) return null;
      const tryLevels: Level[] = [forLevel];
      for (let d = 1; d < LEVELS.length; d++) {
        const i = LEVELS.indexOf(forLevel);
        if (i - d >= 0) tryLevels.push(LEVELS[i - d]);
        if (i + d < LEVELS.length) tryLevels.push(LEVELS[i + d]);
      }
      for (const lv of tryLevels) {
        const m = remaining.filter((p) => p.cefr_level === lv);
        if (m.length) return m[Math.floor(Math.random() * m.length)];
      }
      return remaining[0];
    },
    [pool],
  );

  // Start first passage
  useEffect(() => {
    if (loading || current || done) return;
    const next = pickNext(level, asked);
    if (!next) {
      setDone(true);
      return;
    }
    setCurrent(next);
    setElapsed(0);
    startRef.current = timerEnabled ? Date.now() : null;
  }, [loading, current, done, level, asked, pickNext, timerEnabled]);

  // Timer tick
  useEffect(() => {
    if (!timerEnabled || submitted || !current || startRef.current === null) return;
    const t = setInterval(() => {
      if (startRef.current !== null) {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
      }
    }, 250);
    return () => clearInterval(t);
  }, [timerEnabled, submitted, current]);

  // React to timer toggle while a passage is showing
  useEffect(() => {
    if (!current || submitted) return;
    if (timerEnabled && startRef.current === null) {
      startRef.current = Date.now() - elapsed * 1000;
    } else if (!timerEnabled) {
      startRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerEnabled]);

  async function submit() {
    if (!current || submitted) return;
    if (current.questions.some((q) => !answers[q.id])) return;
    const seconds =
      timerEnabled && startRef.current !== null
        ? Math.max(1, Math.floor((Date.now() - startRef.current) / 1000))
        : null;
    setSubmitted(true);
    const graded: AnsweredQ[] = current.questions.map((q) => ({
      question: q,
      answer: answers[q.id],
      correct: answers[q.id] === q.correct_answer,
    }));
    setResults((r) => [...r, { passage: current, answers: graded, seconds }]);
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      await supabase.from("attempts").insert(
        graded.map((g) => ({
          user_id: u.user!.id,
          question_id: g.question.id,
          skill: "reading" as const,
          cefr_level: g.question.cefr_level,
          user_answer: g.answer,
          is_correct: g.correct,
          score: g.correct ? 1 : 0,
        })),
      );
    }
  }

  function next() {
    if (!current) return;
    const last = results[results.length - 1];
    const acc = last ? last.answers.filter((a) => a.correct).length / last.answers.length : 0;
    let newRight = streakRight;
    let newWrong = streakWrong;
    if (acc >= 0.75) {
      newRight += 1;
      newWrong = 0;
    } else if (acc <= 0.25) {
      newWrong += 1;
      newRight = 0;
    } else {
      newRight = 0;
      newWrong = 0;
    }
    let newLevel = level;
    if (newRight >= 2 && level !== "C2") {
      newLevel = bumpLevel(level, 1);
      newRight = 0;
      newWrong = 0;
    } else if (newWrong >= 2 && level !== "A1") {
      newLevel = bumpLevel(level, -1);
      newRight = 0;
      newWrong = 0;
    }
    setLevel(newLevel);
    setStreakRight(newRight);
    setStreakWrong(newWrong);
    const newAsked = new Set(asked);
    newAsked.add(current.id);
    setAsked(newAsked);
    setAnswers({});
    setSubmitted(false);
    setElapsed(0);
    startRef.current = null;
    if (results.length >= SESSION_PASSAGES || newAsked.size >= pool.length) {
      setDone(true);
      setCurrent(null);
      return;
    }
    const nextP = pickNext(newLevel, newAsked);
    if (!nextP) {
      setDone(true);
      setCurrent(null);
      return;
    }
    setCurrent(nextP);
    startRef.current = timerEnabled ? Date.now() : null;
  }

  if (error) {
    return <PracticeErrorState message={error} />;
  }

  if (loading) {
    return (
      <AppShell>
        <div className="p-10 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading session…
        </div>
      </AppShell>
    );
  }

  if (!loading && pool.length === 0) {
    return (
      <PracticeErrorState message="No reading passages are available right now. Please try again later." />
    );
  }

  if (done || !current) {
    return <Summary results={results} estimatedLevel={level} />;
  }

  const totalAnswered = current.questions.filter((q) => answers[q.id]).length;
  const allAnswered = totalAnswered === current.questions.length;

  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Link to="/practice" className="hover:text-foreground">
            ← All practice
          </Link>
          <div>
            Passage {results.length + 1} of {SESSION_PASSAGES}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <BookOpen className="h-6 w-6 text-accent" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Reading practice</h1>
          <span className="text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            {current.cefr_level} · {current.context_tag.replace("_", " ")}
          </span>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              {timerEnabled ? (
                <Timer className="h-4 w-4 text-accent" />
              ) : (
                <TimerOff className="h-4 w-4 text-muted-foreground" />
              )}
              <Switch
                checked={timerEnabled}
                onCheckedChange={setTimerEnabled}
                aria-label="Toggle timer"
              />
              <span
                className={cn(
                  "font-mono tabular-nums",
                  timerEnabled ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {formatTime(elapsed)}
              </span>
            </div>
          </div>
        </div>
        {!timerEnabled && (
          <p className="mt-1 text-xs text-muted-foreground">
            Tip: the real CLOE reading section is timed. Turn the timer on to simulate exam
            conditions.
          </p>
        )}

        <div className="mt-6 grid lg:grid-cols-5 gap-6">
          {/* Passage */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-card border border-border shadow-card p-6 lg:sticky lg:top-6">
              <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                {current.title}
              </div>
              <div className="mt-3 text-sm md:text-base text-foreground/90 whitespace-pre-line leading-relaxed">
                {current.body}
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                {wordCount(current.body)} words
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="lg:col-span-3 space-y-5">
            {current.questions.map((q, idx) => {
              const picked = answers[q.id];
              const isCorrect = submitted && picked === q.correct_answer;
              const isWrong = submitted && picked && picked !== q.correct_answer;
              return (
                <div
                  key={q.id}
                  className="rounded-3xl bg-card border border-border shadow-card p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold text-foreground">
                      <span className="text-muted-foreground mr-1.5">{idx + 1}.</span>
                      {q.prompt_text}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      {q.type === "gap_fill" ? "Gap-fill" : q.options.length === 2 ? "T/F" : "MCQ"}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "mt-3 grid gap-2",
                      q.options.length <= 2 ? "grid-cols-2" : "sm:grid-cols-2",
                    )}
                  >
                    {q.options.map((opt) => {
                      const sel = picked === opt;
                      const right = submitted && opt === q.correct_answer;
                      const wrongPick = submitted && sel && opt !== q.correct_answer;
                      return (
                        <button
                          key={opt}
                          onClick={() => !submitted && setAnswers((a) => ({ ...a, [q.id]: opt }))}
                          disabled={submitted}
                          className={cn(
                            "text-left rounded-xl border-2 p-3 text-sm transition flex items-start gap-2 bg-card",
                            !submitted && sel && "border-accent bg-accent/5",
                            !submitted && !sel && "border-border hover:border-accent/50",
                            right && "border-success bg-success/10",
                            wrongPick && "border-destructive bg-destructive/10",
                            submitted && !right && !wrongPick && "border-border opacity-60",
                          )}
                        >
                          <div
                            className={cn(
                              "h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                              !submitted && sel && "border-accent bg-accent",
                              !submitted && !sel && "border-muted-foreground/30",
                              right && "border-success bg-success text-white",
                              wrongPick && "border-destructive bg-destructive text-white",
                            )}
                          >
                            {right && <Check className="h-3 w-3" />}
                            {wrongPick && <X className="h-3 w-3" />}
                          </div>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <div
                      className={cn(
                        "mt-3 rounded-xl p-3 text-sm border",
                        isCorrect
                          ? "border-success/30 bg-success/5 text-foreground"
                          : isWrong
                            ? "border-destructive/30 bg-destructive/5 text-foreground"
                            : "border-border bg-muted/30",
                      )}
                    >
                      <div className="font-semibold flex items-center gap-1.5">
                        {isCorrect ? (
                          <>
                            <Check className="h-4 w-4 text-success" /> Correct
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 text-destructive" /> Answer: {q.correct_answer}
                          </>
                        )}
                      </div>
                      {q.explanation && <p className="mt-1 text-foreground/80">{q.explanation}</p>}
                      <div className="mt-2">
                        <ReportIssueDialog questionId={q.id} userAnswer={picked} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                {submitted
                  ? `${results[results.length - 1]?.answers.filter((a) => a.correct).length}/${current.questions.length} correct`
                  : `${totalAnswered}/${current.questions.length} answered`}
              </div>
              {!submitted ? (
                <Button
                  onClick={submit}
                  disabled={!allAnswered}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Submit
                </Button>
              ) : (
                <Button
                  onClick={next}
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
                >
                  Next passage <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function Summary({ results, estimatedLevel }: { results: PassageResult[]; estimatedLevel: Level }) {
  const allAnswers = results.flatMap((r) => r.answers);
  const total = allAnswers.length;
  const correct = allAnswers.filter((a) => a.correct).length;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;

  const wpm = useMemo(() => {
    const timed = results.filter((r) => r.seconds !== null && r.seconds > 0);
    if (!timed.length) return null;
    const totalWords = timed.reduce((s, r) => s + wordCount(r.passage.body), 0);
    const totalSec = timed.reduce((s, r) => s + (r.seconds ?? 0), 0);
    return Math.round(totalWords / (totalSec / 60));
  }, [results]);

  const weakestTag = useMemo(() => {
    const m = new Map<string, { right: number; total: number }>();
    allAnswers.forEach((a) => {
      const t = a.question.context_tag;
      const s = m.get(t) ?? { right: 0, total: 0 };
      s.total++;
      if (a.correct) s.right++;
      m.set(t, s);
    });
    const arr = [...m.entries()].map(([tag, s]) => ({ tag, ...s, acc: s.right / s.total }));
    return arr.length ? arr.sort((a, b) => a.acc - b.acc)[0] : null;
  }, [allAnswers]);

  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-2xl mx-auto">
        <div className="rounded-3xl bg-card border border-border shadow-card p-8 md:p-10">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
            <Trophy className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl md:text-3xl font-bold text-primary text-center">
            Session complete
          </h1>
          <p className="text-center text-sm text-muted-foreground mt-1">
            {total === 0 ? "No questions answered." : "Here's how this reading session went."}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Stat label="Accuracy" value={`${accuracy}%`} sub={`${correct}/${total} correct`} />
            <Stat label="Estimated level" value={estimatedLevel} sub="Reading, this session" />
            <Stat
              label="Reading speed"
              value={wpm !== null ? `${wpm}` : "—"}
              sub={wpm !== null ? "words / min (timed only)" : "Turn timer on to measure"}
            />
            <Stat
              label="Weakest context"
              value={weakestTag ? weakestTag.tag.replace("_", " ") : "—"}
              sub={weakestTag ? `${weakestTag.right}/${weakestTag.total} correct` : ""}
            />
          </div>

          <div className="mt-8 flex gap-3 justify-center">
            <Button
              onClick={() => window.location.reload()}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Practice again
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
    <div className="rounded-2xl bg-muted/40 p-5 text-center">
      <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-extrabold text-primary capitalize">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}
