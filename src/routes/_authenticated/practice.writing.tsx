import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  PenLine,
  Timer,
  Loader2,
  Trophy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PracticeErrorState, PracticeRouteError } from "@/components/practice-error";
import { cn } from "@/lib/utils";
import { evaluateWriting, type WritingFeedback } from "@/lib/writing-feedback.functions";

export const Route = createFileRoute("/_authenticated/practice/writing")({
  component: WritingPractice,
  errorComponent: PracticeRouteError,
});

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
type Level = (typeof LEVELS)[number];

type Prompt = {
  id: string;
  cefr_level: Level;
  context_tag: string;
  prompt_text: string;
};

function countWords(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function parseWordRange(prompt: string): [number, number] | null {
  const m = prompt.match(/\((\d+)\s*[–-]\s*(\d+)\s*words?\)/i);
  if (!m) return null;
  return [parseInt(m[1], 10), parseInt(m[2], 10)];
}

function WritingPractice() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<Prompt | null>(null);
  const [text, setText] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [overall, setOverall] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const startedAt = useRef<number | null>(null);
  const evaluate = useServerFn(evaluateWriting);

  useEffect(() => {
    (async () => {
      try {
        const { data, error: qError } = await supabase
          .from("questions")
          .select("id,cefr_level,context_tag,prompt_text")
          .eq("skill", "writing")
          .eq("type", "prompt");
        if (qError) throw qError;
        setPrompts((data ?? []) as Prompt[]);
      } catch (err) {
        console.error(err);
        setLoadError("We couldn't load the writing prompts. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!current || feedback) return;
    if (!startedAt.current) startedAt.current = Date.now();
    const id = setInterval(() => {
      if (startedAt.current) setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 500);
    return () => clearInterval(id);
  }, [current, feedback]);

  const words = useMemo(() => countWords(text), [text]);
  const range = current ? parseWordRange(current.prompt_text) : null;
  const inRange = range ? words >= range[0] && words <= range[1] : true;

  function pick(p: Prompt) {
    setCurrent(p);
    setText("");
    setElapsed(0);
    startedAt.current = null;
    setFeedback(null);
    setOverall(null);
    setError(null);
  }

  function reset() {
    setCurrent(null);
    setText("");
    setFeedback(null);
    setOverall(null);
    setError(null);
    startedAt.current = null;
    setElapsed(0);
  }

  async function submit() {
    if (!current || !text.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await evaluate({
        data: {
          question_id: current.id,
          prompt_text: current.prompt_text,
          target_level: current.cefr_level,
          user_text: text.trim(),
        },
      });
      setFeedback(res.feedback);
      setOverall(res.overall);
    } catch (e: unknown) {
      const msg = (e as Error).message || "Something went wrong.";
      if (msg.includes("RATE_LIMIT"))
        setError("AI rate limit reached. Wait a moment and try again.");
      else if (msg.includes("CREDITS_EXHAUSTED"))
        setError("AI credits exhausted for this workspace.");
      else setError("Couldn't evaluate your response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function revise() {
    setFeedback(null);
    setOverall(null);
    startedAt.current = Date.now() - elapsed * 1000;
  }

  if (loadError) {
    return <PracticeErrorState message={loadError} />;
  }

  if (loading) {
    return (
      <AppShell>
        <div className="p-10 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
        </div>
      </AppShell>
    );
  }

  if (!loading && prompts.length === 0) {
    return (
      <PracticeErrorState message="No writing prompts are available right now. Please try again later." />
    );
  }

  // Prompt picker
  if (!current) {
    return (
      <AppShell>
        <div className="p-5 md:p-10 max-w-3xl mx-auto">
          <Link to="/practice" className="text-sm text-muted-foreground hover:text-foreground">
            ← All practice
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <PenLine className="h-6 w-6 text-accent" />
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Writing practice</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Pick a professional task. You'll write a response, then get AI-generated CEFR feedback.
          </p>
          <div className="mt-6 grid gap-3">
            {prompts.map((p) => {
              const title = p.prompt_text.split("\n")[0];
              const r = parseWordRange(p.prompt_text);
              return (
                <button
                  key={p.id}
                  onClick={() => pick(p)}
                  className="text-left rounded-2xl border-2 border-border bg-card p-5 hover:border-accent/60 hover:bg-accent/5 transition"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {p.cefr_level}
                    </span>
                    <span className="text-muted-foreground capitalize">
                      {p.context_tag.replace(/_/g, " ")}
                    </span>
                    {r && (
                      <span className="ml-auto text-muted-foreground">
                        {r[0]}–{r[1]} words
                      </span>
                    )}
                  </div>
                  <div className="mt-2 font-semibold text-foreground">{title}</div>
                </button>
              );
            })}
            {prompts.length === 0 && (
              <p className="text-sm text-muted-foreground">No prompts available yet.</p>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  // Feedback report
  if (feedback) {
    return (
      <AppShell>
        <div className="p-5 md:p-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <button onClick={reset} className="hover:text-foreground">
              ← New task
            </button>
            <span>Target: {current.cefr_level}</span>
          </div>

          <div className="mt-4 rounded-3xl bg-card border border-border shadow-card p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                  Estimated level
                </div>
                <div className="text-3xl font-bold text-primary">{feedback.estimated_level}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                  Overall
                </div>
                <div className="text-3xl font-bold text-accent">{overall}%</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-foreground/80">{feedback.summary}</p>
          </div>

          {/* Criteria */}
          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            {(
              [
                ["task_achievement", "Task achievement"],
                ["coherence", "Coherence"],
                ["grammar_range", "Grammar & range"],
                ["vocabulary", "Vocabulary"],
              ] as const
            ).map(([key, label]) => {
              const score = feedback.scores[key];
              const comment = feedback.comments[key];
              return (
                <div key={key} className="rounded-2xl bg-card border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-foreground">{label}</div>
                    <div className="text-sm font-bold text-primary">{score}/5</div>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className={cn(
                          "h-1.5 flex-1 rounded-full",
                          n <= score ? "bg-accent" : "bg-secondary",
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-foreground/80">{comment}</p>
                </div>
              );
            })}
          </div>

          {/* Suggestions */}
          <div className="mt-5 rounded-2xl border-2 border-accent/30 bg-accent/5 p-5">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-accent" /> Suggestions
            </div>
            <ul className="mt-3 space-y-2">
              {feedback.suggestions.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground/90">
                  <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improved sample */}
          <div className="mt-5 rounded-2xl border border-border bg-card p-5">
            <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
              Improved sample ({current.cefr_level})
            </div>
            <p className="mt-3 text-sm md:text-base text-foreground whitespace-pre-wrap leading-relaxed">
              {feedback.improved_sample}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 justify-end">
            <Button variant="outline" onClick={reset}>
              Try another task
            </Button>
            <Button
              onClick={revise}
              className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Revise & resubmit
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  // Editor
  const [title, ...rest] = current.prompt_text.split("\n");
  const body = rest.join("\n").trim();

  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <button onClick={reset} className="hover:text-foreground">
            ← Change task
          </button>
          <span className="inline-flex items-center gap-1">
            <Timer className="h-4 w-4" /> {Math.floor(elapsed / 60)}:
            {(elapsed % 60).toString().padStart(2, "0")}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            {current.cefr_level} · {current.context_tag.replace(/_/g, " ")}
          </span>
        </div>

        <div className="mt-4 rounded-3xl bg-card border border-border shadow-card p-6">
          <h1 className="text-xl md:text-2xl font-bold text-primary">{title}</h1>
          {body && (
            <p className="mt-3 text-sm md:text-base text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {body}
            </p>
          )}
        </div>

        <div className="mt-5">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your response here…"
            className="min-h-[300px] text-base leading-relaxed resize-y rounded-2xl"
            disabled={submitting}
          />
          <div className="mt-2 flex items-center justify-between text-xs">
            <span
              className={cn(
                "font-medium",
                range && !inRange ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {words} words
              {range && (
                <span className="text-muted-foreground">
                  {" "}
                  · target {range[0]}–{range[1]}
                </span>
              )}
            </span>
            <span className="text-muted-foreground">
              {text.length === 0
                ? "Start writing — the AI will grade against the target level."
                : "Tip: keep a professional, polite register."}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-foreground/90">{error}</p>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <Button
            onClick={submit}
            disabled={!text.trim() || submitting}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Evaluating…
              </>
            ) : (
              <>
                Submit for feedback <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
