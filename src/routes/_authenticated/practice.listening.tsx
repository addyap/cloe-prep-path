import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Check,
  X,
  ArrowRight,
  Headphones,
  Loader2,
  Trophy,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { PracticeErrorState, PracticeRouteError } from "@/components/practice-error";
import { ReportIssueDialog } from "@/components/report-issue-dialog";
import { cn, extractSpokenScript, shuffle } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/practice/listening")({
  component: ListeningPractice,
  errorComponent: PracticeRouteError,
});

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
type Level = (typeof LEVELS)[number];
const MAX_PLAYS = 2;
const SESSION_LENGTH = 6;

/**
 * A listening session mixes two shapes: single-sentence standalone items
 * (the original format — one short "You hear:" script, one question) and
 * multi-question passages (a longer dialogue/monologue with 2-4 linked
 * questions, mirroring reading's passage architecture). Both are graded
 * into the same accuracy-based adaptive leveling, so they share one pool.
 */
type SingleUnit = {
  kind: "single";
  id: string;
  cefr_level: Level;
  context_tag: string;
  prompt_text: string;
  audio_url: string | null;
  options: string[];
  correct_answer: string;
  explanation: string | null;
};

type PassageQuestion = {
  id: string;
  prompt_text: string;
  options: string[];
  correct_answer: string;
  explanation: string | null;
};

type PassageUnit = {
  kind: "passage";
  id: string;
  title: string;
  body: string;
  audio_url: string | null;
  cefr_level: Level;
  context_tag: string;
  questions: PassageQuestion[];
};

type SessionUnit = SingleUnit | PassageUnit;

type UnitResult = {
  unit: SessionUnit;
  answers: Record<string, string>; // questionId -> chosen option (single unit uses its own id as key)
  correctCount: number;
  totalCount: number;
};

function bumpLevel(level: Level, delta: 1 | -1): Level {
  const i = LEVELS.indexOf(level);
  const next = Math.min(LEVELS.length - 1, Math.max(0, i + delta));
  return LEVELS[next];
}

function unitAccuracy(r: UnitResult): number {
  return r.totalCount === 0 ? 0 : r.correctCount / r.totalCount;
}

function ListeningPractice() {
  const [pool, setPool] = useState<SessionUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<Level>("A2");
  const [asked, setAsked] = useState<Set<string>>(new Set());
  const [streakRight, setStreakRight] = useState(0);
  const [streakWrong, setStreakWrong] = useState(0);
  const [results, setResults] = useState<UnitResult[]>([]);
  const [current, setCurrent] = useState<SessionUnit | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [plays, setPlays] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [done, setDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: u } = await supabase.auth.getUser();
        const [profileRes, singlesRes, passagesRes, passageQsRes] = await Promise.all([
          u.user
            ? supabase
                .from("profiles")
                .select("current_estimated_level")
                .eq("id", u.user.id)
                .maybeSingle()
            : Promise.resolve({ data: null } as const),
          supabase.from("questions").select("*").eq("skill", "listening").is("passage_id", null),
          supabase.from("passages").select("*").eq("skill", "listening"),
          supabase
            .from("questions")
            .select("*")
            .eq("skill", "listening")
            .not("passage_id", "is", null),
        ]);
        if (singlesRes.error) throw singlesRes.error;
        if (passagesRes.error) throw passagesRes.error;
        if (passageQsRes.error) throw passageQsRes.error;

        const starting = (profileRes.data?.current_estimated_level as Level) ?? "A2";
        setLevel(starting);

        const singleUnits: SingleUnit[] = (singlesRes.data ?? [])
          .map((q) => ({
            kind: "single" as const,
            id: q.id,
            cefr_level: q.cefr_level as Level,
            context_tag: q.context_tag,
            prompt_text: q.prompt_text,
            audio_url: q.audio_url,
            options: Array.isArray(q.options) ? shuffle(q.options as string[]) : [],
            correct_answer: q.correct_answer ?? "",
            explanation: q.explanation,
          }))
          // Guard against a malformed row (missing options/answer) breaking the session.
          .filter((q) => q.options.length > 0 && q.correct_answer);

        const qsByPassage = new Map<string, PassageQuestion[]>();
        (passageQsRes.data ?? []).forEach((q) => {
          if (!q.passage_id) return;
          if (!Array.isArray(q.options) || q.options.length === 0 || !q.correct_answer) return;
          const list = qsByPassage.get(q.passage_id) ?? [];
          list.push({
            id: q.id,
            prompt_text: q.prompt_text,
            options: shuffle(q.options as string[]),
            correct_answer: q.correct_answer,
            explanation: q.explanation,
          });
          qsByPassage.set(q.passage_id, list);
        });
        const passageUnits: PassageUnit[] = (passagesRes.data ?? [])
          .map((p) => ({
            kind: "passage" as const,
            id: p.id,
            title: p.title,
            body: p.body,
            audio_url: p.audio_url,
            cefr_level: p.cefr_level as Level,
            context_tag: p.context_tag,
            questions: qsByPassage.get(p.id) ?? [],
          }))
          .filter((p) => p.questions.length > 0);

        setPool([...singleUnits, ...passageUnits]);
      } catch (err) {
        console.error(err);
        setError("We couldn't load the listening questions. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pickNext = useCallback(
    (forLevel: Level, askedIds: Set<string>): SessionUnit | null => {
      const remaining = pool.filter((u) => !askedIds.has(u.id));
      if (remaining.length === 0) return null;
      const tryLevels: Level[] = [forLevel];
      for (let d = 1; d < LEVELS.length; d++) {
        const idx = LEVELS.indexOf(forLevel);
        if (idx - d >= 0) tryLevels.push(LEVELS[idx - d]);
        if (idx + d < LEVELS.length) tryLevels.push(LEVELS[idx + d]);
      }
      for (const lv of tryLevels) {
        const match = remaining.filter((u) => u.cefr_level === lv);
        if (match.length) return match[Math.floor(Math.random() * match.length)];
      }
      return remaining[0];
    },
    [pool],
  );

  // Start first unit once pool ready
  useEffect(() => {
    if (loading || current || done) return;
    const next = pickNext(level, asked);
    if (!next) {
      setDone(true);
      return;
    }
    setCurrent(next);
  }, [loading, current, done, level, asked, pickNext]);

  // Stop audio when unit changes / unmount
  useEffect(() => {
    return () => stopAudio();
  }, [current?.id]);

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }

  function playAudio() {
    if (!current) return;
    if (plays >= MAX_PLAYS) return;
    stopAudio();
    const audioUrl = current.kind === "single" ? current.audio_url : current.audio_url;
    const spokenText =
      current.kind === "single" ? extractSpokenScript(current.prompt_text) : current.body;
    if (audioUrl) {
      if (!audioRef.current || audioRef.current.src !== audioUrl) {
        audioRef.current = new Audio(audioUrl);
      }
      const el = audioRef.current;
      el.playbackRate = rate;
      el.onended = () => setIsPlaying(false);
      el.onpause = () => setIsPlaying(false);
      void el.play();
      setIsPlaying(true);
    } else if (typeof window !== "undefined" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(spokenText);
      u.rate = rate;
      u.lang = "en-US";
      u.onend = () => setIsPlaying(false);
      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
      setIsPlaying(true);
    }
    setPlays((p) => p + 1);
  }

  function pauseAudio() {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    if (typeof window !== "undefined" && window.speechSynthesis?.speaking) {
      window.speechSynthesis.pause();
    }
    setIsPlaying(false);
  }

  async function submit() {
    if (!current || submitted) return;
    if (current.kind === "single") {
      if (!answers[current.id]) return;
    } else {
      if (current.questions.some((q) => !answers[q.id])) return;
    }
    setSubmitted(true);
    stopAudio();

    let correctCount = 0;
    let totalCount = 0;
    const attemptRows: {
      question_id: string;
      cefr_level: Level;
      user_answer: string;
      is_correct: boolean;
    }[] = [];

    if (current.kind === "single") {
      totalCount = 1;
      const isCorrect = answers[current.id] === current.correct_answer;
      if (isCorrect) correctCount = 1;
      attemptRows.push({
        question_id: current.id,
        cefr_level: current.cefr_level,
        user_answer: answers[current.id],
        is_correct: isCorrect,
      });
    } else {
      totalCount = current.questions.length;
      current.questions.forEach((q) => {
        const isCorrect = answers[q.id] === q.correct_answer;
        if (isCorrect) correctCount++;
        attemptRows.push({
          question_id: q.id,
          cefr_level: current.cefr_level,
          user_answer: answers[q.id],
          is_correct: isCorrect,
        });
      });
    }

    setResults((r) => [...r, { unit: current, answers, correctCount, totalCount }]);

    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      await supabase.from("attempts").insert(
        attemptRows.map((a) => ({
          user_id: u.user!.id,
          question_id: a.question_id,
          skill: "listening" as const,
          cefr_level: a.cefr_level,
          user_answer: a.user_answer,
          is_correct: a.is_correct,
          score: a.is_correct ? 1 : 0,
        })),
      );
    }
  }

  function next() {
    if (!current) return;
    const last = results[results.length - 1];
    const acc = last ? unitAccuracy(last) : 0;
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
    setPlays(0);
    if (results.length >= SESSION_LENGTH || newAsked.size >= pool.length) {
      setDone(true);
      setCurrent(null);
      return;
    }
    const nextU = pickNext(newLevel, newAsked);
    if (!nextU) {
      setDone(true);
      setCurrent(null);
      return;
    }
    setCurrent(nextU);
  }

  const progress = results.length;
  const playsLeft = MAX_PLAYS - plays;

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
      <PracticeErrorState message="No listening questions are available right now. Please try again later." />
    );
  }

  if (done || !current) {
    return <Summary results={results} estimatedLevel={level} />;
  }

  return (
    <AppShell>
      <div
        className={cn(
          "p-5 md:p-10 mx-auto",
          current.kind === "passage" ? "max-w-5xl" : "max-w-3xl",
        )}
      >
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Link to="/practice" className="hover:text-foreground">
            ← All practice
          </Link>
          <div>
            Item {progress + 1} of {SESSION_LENGTH}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <Headphones className="h-6 w-6 text-accent" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Listening practice</h1>
          <span className="ml-auto text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            {current.cefr_level} · {current.context_tag.replace("_", " ")}
          </span>
        </div>

        {/* Audio player */}
        <div className="mt-6 rounded-3xl bg-card border border-border shadow-card p-6">
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              size="lg"
              onClick={isPlaying ? pauseAudio : playAudio}
              disabled={!isPlaying && plays >= MAX_PLAYS}
              className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 w-14 rounded-full p-0"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                stopAudio();
                playAudio();
              }}
              disabled={plays >= MAX_PLAYS}
              className="gap-1.5"
            >
              <RotateCcw className="h-4 w-4" /> Replay
            </Button>
            <div className="flex items-center gap-1 ml-1">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              {[0.75, 1].map((r) => (
                <button
                  key={r}
                  onClick={() => setRate(r)}
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-md transition",
                    rate === r
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {r}x
                </button>
              ))}
            </div>
            <div className="ml-auto text-xs text-muted-foreground">
              Plays left:{" "}
              <strong className={cn(playsLeft === 0 && "text-destructive")}>
                {playsLeft}/{MAX_PLAYS}
              </strong>
            </div>
          </div>
          {submitted && (
            <p className="mt-4 text-sm text-muted-foreground italic border-l-2 border-border pl-3 whitespace-pre-line">
              {current.kind === "single" ? current.prompt_text : current.body}
            </p>
          )}
        </div>

        {current.kind === "single" ? (
          <SingleUnitBody
            unit={current}
            selected={answers[current.id] ?? null}
            onSelect={(opt) => !submitted && setAnswers({ [current.id]: opt })}
            submitted={submitted}
            lastResult={submitted ? results[results.length - 1] : null}
          />
        ) : (
          <PassageUnitBody
            unit={current}
            answers={answers}
            onSelect={(qId, opt) => !submitted && setAnswers((a) => ({ ...a, [qId]: opt }))}
            submitted={submitted}
          />
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {submitted && current.kind === "passage" && results[results.length - 1]
              ? `${results[results.length - 1].correctCount}/${results[results.length - 1].totalCount} correct`
              : null}
          </div>
          {!submitted ? (
            <Button
              onClick={submit}
              disabled={
                current.kind === "single"
                  ? !answers[current.id]
                  : current.questions.some((q) => !answers[q.id])
              }
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 ml-auto"
            >
              Submit
            </Button>
          ) : (
            <Button
              onClick={next}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 ml-auto"
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function extractQuestion(text: string): string {
  // Pull trailing question after the audio quote, if any.
  const m = text.match(/["”][^"”]*$/);
  if (m) {
    const after = text.slice(text.lastIndexOf(m[0]) + 1).trim();
    if (after.length > 4) return after;
  }
  const parts = text.split(/(?<=[?!.])\s+/);
  return parts[parts.length - 1] || text;
}

function SingleUnitBody({
  unit,
  selected,
  onSelect,
  submitted,
  lastResult,
}: {
  unit: SingleUnit;
  selected: string | null;
  onSelect: (opt: string) => void;
  submitted: boolean;
  lastResult: UnitResult | null;
}) {
  return (
    <>
      <div className="mt-6">
        <div className="text-base md:text-lg font-semibold text-foreground">
          {extractQuestion(unit.prompt_text)}
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {unit.options.map((opt) => {
            const isSel = selected === opt;
            const isRight = submitted && opt === unit.correct_answer;
            const isWrongPick = submitted && isSel && opt !== unit.correct_answer;
            return (
              <button
                key={opt}
                onClick={() => onSelect(opt)}
                disabled={submitted}
                className={cn(
                  "text-left rounded-2xl border-2 p-4 transition flex items-start gap-3",
                  "bg-card",
                  !submitted && isSel && "border-accent bg-accent/5",
                  !submitted && !isSel && "border-border hover:border-accent/50",
                  isRight && "border-success bg-success/10",
                  isWrongPick && "border-destructive bg-destructive/10",
                  submitted && !isRight && !isWrongPick && "border-border opacity-60",
                )}
              >
                <div
                  className={cn(
                    "h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                    !submitted && isSel && "border-accent bg-accent text-accent-foreground",
                    !submitted && !isSel && "border-muted-foreground/30",
                    isRight && "border-success bg-success text-white",
                    isWrongPick && "border-destructive bg-destructive text-white",
                  )}
                >
                  {isRight && <Check className="h-4 w-4" />}
                  {isWrongPick && <X className="h-4 w-4" />}
                </div>
                <span className="text-sm md:text-base text-foreground">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {submitted && (
        <div
          className={cn(
            "mt-5 rounded-2xl p-4 border-2",
            lastResult?.correctCount === 1
              ? "border-success/30 bg-success/5"
              : "border-destructive/30 bg-destructive/5",
          )}
        >
          <div className="flex items-center gap-2 font-semibold">
            {lastResult?.correctCount === 1 ? (
              <>
                <Check className="h-5 w-5 text-success" />{" "}
                <span className="text-success">Correct</span>
              </>
            ) : (
              <>
                <X className="h-5 w-5 text-destructive" />{" "}
                <span className="text-destructive">Not quite</span>
              </>
            )}
          </div>
          {unit.explanation && (
            <p className="text-sm mt-2 text-foreground/80">{unit.explanation}</p>
          )}
          <div className="mt-3">
            <ReportIssueDialog questionId={unit.id} userAnswer={selected} />
          </div>
        </div>
      )}
    </>
  );
}

function PassageUnitBody({
  unit,
  answers,
  onSelect,
  submitted,
}: {
  unit: PassageUnit;
  answers: Record<string, string>;
  onSelect: (questionId: string, opt: string) => void;
  submitted: boolean;
}) {
  return (
    <div className="mt-6 space-y-5">
      {unit.questions.map((q, idx) => {
        const picked = answers[q.id];
        const isCorrect = submitted && picked === q.correct_answer;
        const isWrong = submitted && picked && picked !== q.correct_answer;
        return (
          <div key={q.id} className="rounded-3xl bg-card border border-border shadow-card p-5">
            <div className="text-sm font-semibold text-foreground">
              <span className="text-muted-foreground mr-1.5">{idx + 1}.</span>
              {q.prompt_text}
            </div>
            <div className="mt-3 grid sm:grid-cols-2 gap-2">
              {q.options.map((opt) => {
                const sel = picked === opt;
                const right = submitted && opt === q.correct_answer;
                const wrongPick = submitted && sel && opt !== q.correct_answer;
                return (
                  <button
                    key={opt}
                    onClick={() => onSelect(q.id, opt)}
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
    </div>
  );
}

function Summary({ results, estimatedLevel }: { results: UnitResult[]; estimatedLevel: Level }) {
  const total = results.reduce((s, r) => s + r.totalCount, 0);
  const correct = results.reduce((s, r) => s + r.correctCount, 0);
  const accuracy = total ? Math.round((correct / total) * 100) : 0;

  const tagStats = useMemo(() => {
    const m = new Map<string, { right: number; total: number }>();
    results.forEach((r) => {
      const t = r.unit.context_tag;
      const s = m.get(t) ?? { right: 0, total: 0 };
      s.total += r.totalCount;
      s.right += r.correctCount;
      m.set(t, s);
    });
    return [...m.entries()].map(([tag, s]) => ({
      tag,
      ...s,
      acc: s.total ? s.right / s.total : 0,
    }));
  }, [results]);

  const weakest = tagStats.length ? tagStats.slice().sort((a, b) => a.acc - b.acc)[0] : null;

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
            {total === 0 ? "No questions answered." : "Nice work — here's how you did."}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Stat label="Accuracy" value={`${accuracy}%`} sub={`${correct}/${total} correct`} />
            <Stat label="Estimated level" value={estimatedLevel} sub="Listening, this session" />
          </div>

          {weakest && (
            <div className="mt-6 rounded-2xl bg-muted/40 p-4">
              <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                Weakest context
              </div>
              <div className="mt-1 font-semibold text-foreground capitalize">
                {weakest.tag.replace("_", " ")}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({weakest.right}/{weakest.total})
                </span>
              </div>
            </div>
          )}

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
      <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-3xl font-extrabold text-primary">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}
