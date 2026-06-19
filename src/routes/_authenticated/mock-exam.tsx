import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ClipboardCheck, Loader2, Play, Square, Mic, AlertCircle, ArrowRight, Trophy,
  ShieldAlert, RotateCcw, Sparkles, Volume2,
} from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/mock-exam")({
  component: MockExamPage,
});

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
type Level = (typeof LEVELS)[number];
const LEVEL_TO_NUM: Record<Level, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
const NUM_TO_LEVEL = (n: number): Level => {
  const c = Math.max(1, Math.min(6, Math.round(n)));
  return LEVELS[c - 1];
};

const WRITTEN_TIME_LIMIT_SEC = 25 * 60;
const WRITTEN_MAX_ITEMS = 30;
const WRITTEN_MIN_ITEMS = 14;
const WRITTEN_SKILLS = ["listening", "reading", "grammar_vocab"] as const;
type WrittenSkill = (typeof WRITTEN_SKILLS)[number];

type Question = {
  id: string;
  skill: WrittenSkill;
  cefr_level: Level;
  context_tag: string;
  type: "mcq" | "gap_fill" | "open_text" | "prompt";
  prompt_text: string;
  audio_url: string | null;
  options: string[] | null;
  correct_answer: string | null;
  passage_id: string | null;
};

type Passage = { id: string; title: string; body: string };

type Answered = {
  question: Question;
  user_answer: string;
  correct: boolean;
  theta_after: number;
};

type Phase = "interview" | "role_play" | "discussion";
const ORAL_PHASES: Phase[] = ["interview", "role_play", "discussion"];
const PHASE_META: Record<Phase, { title: string; seconds: number }> = {
  interview: { title: "Phase 1 · Interview", seconds: 90 },
  role_play: { title: "Phase 2 · Role-play", seconds: 120 },
  discussion: { title: "Phase 3 · Discussion", seconds: 150 },
};

type SpeakingFeedback = {
  estimated_level: Level;
  scores: { fluency: number; range: number; accuracy: number; interaction: number };
  comments: { fluency: string; range: string; accuracy: string; interaction: string };
  tips: string[];
  summary: string;
};
type OralResult = {
  phase: Phase;
  prompt: Question;
  transcript: string;
  feedback: SpeakingFeedback;
  overall: number;
};

type Step = "intro" | "written" | "written_done" | "oral" | "results";

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

function MockExamPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("intro");
  const [bank, setBank] = useState<Question[]>([]);
  const [passages, setPassages] = useState<Record<string, Passage>>({});
  const [oralPrompts, setOralPrompts] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [written, setWritten] = useState<Answered[]>([]);
  const [oral, setOral] = useState<OralResult[]>([]);
  const [startTheta, setStartTheta] = useState<number>(3);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: qs, error: qErr }, { data: ps }, userRes] = await Promise.all([
          supabase
            .from("questions")
            .select("id, skill, cefr_level, context_tag, type, prompt_text, audio_url, options, correct_answer, passage_id"),
          supabase.from("passages").select("id, title, body"),
          supabase.auth.getUser(),
        ]);
        if (qErr) throw qErr;
        const all = (qs ?? []) as Question[];
        setBank(all.filter((q) => WRITTEN_SKILLS.includes(q.skill as WrittenSkill) && q.type !== "open_text" && q.type !== "prompt"));
        setOralPrompts(all.filter((q) => q.skill === ("speaking" as unknown as WrittenSkill) && q.type === "prompt") as Question[]);
        const pmap: Record<string, Passage> = {};
        (ps ?? []).forEach((p) => { pmap[p.id] = p as Passage; });
        setPassages(pmap);
        if (userRes.data.user) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("current_estimated_level")
            .eq("id", userRes.data.user.id)
            .maybeSingle();
          if (prof?.current_estimated_level) setStartTheta(LEVEL_TO_NUM[prof.current_estimated_level as Level]);
        }
      } catch (e) {
        setError((e as Error).message ?? "Failed to load exam.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Speaking bank pulled separately (skill enum differs from WrittenSkill literal)
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("questions")
        .select("id, skill, cefr_level, context_tag, type, prompt_text, audio_url, options, correct_answer, passage_id")
        .eq("skill", "speaking")
        .eq("type", "prompt");
      setOralPrompts((data ?? []) as Question[]);
    })();
  }, []);

  async function startSession() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data, error: insErr } = await supabase
      .from("practice_sessions")
      .insert({ user_id: u.user.id, mode: "mock" })
      .select("id")
      .single();
    if (!insErr && data) setSessionId(data.id);
    setStep("written");
  }

  async function finalize(allWritten: Answered[], allOral: OralResult[]) {
    const summary = buildSummary(allWritten, allOral);
    if (sessionId) {
      await supabase
        .from("practice_sessions")
        .update({ completed_at: new Date().toISOString(), summary: summary as never })
        .eq("id", sessionId);
    }
    // Update user's current_estimated_level
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      await supabase
        .from("profiles")
        .update({ current_estimated_level: summary.overall_level })
        .eq("id", u.user.id);
    }
    setStep("results");
  }

  if (loading) {
    return (
      <AppShell>
        <div className="p-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-10 max-w-2xl mx-auto text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
          <p className="mt-3 text-sm">{error}</p>
        </div>
      </AppShell>
    );
  }

  if (step === "intro") return <Intro onStart={startSession} bankSize={bank.length} oralCount={oralPrompts.length} />;
  if (step === "written") {
    return (
      <WrittenAdaptive
        bank={bank}
        passages={passages}
        startTheta={startTheta}
        onDone={(items) => { setWritten(items); setStep("written_done"); }}
        onAbort={() => navigate({ to: "/dashboard" })}
      />
    );
  }
  if (step === "written_done") {
    return <WrittenBreak written={written} onContinue={() => setStep("oral")} />;
  }
  if (step === "oral") {
    return (
      <OralRunner
        prompts={oralPrompts}
        targetLevel={NUM_TO_LEVEL(estimateLevel(written))}
        onDone={(results) => { setOral(results); void finalize(written, results); }}
      />
    );
  }
  return <Results written={written} oral={oral} onRestart={() => navigate({ to: "/dashboard" })} />;
}

/* ---------------- Intro ---------------- */

function Intro({ onStart, bankSize, oralCount }: { onStart: () => void; bankSize: number; oralCount: number }) {
  const [ack, setAck] = useState(false);
  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center"><ClipboardCheck className="h-5 w-5" /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Full Mock Exam</h1>
            <p className="text-sm text-muted-foreground">Simulates the two-part CLOE under real conditions.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 text-sm flex gap-3">
          <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Proctor mode</div>
            <p className="mt-1">Do not leave this tab once the exam starts. Switching apps, scrolling away or reloading will end your session. There is no going back to previous questions, and listening audio plays only once.</p>
          </div>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
            <div className="text-xs uppercase tracking-wide text-accent font-semibold">Part 1 · Written</div>
            <div className="mt-2 font-semibold">Adaptive · ~25 min</div>
            <p className="text-sm text-muted-foreground mt-1">Up to {WRITTEN_MAX_ITEMS} items across listening, reading and grammar. The difficulty adapts to your answers — you won't see a score, just "calibrating".</p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
            <div className="text-xs uppercase tracking-wide text-accent font-semibold">Part 2 · Oral</div>
            <div className="mt-2 font-semibold">3 phases · ~10 min</div>
            <p className="text-sm text-muted-foreground mt-1">Interview, role-play and discussion. Spoken responses are transcribed and scored by AI.</p>
          </div>
        </div>

        <label className="mt-6 flex items-start gap-3 text-sm">
          <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-0.5 h-4 w-4" />
          <span>I understand the exam rules and I am ready to take it in one sitting ({bankSize} items available, {oralCount} oral prompts).</span>
        </label>

        <div className="mt-4 flex gap-3">
          <Button disabled={!ack} onClick={onStart} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Start mock exam <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Link to="/dashboard"><Button variant="outline">Cancel</Button></Link>
        </div>
      </div>
    </AppShell>
  );
}

/* ---------------- Written adaptive ---------------- */

function pickNext(
  bank: Question[],
  used: Set<string>,
  theta: number,
  preferSkill: WrittenSkill,
): Question | null {
  const target = Math.max(1, Math.min(6, Math.round(theta)));
  const available = bank.filter((q) => !used.has(q.id));
  if (!available.length) return null;
  const sameSkill = available.filter((q) => q.skill === preferSkill);
  const pool = sameSkill.length ? sameSkill : available;
  // sort by closeness to target then random
  pool.sort((a, b) => Math.abs(LEVEL_TO_NUM[a.cefr_level] - target) - Math.abs(LEVEL_TO_NUM[b.cefr_level] - target));
  const closest = pool[0];
  const closestDist = Math.abs(LEVEL_TO_NUM[closest.cefr_level] - target);
  const tier = pool.filter((q) => Math.abs(LEVEL_TO_NUM[q.cefr_level] - target) === closestDist);
  return tier[Math.floor(Math.random() * tier.length)];
}

function isStable(history: Answered[]): boolean {
  if (history.length < WRITTEN_MIN_ITEMS) return false;
  const last = history.slice(-8).map((h) => h.theta_after);
  if (last.length < 8) return false;
  const mean = last.reduce((s, n) => s + n, 0) / last.length;
  const variance = last.reduce((s, n) => s + (n - mean) ** 2, 0) / last.length;
  return Math.sqrt(variance) < 0.18;
}

function WrittenAdaptive({
  bank, passages, startTheta, onDone, onAbort,
}: {
  bank: Question[];
  passages: Record<string, Passage>;
  startTheta: number;
  onDone: (items: Answered[]) => void;
  onAbort: () => void;
}) {
  const [theta, setTheta] = useState<number>(startTheta);
  const [history, setHistory] = useState<Answered[]>([]);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState<Question | null>(null);
  const [selection, setSelection] = useState<string>("");
  const [elapsed, setElapsed] = useState(0);
  const [playsUsed, setPlaysUsed] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Round-robin skill selection
  const nextSkill = useMemo<WrittenSkill>(() => {
    return WRITTEN_SKILLS[history.length % WRITTEN_SKILLS.length];
  }, [history.length]);

  // Pick first / next question
  useEffect(() => {
    if (current) return;
    const q = pickNext(bank, used, theta, nextSkill);
    setCurrent(q);
    setPlaysUsed(0);
    setSelection("");
  }, [current, bank, used, theta, nextSkill]);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Stop on time
  useEffect(() => {
    if (elapsed >= WRITTEN_TIME_LIMIT_SEC) onDone(history);
  }, [elapsed, history, onDone]);

  // Proctor: warn on tab hide
  useEffect(() => {
    const onVis = () => { if (document.hidden) setWarning("Tab switch detected — stay on this page during the exam."); };
    document.addEventListener("visibilitychange", onVis);
    const onBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("beforeunload", onBeforeUnload);
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const playAudio = useCallback(() => {
    if (!current) return;
    if (playsUsed >= 1) return; // strict: 1 play in exam
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const text = current.audio_url && current.audio_url.startsWith("tts:")
      ? current.audio_url.slice(4)
      : current.prompt_text;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.lang = "en-US";
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setPlaysUsed((n) => n + 1);
  }, [current, playsUsed]);

  function submit() {
    if (!current) return;
    const userAnswer = selection.trim();
    if (!userAnswer) return;
    const correct = !!current.correct_answer &&
      userAnswer.toLowerCase() === current.correct_answer.trim().toLowerCase();
    const delta = correct ? 0.33 : -0.33;
    const nextTheta = Math.max(1, Math.min(6, theta + delta));
    const answered: Answered = {
      question: current,
      user_answer: userAnswer,
      correct,
      theta_after: nextTheta,
    };
    const nextHistory = [...history, answered];
    const nextUsed = new Set(used); nextUsed.add(current.id);

    setHistory(nextHistory);
    setUsed(nextUsed);
    setTheta(nextTheta);
    setCurrent(null);
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();

    // Stop conditions
    if (nextHistory.length >= WRITTEN_MAX_ITEMS || isStable(nextHistory)) {
      // Defer to next tick so state updates flush
      setTimeout(() => onDone(nextHistory), 0);
    }
  }

  const skillLabel: Record<WrittenSkill, string> = {
    listening: "Listening",
    reading: "Reading",
    grammar_vocab: "Grammar & Vocab",
  };

  if (!current) {
    return (
      <AppShell>
        <div className="p-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
      </AppShell>
    );
  }

  const opts = (current.options ?? []) as string[];
  const remaining = Math.max(0, WRITTEN_TIME_LIMIT_SEC - elapsed);
  const passage = current.passage_id ? passages[current.passage_id] : null;

  return (
    <AppShell>
      <div className="p-5 md:p-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>Part 1 · Written</div>
          <div className="font-mono tabular-nums">{formatTime(remaining)} left</div>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${Math.min(100, (history.length / WRITTEN_MAX_ITEMS) * 100)}%` }} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">Item {history.length + 1}</span>
            <span className="mx-2 text-muted-foreground">·</span>
            <span className="font-semibold">{skillLabel[current.skill]}</span>
          </div>
          <div className="text-xs text-accent flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> calibrating your level
          </div>
        </div>

        {warning && (
          <div className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5" /> {warning}
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-border bg-card shadow-card p-5">
          {passage && (
            <div className="mb-4 rounded-xl bg-muted/30 border border-border p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{passage.title}</div>
              <p className="mt-2 text-sm whitespace-pre-wrap leading-relaxed">{passage.body}</p>
            </div>
          )}

          {current.skill === "listening" && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3">
              <Button onClick={playAudio} disabled={playsUsed >= 1} variant="outline" size="sm">
                <Volume2 className="h-4 w-4 mr-2" /> {playsUsed === 0 ? "Play audio (1 play only)" : "Already played"}
              </Button>
              <span className="text-xs text-muted-foreground">Exam rules: audio plays once.</span>
            </div>
          )}

          <p className="text-base leading-relaxed text-foreground">{current.prompt_text}</p>

          <div className="mt-4 space-y-2">
            {current.type === "mcq" && opts.length > 0 && opts.map((o) => (
              <button
                key={o}
                onClick={() => setSelection(o)}
                className={cn(
                  "w-full text-left rounded-xl border px-4 py-3 text-sm transition",
                  selection === o ? "border-accent bg-accent/10" : "border-border hover:border-accent/50",
                )}
              >{o}</button>
            ))}
            {current.type === "gap_fill" && (
              <input
                value={selection}
                onChange={(e) => setSelection(e.target.value)}
                placeholder="Type your answer"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-accent"
              />
            )}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <button onClick={onAbort} className="text-xs text-muted-foreground hover:text-foreground underline">
              Abandon exam
            </button>
            <Button onClick={submit} disabled={!selection.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Submit & continue <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function WrittenBreak({ written, onContinue }: { written: Answered[]; onContinue: () => void }) {
  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-2xl mx-auto text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center"><ClipboardCheck className="h-7 w-7" /></div>
        <h1 className="mt-4 text-2xl font-bold text-primary">Part 1 complete</h1>
        <p className="text-sm text-muted-foreground mt-2">You answered {written.length} written items. Take a short breath — Part 2 is the oral interview.</p>
        <Button onClick={onContinue} className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
          Start oral part <Mic className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </AppShell>
  );
}

/* ---------------- Oral runner ---------------- */

function pickOralForPhase(prompts: Question[], phase: Phase, target: Level): Question | null {
  const pool = prompts.filter((p) => p.context_tag === phase);
  if (!pool.length) return null;
  const exact = pool.find((p) => p.cefr_level === target);
  if (exact) return exact;
  pool.sort((a, b) => Math.abs(LEVEL_TO_NUM[a.cefr_level] - LEVEL_TO_NUM[target]) - Math.abs(LEVEL_TO_NUM[b.cefr_level] - LEVEL_TO_NUM[target]));
  return pool[0];
}

function OralRunner({
  prompts, targetLevel, onDone,
}: { prompts: Question[]; targetLevel: Level; onDone: (results: OralResult[]) => void }) {
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<OralResult[]>([]);
  const phase = ORAL_PHASES[idx];
  const prompt = useMemo(() => pickOralForPhase(prompts, phase, targetLevel), [prompts, phase, targetLevel]);

  function onPhaseDone(r: OralResult) {
    const next = [...results, r];
    setResults(next);
    if (idx + 1 >= ORAL_PHASES.length) onDone(next);
    else setIdx(idx + 1);
  }

  if (!prompt) {
    return (
      <AppShell>
        <div className="p-10 max-w-2xl mx-auto text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="mt-3">No oral prompt available for this phase.</p>
          <Button className="mt-4" onClick={() => onDone(results)}>Skip to results</Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>Part 2 · Oral · {PHASE_META[phase].title}</div>
          <div>Phase {idx + 1} of {ORAL_PHASES.length}</div>
        </div>
        <OralPhase
          key={phase}
          phase={phase}
          prompt={prompt}
          targetLevel={targetLevel}
          onSubmitted={onPhaseDone}
        />
      </div>
    </AppShell>
  );
}

function OralPhase({
  phase, prompt, targetLevel, onSubmitted,
}: { phase: Phase; prompt: Question; targetLevel: Level; onSubmitted: (r: OralResult) => void }) {
  const meta = PHASE_META[phase];
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  async function startRecording() {
    setError(null); setBlob(null);
    let stream: MediaStream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch { setError("Microphone access required."); return; }
    streamRef.current = stream;
    const mimeType = ["audio/webm", "audio/mp4"].find((t) => MediaRecorder.isTypeSupported(t));
    if (!mimeType) { stream.getTracks().forEach((t) => t.stop()); setError("Browser cannot record."); return; }
    const rec = new MediaRecorder(stream, { mimeType });
    chunksRef.current = [];
    rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    rec.onstop = () => {
      const b = new Blob(chunksRef.current, { type: rec.mimeType });
      stream.getTracks().forEach((t) => t.stop());
      setBlob(b);
    };
    recorderRef.current = rec;
    rec.start();
    setRecording(true);
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed((s) => {
        const n = s + 1;
        if (n >= meta.seconds) stopRecording();
        return n;
      });
    }, 1000);
  }

  function stopRecording() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
    setRecording(false);
  }

  async function submit() {
    if (!blob) return;
    setSubmitting(true); setError(null);
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
      form.append("save", "true");
      const res = await fetch("/api/speaking/evaluate", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? `Failed (${res.status})`);
      }
      const data = (await res.json()) as { transcript: string; feedback: SpeakingFeedback; overall: number };
      onSubmitted({ phase, prompt, transcript: data.transcript, feedback: data.feedback, overall: data.overall });
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const progressPct = Math.min(100, (elapsed / meta.seconds) * 100);

  return (
    <div className="mt-4 rounded-2xl bg-card border border-border shadow-card p-5">
      <div className="text-xs uppercase tracking-wide text-accent font-semibold">{meta.title}</div>
      <div className="mt-3 rounded-xl bg-muted/30 border border-border p-4">
        <div className="text-xs text-muted-foreground">Target {prompt.cefr_level}</div>
        <p className="mt-2 text-base leading-relaxed">{prompt.prompt_text}</p>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm font-mono tabular-nums">
        <span>{formatTime(elapsed)} / {formatTime(meta.seconds)}</span>
        {recording && <span className="text-red-500 text-xs flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />recording</span>}
      </div>
      <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full transition-all", recording ? "bg-red-500" : "bg-accent")} style={{ width: `${progressPct}%` }} />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {!recording && !blob && (
          <Button onClick={startRecording} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Mic className="h-4 w-4 mr-2" /> Start recording
          </Button>
        )}
        {recording && (
          <Button variant="destructive" onClick={stopRecording}><Square className="h-4 w-4 mr-2" /> Stop</Button>
        )}
        {!recording && blob && (
          <Button onClick={submit} disabled={submitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Scoring…</> : <>Submit & continue <ArrowRight className="h-4 w-4 ml-2" /></>}
          </Button>
        )}
      </div>

      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5" /> {error}
        </div>
      )}
    </div>
  );
}

/* ---------------- Scoring helpers ---------------- */

function estimateLevel(history: Answered[]): number {
  if (!history.length) return 3;
  // Final theta = last theta_after
  return history[history.length - 1].theta_after;
}

function perSkillAccuracy(history: Answered[]) {
  const by: Record<WrittenSkill, { correct: number; total: number; thetaSum: number }> = {
    listening: { correct: 0, total: 0, thetaSum: 0 },
    reading: { correct: 0, total: 0, thetaSum: 0 },
    grammar_vocab: { correct: 0, total: 0, thetaSum: 0 },
  };
  history.forEach((h) => {
    const s = h.question.skill;
    by[s].total += 1;
    if (h.correct) by[s].correct += 1;
    by[s].thetaSum += LEVEL_TO_NUM[h.question.cefr_level] * (h.correct ? 1 : 0.5);
  });
  return by;
}

function buildSummary(written: Answered[], oral: OralResult[]) {
  const writtenTheta = estimateLevel(written);
  const skillBreak = perSkillAccuracy(written);
  const skills = {
    listening: skillBreak.listening.total ? Math.round((skillBreak.listening.correct / skillBreak.listening.total) * 100) : 0,
    reading: skillBreak.reading.total ? Math.round((skillBreak.reading.correct / skillBreak.reading.total) * 100) : 0,
    grammar_vocab: skillBreak.grammar_vocab.total ? Math.round((skillBreak.grammar_vocab.correct / skillBreak.grammar_vocab.total) * 100) : 0,
    speaking: oral.length ? Math.round(oral.reduce((s, r) => s + r.overall, 0) / oral.length) : 0,
  };
  const oralLevelAvg = oral.length
    ? oral.reduce((s, r) => s + LEVEL_TO_NUM[r.feedback.estimated_level], 0) / oral.length
    : writtenTheta;
  const overall = (writtenTheta + oralLevelAvg) / 2;
  const overall_level = NUM_TO_LEVEL(overall);

  // Weakest skill
  const skillList = [
    { key: "listening", label: "Listening", pct: skills.listening },
    { key: "reading", label: "Reading", pct: skills.reading },
    { key: "grammar_vocab", label: "Grammar & Vocabulary", pct: skills.grammar_vocab },
    { key: "speaking", label: "Speaking", pct: skills.speaking },
  ];
  const weakest = skillList.filter((s) => s.pct > 0).sort((a, b) => a.pct - b.pct)[0]?.label ?? "Speaking";

  return {
    overall_level,
    written_theta: writtenTheta,
    oral_avg: oralLevelAvg,
    skills,
    weakest,
    answered: written.length,
    oral_count: oral.length,
  };
}

/* ---------------- Results / Certificate ---------------- */

function Results({
  written, oral, onRestart,
}: { written: Answered[]; oral: OralResult[]; onRestart: () => void }) {
  const summary = buildSummary(written, oral);
  const radarData = [
    { skill: "Listening", score: summary.skills.listening },
    { skill: "Reading", score: summary.skills.reading },
    { skill: "Grammar", score: summary.skills.grammar_vocab },
    { skill: "Speaking", score: summary.skills.speaking },
  ];

  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-3xl mx-auto">
        <div className="rounded-3xl border-4 border-double border-accent bg-card p-6 md:p-10 shadow-elevated text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-accent/10" />
          <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-primary/5" />
          <Trophy className="h-10 w-10 text-accent mx-auto relative" />
          <div className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">CLOE Prep · mock certificate</div>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-primary relative">Estimated level</h1>
          <div className="mt-3 inline-flex items-baseline gap-2 relative">
            <span className="text-6xl md:text-7xl font-black text-accent">{summary.overall_level}</span>
            <span className="text-sm text-muted-foreground">CEFR</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto relative">
            Based on {summary.answered} adaptive written items and {summary.oral_count} oral phases.
          </p>
        </div>

        <div className="mt-5 grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
            <div className="text-sm font-semibold">Per-skill breakdown</div>
            <div className="mt-2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="score" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 text-xs space-y-1">
              {radarData.map((d) => (
                <li key={d.skill} className="flex justify-between"><span>{d.skill}</span><span className="font-mono">{d.score}%</span></li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
            <div className="text-sm font-semibold">Guidance</div>
            <div className="mt-3 rounded-xl bg-accent/10 text-accent border border-accent/30 p-3 text-sm">
              <Sparkles className="h-4 w-4 inline mr-1.5 -mt-0.5" />
              You're ready for <strong>{summary.overall_level}</strong>-level practice and assessment.
            </div>
            <div className="mt-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 p-3 text-sm">
              Focus on <strong>{summary.weakest}</strong> before booking the real exam.
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Written estimate: {NUM_TO_LEVEL(summary.written_theta)} · Oral estimate: {NUM_TO_LEVEL(summary.oral_avg)}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-card border border-border p-5 shadow-card">
          <div className="text-sm font-semibold mb-3">Oral phase highlights</div>
          {oral.length === 0 && <p className="text-sm text-muted-foreground">No oral results recorded.</p>}
          <div className="space-y-3">
            {oral.map((r, i) => (
              <div key={i} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-accent font-semibold">{PHASE_META[r.phase].title}</span>
                  <span className="font-mono">{r.overall}% · {r.feedback.estimated_level}</span>
                </div>
                <p className="mt-1 text-sm">{r.feedback.summary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button onClick={onRestart} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <RotateCcw className="h-4 w-4 mr-2" /> Back to dashboard
          </Button>
          <Link to="/progress"><Button variant="outline">View progress</Button></Link>
        </div>
      </div>
    </AppShell>
  );
}
