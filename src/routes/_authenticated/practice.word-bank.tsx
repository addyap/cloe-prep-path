import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { LayoutGrid, Check, X, ArrowRight, Loader2, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { PracticeErrorState, PracticeRouteError } from "@/components/practice-error";
import { ReportIssueDialog } from "@/components/report-issue-dialog";
import { cn, shuffle, splitBlanks, gradeAnswer } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/practice/word-bank")({
  component: WordBankPractice,
  errorComponent: PracticeRouteError,
});

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
type Level = (typeof LEVELS)[number];
const SESSION_PASSAGES = 3;

type Blank = {
  id: string;
  ordinal: number;
  cefr_level: Level;
  context_tag: string;
  correct_answer: string;
  explanation: string | null;
};

type Passage = {
  id: string;
  title: string;
  body: string;
  cefr_level: Level;
  context_tag: string;
  wordBank: string[];
  blanks: Blank[];
};

type AnsweredBlank = {
  blank: Blank;
  answer: string;
  correct: boolean;
};

type PassageResult = {
  passage: Passage;
  answers: AnsweredBlank[];
};

function bumpLevel(l: Level, d: 1 | -1): Level {
  const i = LEVELS.indexOf(l);
  return LEVELS[Math.min(LEVELS.length - 1, Math.max(0, i + d))];
}

/** Every {{n}} token in the body must have a matching ordinal=n question row
 *  and vice versa, every correct answer must actually be in the shared pool,
 *  and correct answers must be distinct — otherwise the single shared pool
 *  can't be consumed cleanly (two blanks wanting the same word) or a blank
 *  would have no valid chip to place. Drop the whole passage rather than
 *  render it half-broken. */
function isWellFormed(p: Passage): boolean {
  if (p.blanks.length === 0) return false;
  const tokenOrdinals = splitBlanks(p.body)
    .map((seg) => seg.match(/^\{\{(\d+)\}\}$/)?.[1])
    .filter((n): n is string => n !== undefined)
    .map(Number)
    .sort((a, b) => a - b);
  const rowOrdinals = p.blanks.map((b) => b.ordinal).sort((a, b) => a - b);
  if (tokenOrdinals.length !== rowOrdinals.length) return false;
  if (tokenOrdinals.some((n, i) => n !== rowOrdinals[i])) return false;
  const answers = p.blanks.map((b) => b.correct_answer);
  if (new Set(answers).size !== answers.length) return false;
  return answers.every((a) => p.wordBank.includes(a));
}

function WordBankPractice() {
  const [pool, setPool] = useState<Passage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<Level>("A2");
  const [asked, setAsked] = useState<Set<string>>(new Set());
  const [streakRight, setStreakRight] = useState(0);
  const [streakWrong, setStreakWrong] = useState(0);
  const [results, setResults] = useState<PassageResult[]>([]);
  const [current, setCurrent] = useState<Passage | null>(null);
  const [filled, setFilled] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
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
          supabase
            .from("passages")
            .select("*")
            .eq("skill", "grammar_vocab")
            .not("word_bank", "is", null),
          supabase
            .from("questions")
            .select("*")
            .eq("skill", "grammar_vocab")
            .eq("type", "word_bank")
            .not("passage_id", "is", null),
        ]);
        if (passRes.error) throw passRes.error;
        if (qRes.error) throw qRes.error;
        const starting = (profileRes.data?.current_estimated_level as Level) ?? "A2";
        setLevel(starting);
        const blanksByPassage = new Map<string, Blank[]>();
        (qRes.data ?? []).forEach((q) => {
          if (!q.passage_id || q.ordinal === null || !q.correct_answer) return;
          const list = blanksByPassage.get(q.passage_id) ?? [];
          list.push({
            id: q.id,
            ordinal: q.ordinal,
            cefr_level: q.cefr_level as Level,
            context_tag: q.context_tag,
            correct_answer: q.correct_answer,
            explanation: q.explanation,
          });
          blanksByPassage.set(q.passage_id, list);
        });
        const passages: Passage[] = (passRes.data ?? [])
          .map((p) => ({
            id: p.id,
            title: p.title,
            body: p.body,
            cefr_level: p.cefr_level as Level,
            context_tag: p.context_tag,
            wordBank: Array.isArray(p.word_bank) ? (p.word_bank as string[]) : [],
            blanks: (blanksByPassage.get(p.id) ?? []).sort((a, b) => a.ordinal - b.ordinal),
          }))
          .filter(isWellFormed);
        setPool(passages);
      } catch (err) {
        console.error(err);
        setError("We couldn't load the word-bank passages. Please try again.");
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

  useEffect(() => {
    if (loading || current || done) return;
    const next = pickNext(level, asked);
    if (!next) {
      setDone(true);
      return;
    }
    setCurrent(next);
  }, [loading, current, done, level, asked, pickNext]);

  const tray = useMemo(() => (current ? shuffle(current.wordBank) : []), [current]);
  const usedWords = new Set(Object.values(filled));
  const availableChips = tray.filter((w) => !usedWords.has(w));

  function placeChip(word: string) {
    if (!current || submitted) return;
    const targetOrdinal =
      selected !== null && filled[selected] === undefined
        ? selected
        : current.blanks.find((b) => filled[b.ordinal] === undefined)?.ordinal;
    if (targetOrdinal === undefined) return;
    setFilled((f) => ({ ...f, [targetOrdinal]: word }));
    const nextEmpty = current.blanks.find(
      (b) => b.ordinal !== targetOrdinal && filled[b.ordinal] === undefined,
    );
    setSelected(nextEmpty ? nextEmpty.ordinal : null);
  }

  function clearBlank(ordinal: number) {
    if (submitted) return;
    setFilled((f) => {
      const next = { ...f };
      delete next[ordinal];
      return next;
    });
    setSelected(ordinal);
  }

  async function submit() {
    if (!current || submitted) return;
    if (current.blanks.some((b) => filled[b.ordinal] === undefined)) return;
    setSubmitted(true);
    const graded: AnsweredBlank[] = current.blanks.map((b) => ({
      blank: b,
      answer: filled[b.ordinal],
      correct: gradeAnswer("word_bank", filled[b.ordinal], b.correct_answer),
    }));
    setResults((r) => [...r, { passage: current, answers: graded }]);
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      await supabase.from("attempts").insert(
        graded.map((g) => ({
          user_id: u.user!.id,
          question_id: g.blank.id,
          skill: "grammar_vocab" as const,
          cefr_level: g.blank.cefr_level,
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
    setFilled({});
    setSelected(null);
    setSubmitted(false);
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
      <PracticeErrorState message="No word-bank passages are available right now. Please try again later." />
    );
  }

  if (done || !current) {
    return <Summary results={results} estimatedLevel={level} />;
  }

  const allFilled = current.blanks.every((b) => filled[b.ordinal] !== undefined);
  const segments = splitBlanks(current.body);

  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Link to="/practice" className="hover:text-foreground">
            ← All practice
          </Link>
          <div>
            Passage {results.length + 1} of {SESSION_PASSAGES}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <LayoutGrid className="h-6 w-6 text-accent" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Word bank</h1>
          <span className="text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            {current.cefr_level} · {current.context_tag.replace("_", " ")}
          </span>
        </div>

        <div className="mt-6 rounded-3xl bg-card border border-border shadow-card p-6">
          <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
            {current.title}
          </div>
          <div className="mt-3 text-sm md:text-base text-foreground/90 leading-loose">
            {segments.map((seg, i) => {
              const m = seg.match(/^\{\{(\d+)\}\}$/);
              if (!m) return <span key={i}>{seg}</span>;
              const ordinal = Number(m[1]);
              const blank = current.blanks.find((b) => b.ordinal === ordinal);
              if (!blank) return null;
              const word = filled[ordinal];
              const isSelected = selected === ordinal && !submitted;
              const isCorrect = submitted && word === blank.correct_answer;
              const isWrong = submitted && word !== undefined && word !== blank.correct_answer;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={submitted}
                  onClick={() => (word !== undefined ? clearBlank(ordinal) : setSelected(ordinal))}
                  className={cn(
                    "inline-flex mx-1 min-w-[5rem] justify-center rounded-lg border-2 px-2 py-0.5 align-baseline font-semibold transition",
                    !submitted &&
                      !isSelected &&
                      word === undefined &&
                      "border-dashed border-muted-foreground/40 text-muted-foreground/60",
                    !submitted && isSelected && "border-accent bg-accent/10 text-foreground",
                    !submitted &&
                      word !== undefined &&
                      !isSelected &&
                      "border-accent/60 bg-accent/5 text-foreground",
                    isCorrect && "border-success bg-success/10 text-foreground",
                    isWrong && "border-destructive bg-destructive/10 text-foreground",
                  )}
                >
                  {word ?? "     "}
                </button>
              );
            })}
          </div>
        </div>

        {!submitted && (
          <div className="mt-5 rounded-3xl bg-card border border-border shadow-card p-5">
            <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-3">
              Word bank
            </div>
            <div className="flex flex-wrap gap-2">
              {availableChips.map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => placeChip(word)}
                  className="rounded-xl border-2 border-border bg-card px-3 py-1.5 text-base text-foreground hover:border-accent/60 hover:bg-accent/5 transition"
                >
                  {word}
                </button>
              ))}
              {availableChips.length === 0 && (
                <span className="text-sm text-muted-foreground/60 py-1.5">All words placed.</span>
              )}
            </div>
          </div>
        )}

        {submitted && (
          <div className="mt-5 space-y-3">
            {current.blanks.map((b, idx) => {
              const answer = filled[b.ordinal];
              const correct = answer === b.correct_answer;
              return (
                <div
                  key={b.id}
                  className={cn(
                    "rounded-2xl p-4 border-2 flex items-start gap-3",
                    correct
                      ? "border-success/30 bg-success/5"
                      : "border-destructive/30 bg-destructive/5",
                  )}
                >
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white",
                      correct ? "bg-success" : "bg-destructive",
                    )}
                  >
                    {correct ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-foreground">
                      Blank {idx + 1}: {correct ? "Correct" : `Answer: ${b.correct_answer}`}
                    </div>
                    {b.explanation && <p className="mt-1 text-foreground/80">{b.explanation}</p>}
                    <div className="mt-2">
                      <ReportIssueDialog questionId={b.id} userAnswer={answer} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {submitted
              ? `${results[results.length - 1]?.answers.filter((a) => a.correct).length}/${current.blanks.length} correct`
              : `${Object.keys(filled).length}/${current.blanks.length} filled`}
          </div>
          {!submitted ? (
            <Button
              onClick={submit}
              disabled={!allFilled}
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
    </AppShell>
  );
}

function Summary({ results, estimatedLevel }: { results: PassageResult[]; estimatedLevel: Level }) {
  const allAnswers = results.flatMap((r) => r.answers);
  const total = allAnswers.length;
  const correct = allAnswers.filter((a) => a.correct).length;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;

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
            {total === 0 ? "No blanks answered." : "Here's how this word-bank session went."}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Stat label="Accuracy" value={`${accuracy}%`} sub={`${correct}/${total} correct`} />
            <Stat label="Estimated level" value={estimatedLevel} sub="Word bank, this session" />
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
