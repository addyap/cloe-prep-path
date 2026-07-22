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
import { cn, extractSpokenScript } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/practice/listening")({
  component: ListeningPractice,
});

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
type Level = (typeof LEVELS)[number];
const MAX_PLAYS = 2;
const SESSION_LENGTH = 8;

type Question = {
  id: string;
  cefr_level: Level;
  context_tag: string;
  prompt_text: string;
  audio_url: string | null;
  options: string[];
  correct_answer: string;
  explanation: string | null;
};

type HistoryItem = {
  question: Question;
  answer: string;
  correct: boolean;
};

function bumpLevel(level: Level, delta: 1 | -1): Level {
  const i = LEVELS.indexOf(level);
  const next = Math.min(LEVELS.length - 1, Math.max(0, i + delta));
  return LEVELS[next];
}

function ListeningPractice() {
  const [pool, setPool] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState<Level>("A2");
  const [asked, setAsked] = useState<Set<string>>(new Set());
  const [streakRight, setStreakRight] = useState(0);
  const [streakWrong, setStreakWrong] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [plays, setPlays] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [done, setDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load questions and starting level
  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const [profileRes, qRes] = await Promise.all([
        u.user
          ? supabase
              .from("profiles")
              .select("current_estimated_level")
              .eq("id", u.user.id)
              .maybeSingle()
          : Promise.resolve({ data: null } as const),
        supabase.from("questions").select("*").eq("skill", "listening"),
      ]);
      const starting = (profileRes.data?.current_estimated_level as Level) ?? "A2";
      setLevel(starting);
      const list: Question[] = (qRes.data ?? []).map((q) => ({
        id: q.id,
        cefr_level: q.cefr_level as Level,
        context_tag: q.context_tag,
        prompt_text: q.prompt_text,
        audio_url: q.audio_url,
        options: Array.isArray(q.options) ? (q.options as string[]) : [],
        correct_answer: q.correct_answer ?? "",
        explanation: q.explanation,
      }));
      setPool(list);
      setLoading(false);
    })();
  }, []);

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
        const match = remaining.filter((q) => q.cefr_level === lv);
        if (match.length) return match[Math.floor(Math.random() * match.length)];
      }
      return remaining[0];
    },
    [pool],
  );

  // Start first question once pool ready
  useEffect(() => {
    if (loading || current || done) return;
    const next = pickNext(level, asked);
    if (!next) {
      setDone(true);
      return;
    }
    setCurrent(next);
  }, [loading, current, done, level, asked, pickNext]);

  // Stop audio when question changes / unmount
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
    if (current.audio_url) {
      const el = audioRef.current ?? new Audio(current.audio_url);
      audioRef.current = el;
      el.playbackRate = rate;
      el.onended = () => setIsPlaying(false);
      el.onpause = () => setIsPlaying(false);
      void el.play();
      setIsPlaying(true);
    } else if (typeof window !== "undefined" && window.speechSynthesis) {
      const text = extractSpokenScript(current.prompt_text);
      const u = new SpeechSynthesisUtterance(text);
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
    if (!current || !selected || submitted) return;
    setSubmitted(true);
    stopAudio();
    const isCorrect = selected === current.correct_answer;
    setHistory((h) => [...h, { question: current, answer: selected, correct: isCorrect }]);
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      await supabase.from("attempts").insert({
        user_id: u.user.id,
        question_id: current.id,
        skill: "listening",
        cefr_level: current.cefr_level,
        user_answer: selected,
        is_correct: isCorrect,
        score: isCorrect ? 1 : 0,
      });
    }
  }

  function next() {
    if (!current) return;
    const lastCorrect = history[history.length - 1]?.correct ?? false;
    const newRight = lastCorrect ? streakRight + 1 : 0;
    const newWrong = lastCorrect ? 0 : streakWrong + 1;
    let newLevel = level;
    let resetStreaks = false;
    if (newRight >= 2 && level !== "C2") {
      newLevel = bumpLevel(level, 1);
      resetStreaks = true;
    } else if (newWrong >= 2 && level !== "A1") {
      newLevel = bumpLevel(level, -1);
      resetStreaks = true;
    }
    setLevel(newLevel);
    setStreakRight(resetStreaks ? 0 : newRight);
    setStreakWrong(resetStreaks ? 0 : newWrong);
    const newAsked = new Set(asked);
    newAsked.add(current.id);
    setAsked(newAsked);
    setSelected(null);
    setSubmitted(false);
    setPlays(0);
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

  const progress = history.length;
  const playsLeft = MAX_PLAYS - plays;

  if (loading) {
    return (
      <AppShell>
        <div className="p-10 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading session…
        </div>
      </AppShell>
    );
  }

  if (done || !current) {
    return <Summary history={history} estimatedLevel={level} />;
  }

  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Link to="/practice" className="hover:text-foreground">
            ← All practice
          </Link>
          <div>
            Question {progress + 1} of {SESSION_LENGTH}
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
          <div className="flex items-center gap-3">
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
            <p className="mt-4 text-sm text-muted-foreground italic border-l-2 border-border pl-3">
              {current.prompt_text}
            </p>
          )}
        </div>

        {/* Question */}
        <div className="mt-6">
          <div className="text-base md:text-lg font-semibold text-foreground">
            {extractQuestion(current.prompt_text)}
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {current.options.map((opt) => {
              const isSel = selected === opt;
              const isRight = submitted && opt === current.correct_answer;
              const isWrongPick = submitted && isSel && opt !== current.correct_answer;
              return (
                <button
                  key={opt}
                  onClick={() => !submitted && setSelected(opt)}
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

        {/* Explanation */}
        {submitted && (
          <div
            className={cn(
              "mt-5 rounded-2xl p-4 border-2",
              history[history.length - 1]?.correct
                ? "border-success/30 bg-success/5"
                : "border-destructive/30 bg-destructive/5",
            )}
          >
            <div className="flex items-center gap-2 font-semibold">
              {history[history.length - 1]?.correct ? (
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
            {current.explanation && (
              <p className="text-sm mt-2 text-foreground/80">{current.explanation}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          {!submitted ? (
            <Button
              onClick={submit}
              disabled={!selected}
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

function Summary({ history, estimatedLevel }: { history: HistoryItem[]; estimatedLevel: Level }) {
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
    return [...m.entries()].map(([tag, s]) => ({ tag, ...s, acc: s.right / s.total }));
  }, [history]);

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
