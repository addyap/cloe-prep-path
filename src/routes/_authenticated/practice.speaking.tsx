import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Mic,
  Square,
  Loader2,
  Trophy,
  RotateCcw,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Play,
  Pause,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { PracticeErrorState, PracticeRouteError } from "@/components/practice-error";
import { ReportIssueDialog } from "@/components/report-issue-dialog";
import { ProFreeBadge } from "@/components/pro-free-badge";
import { cn, formatTime } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/practice/speaking")({
  component: SpeakingPractice,
  errorComponent: PracticeRouteError,
});

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
type Level = (typeof LEVELS)[number];
type Phase = "interview" | "role_play" | "discussion";

const PHASE_META: Record<Phase, { title: string; sub: string; seconds: number }> = {
  interview: {
    title: "Phase 1 · Interview",
    sub: "Talk about your job and background.",
    seconds: 90,
  },
  role_play: {
    title: "Phase 2 · Role-play",
    sub: "Handle a realistic workplace situation.",
    seconds: 120,
  },
  discussion: {
    title: "Phase 3 · Discussion",
    sub: "Give your opinion on a workplace topic.",
    seconds: 150,
  },
};

type Prompt = {
  id: string;
  cefr_level: Level;
  context_tag: Phase;
  prompt_text: string;
};

type Feedback = {
  estimated_level: Level;
  scores: { fluency: number; range: number; accuracy: number; interaction: number };
  comments: { fluency: string; range: string; accuracy: string; interaction: string };
  tips: string[];
  summary: string;
};

type EvalResult = { transcript: string; feedback: Feedback; overall: number };
type Mode = "menu" | "practice" | "exam";

function pickPromptForPhase(prompts: Prompt[], phase: Phase, target: Level | null): Prompt | null {
  const pool = prompts.filter((p) => p.context_tag === phase);
  if (!pool.length) return null;
  if (target) {
    const exact = pool.find((p) => p.cefr_level === target);
    if (exact) return exact;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function SpeakingPractice() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetLevel, setTargetLevel] = useState<Level>("B1");
  const [mode, setMode] = useState<Mode>("menu");
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: qs, error: qError }, { data: userRes }] = await Promise.all([
          supabase
            .from("questions")
            .select("id, cefr_level, context_tag, prompt_text")
            .eq("skill", "speaking")
            .eq("type", "prompt"),
          supabase.auth.getUser(),
        ]);
        if (qError) throw qError;
        setPrompts((qs ?? []) as Prompt[]);
        if (userRes?.user) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("current_estimated_level")
            .eq("id", userRes.user.id)
            .maybeSingle();
          if (prof?.current_estimated_level) setTargetLevel(prof.current_estimated_level as Level);
        }
      } catch (err) {
        console.error(err);
        setLoadError("We couldn't load the speaking prompts. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loadError) {
    return <PracticeErrorState message={loadError} />;
  }

  if (loading) {
    return (
      <AppShell>
        <div className="p-10 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  if (!loading && prompts.length === 0) {
    return (
      <PracticeErrorState message="No speaking prompts are available right now. Please try again later." />
    );
  }

  if (mode === "menu") {
    return (
      <AppShell>
        <div className="p-5 md:p-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary">Speaking simulator</h1>
              <p className="text-sm text-muted-foreground">
                Mirror the real 15–20 min CLOE oral interview.
              </p>
            </div>
          </div>

          <div className="mt-3">
            <ProFreeBadge />
          </div>

          <div className="mt-6 rounded-2xl bg-card border border-border p-5 shadow-card">
            <div className="text-sm font-semibold text-foreground">Target CEFR level</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setTargetLevel(l)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm border transition",
                    targetLevel === l
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-accent/50",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => setMode("practice")}
              className="text-left rounded-2xl bg-card border border-border p-5 shadow-card hover:border-accent/50 transition"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="mt-3 font-semibold">Practice mode</div>
              <div className="text-sm text-muted-foreground mt-1">
                Rehearse any phase, no scoring pressure. Get AI feedback when you ask for it.
              </div>
            </button>
            <button
              onClick={() => setMode("exam")}
              className="text-left rounded-2xl bg-primary text-primary-foreground p-5 shadow-elevated hover:opacity-95 transition"
            >
              <div className="h-9 w-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center">
                <Trophy className="h-4 w-4" />
              </div>
              <div className="mt-3 font-semibold">Exam simulation</div>
              <div className="text-sm text-primary-foreground/80 mt-1">
                Full ~15 min timed run: interview → role-play → discussion, scored end-to-end.
              </div>
            </button>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            <Link to="/practice" className="underline">
              ← Back to practice
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <SpeakingSession
      mode={mode}
      prompts={prompts}
      targetLevel={targetLevel}
      onExit={() => setMode("menu")}
    />
  );
}

function SpeakingSession({
  mode,
  prompts,
  targetLevel,
  onExit,
}: {
  mode: "practice" | "exam";
  prompts: Prompt[];
  targetLevel: Level;
  onExit: () => void;
}) {
  const examPhases: Phase[] = ["interview", "role_play", "discussion"];
  const [phase, setPhase] = useState<Phase>("interview");
  const [step, setStep] = useState(0); // index in examPhases for exam mode
  const [results, setResults] = useState<
    Array<{ phase: Phase; prompt: Prompt; result: EvalResult }>
  >([]);
  const [done, setDone] = useState(false);

  const current = useMemo(
    () => pickPromptForPhase(prompts, mode === "exam" ? examPhases[step] : phase, targetLevel),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prompts, mode, phase, step, targetLevel],
  );

  const activePhase: Phase = mode === "exam" ? examPhases[step] : phase;

  function handleSubmitted(r: EvalResult) {
    if (!current) return;
    setResults((prev) => [...prev, { phase: activePhase, prompt: current, result: r }]);
    if (mode === "exam") {
      if (step + 1 >= examPhases.length) setDone(true);
      else setStep(step + 1);
    }
  }

  if (done && mode === "exam") {
    return <ExamSummary results={results} onRestart={onExit} />;
  }

  if (!current) {
    return (
      <AppShell>
        <div className="p-10 max-w-2xl mx-auto text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="mt-3 text-muted-foreground">No prompts available for this phase yet.</p>
          <Button className="mt-4" onClick={onExit}>
            Back
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <button onClick={onExit} className="text-xs text-muted-foreground hover:text-foreground">
            ← Exit
          </button>
          <div className="text-xs text-muted-foreground">
            {mode === "exam" ? `Step ${step + 1} of ${examPhases.length}` : "Practice mode"}
          </div>
        </div>

        {mode === "practice" && (
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(PHASE_META) as Phase[]).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPhase(p);
                  setResults([]);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs border transition",
                  phase === p
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-accent/50",
                )}
              >
                {PHASE_META[p].title}
              </button>
            ))}
          </div>
        )}

        <PhaseRecorder
          key={`${activePhase}-${current.id}-${step}`}
          phase={activePhase}
          prompt={current}
          targetLevel={targetLevel}
          mode={mode}
          onSubmitted={handleSubmitted}
        />
      </div>
    </AppShell>
  );
}

function PhaseRecorder({
  phase,
  prompt,
  targetLevel,
  mode,
  onSubmitted,
}: {
  phase: Phase;
  prompt: Prompt;
  targetLevel: Level;
  mode: "practice" | "exam";
  onSubmitted: (r: EvalResult) => void;
}) {
  const meta = PHASE_META[phase];
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [playing, setPlaying] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    },
    [audioUrl],
  );

  async function startRecording() {
    setError(null);
    setBlob(null);
    setResult(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Microphone access is needed. Please allow it in your browser settings.");
      return;
    }
    streamRef.current = stream;
    const mimeType = ["audio/webm", "audio/mp4"].find((t) => MediaRecorder.isTypeSupported(t));
    if (!mimeType) {
      stream.getTracks().forEach((t) => t.stop());
      setError("This browser can't record a supported audio format.");
      return;
    }
    const rec = new MediaRecorder(stream, { mimeType });
    chunksRef.current = [];
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.onstop = () => {
      const b = new Blob(chunksRef.current, { type: rec.mimeType });
      stream.getTracks().forEach((t) => t.stop());
      setBlob(b);
      setAudioUrl(URL.createObjectURL(b));
    };
    recorderRef.current = rec;
    rec.start();
    setRecording(true);
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed((s) => {
        const next = s + 1;
        if (next >= meta.seconds) {
          stopRecording();
        }
        return next;
      });
    }, 1000);
  }

  function stopRecording() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setRecording(false);
  }

  async function submit(save: boolean) {
    if (!blob) return;
    setSubmitting(true);
    setError(null);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) throw new Error("Not signed in.");
      const form = new FormData();
      form.append("audio", blob, `recording.${blob.type.includes("mp4") ? "mp4" : "webm"}`);
      form.append("question_id", prompt.id);
      form.append("prompt_text", prompt.prompt_text);
      form.append("target_level", targetLevel);
      form.append("phase", phase);
      form.append("save", save ? "true" : "false");
      const res = await fetch("/api/speaking/evaluate", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? `Evaluation failed (${res.status})`);
      }
      const data = (await res.json()) as EvalResult;
      setResult(data);
      onSubmitted(data);
    } catch (e: unknown) {
      setError((e as Error).message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setBlob(null);
    setResult(null);
    setError(null);
    setElapsed(0);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  }

  const progressPct = Math.min(100, (elapsed / meta.seconds) * 100);

  return (
    <div className="mt-5 rounded-3xl bg-card border border-border shadow-card p-5 md:p-7">
      <div className="text-xs uppercase tracking-wide text-accent font-semibold">{meta.title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{meta.sub}</div>
      <div className="mt-4 rounded-2xl bg-muted/40 border border-border p-4">
        <div className="text-xs text-muted-foreground">
          Target {prompt.cefr_level} · {meta.title}
        </div>
        <p className="mt-2 text-base leading-relaxed text-foreground">{prompt.prompt_text}</p>
        <div className="mt-3">
          <ReportIssueDialog questionId={prompt.id} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="text-sm font-mono tabular-nums">
          {formatTime(elapsed)}{" "}
          <span className="text-muted-foreground">/ {formatTime(meta.seconds)}</span>
        </div>
        {recording && (
          <span className="flex items-center gap-1.5 text-xs text-red-500">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> recording
          </span>
        )}
      </div>
      <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full transition-all", recording ? "bg-red-500" : "bg-accent")}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {!result && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {!recording && !blob && (
            <Button
              onClick={startRecording}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Mic className="h-4 w-4 mr-2" /> Start recording
            </Button>
          )}
          {recording && (
            <Button onClick={stopRecording} variant="destructive">
              <Square className="h-4 w-4 mr-2" /> Stop
            </Button>
          )}
          {!recording && blob && (
            <>
              <audio
                ref={audioElRef}
                src={audioUrl ?? undefined}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (!audioElRef.current) return;
                  if (playing) audioElRef.current.pause();
                  else audioElRef.current.play();
                }}
              >
                {playing ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" /> Play back
                  </>
                )}
              </Button>
              <Button variant="ghost" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-2" /> Re-record
              </Button>
              <Button
                onClick={() => submit(mode === "exam" ? true : true)}
                disabled={submitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Scoring…
                  </>
                ) : (
                  <>
                    {mode === "exam" ? "Submit & continue" : "Get feedback"}{" "}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> {error}
        </div>
      )}

      {result && mode === "practice" && <FeedbackCard result={result} onTryAgain={reset} />}
    </div>
  );
}

function FeedbackCard({ result, onTryAgain }: { result: EvalResult; onTryAgain: () => void }) {
  const { feedback, transcript, overall } = result;
  const rows: Array<[keyof Feedback["scores"], string]> = [
    ["fluency", "Fluency"],
    ["range", "Range"],
    ["accuracy", "Accuracy"],
    ["interaction", "Interaction"],
  ];
  return (
    <div className="mt-6 rounded-2xl border border-border bg-background p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Estimated level
          </div>
          <div className="text-3xl font-extrabold text-primary">{feedback.estimated_level}</div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Overall</div>
          <div className="text-3xl font-extrabold text-accent">{overall}%</div>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{feedback.summary}</p>

      <div className="mt-5 grid sm:grid-cols-2 gap-3">
        {rows.map(([k, label]) => (
          <div key={k} className="rounded-xl border border-border p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{label}</div>
              <div className="text-sm font-mono">{feedback.scores[k]}/5</div>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-accent"
                style={{ width: `${(feedback.scores[k] / 5) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{feedback.comments[k]}</div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <div className="text-sm font-semibold mb-2">Tips</div>
        <ul className="space-y-1.5 text-sm">
          {feedback.tips.map((t, i) => (
            <li key={i} className="flex gap-2">
              <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <details className="mt-5 text-sm">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          Show transcript
        </summary>
        <p className="mt-2 whitespace-pre-wrap text-foreground/90 bg-muted/30 rounded-lg p-3">
          {transcript || "(no speech detected)"}
        </p>
      </details>

      <div className="mt-5">
        <Button variant="outline" onClick={onTryAgain}>
          <RotateCcw className="h-4 w-4 mr-2" /> Try another take
        </Button>
      </div>
    </div>
  );
}

function ExamSummary({
  results,
  onRestart,
}: {
  results: Array<{ phase: Phase; prompt: Prompt; result: EvalResult }>;
  onRestart: () => void;
}) {
  const overallAvg = results.length
    ? Math.round(results.reduce((s, r) => s + r.result.overall, 0) / results.length)
    : 0;
  const levelCount: Partial<Record<Level, number>> = {};
  results.forEach((r) => {
    const l = r.result.feedback.estimated_level;
    levelCount[l] = (levelCount[l] ?? 0) + 1;
  });
  const estimatedLevel =
    (Object.entries(levelCount).sort((a, b) => b[1]! - a[1]!)[0]?.[0] as Level | undefined) ?? "B1";

  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-3xl mx-auto">
        <div className="rounded-3xl bg-primary text-primary-foreground p-7 shadow-elevated">
          <Trophy className="h-8 w-8 text-accent" />
          <h1 className="mt-3 text-2xl md:text-3xl font-bold">Exam simulation complete</h1>
          <div className="mt-4 flex flex-wrap gap-6">
            <div>
              <div className="text-xs uppercase opacity-70">Estimated oral level</div>
              <div className="text-4xl font-extrabold">{estimatedLevel}</div>
            </div>
            <div>
              <div className="text-xs uppercase opacity-70">Average score</div>
              <div className="text-4xl font-extrabold text-accent">{overallAvg}%</div>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {results.map((r, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase text-accent font-semibold">
                  {PHASE_META[r.phase].title}
                </div>
                <div className="text-sm font-mono">
                  {r.result.overall}% · {r.result.feedback.estimated_level}
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{r.prompt.prompt_text}</p>
              <p className="mt-3 text-sm">{r.result.feedback.summary}</p>
              <ul className="mt-3 space-y-1 text-sm">
                {r.result.feedback.tips.slice(0, 2).map((t, j) => (
                  <li key={j} className="flex gap-2">
                    <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            onClick={onRestart}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <RotateCcw className="h-4 w-4 mr-2" /> Back to speaking menu
          </Button>
          <Link to="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
