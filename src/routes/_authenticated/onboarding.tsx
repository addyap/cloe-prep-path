import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { CefrLevel } from "@/components/cefr-progress";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: Onboarding,
});

const LEVELS: { value: CefrLevel; label: string; desc: string }[] = [
  { value: "A1", label: "A1 — Beginner", desc: "I know a few basic words." },
  { value: "A2", label: "A2 — Elementary", desc: "I can handle simple, routine exchanges." },
  { value: "B1", label: "B1 — Intermediate", desc: "I can deal with most situations at work." },
  { value: "B2", label: "B2 — Upper-Intermediate", desc: "I can interact fluently and clearly." },
  { value: "C1", label: "C1 — Advanced", desc: "I use English flexibly for professional tasks." },
  { value: "C2", label: "C2 — Proficient", desc: "I master English in nearly every situation." },
];

type Q = { q: string; opts: string[]; correct: number; level: CefrLevel };
const PLACEMENT: Q[] = [
  {
    q: 'Choose: "She ___ to the office every day."',
    opts: ["go", "goes", "going", "gone"],
    correct: 1,
    level: "A1",
  },
  {
    q: 'Choose: "If I ___ time, I would call him."',
    opts: ["have", "had", "will have", "would have"],
    correct: 1,
    level: "B1",
  },
  {
    q: "Best email opening to a new client:",
    opts: ["Hey!", "Yo", "Dear Mr. Dubois,", "Hi dude"],
    correct: 2,
    level: "A2",
  },
  {
    q: '"We need to ___ the deadline by one week."',
    opts: ["extend", "expand", "expend", "expense"],
    correct: 0,
    level: "B2",
  },
  {
    q: '"Had I known earlier, I ___ acted differently."',
    opts: ["would", "would have", "will have", "had"],
    correct: 1,
    level: "C1",
  },
];

function estimate(answers: (number | null)[]): CefrLevel {
  let score = 0;
  const weights: Record<CefrLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
  PLACEMENT.forEach((q, i) => {
    if (answers[i] === q.correct) score += weights[q.level];
  });
  if (score <= 2) return "A1";
  if (score <= 5) return "A2";
  if (score <= 9) return "B1";
  if (score <= 13) return "B2";
  if (score <= 16) return "C1";
  return "C2";
}

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"target" | "placement">("target");
  const [target, setTarget] = useState<CefrLevel | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(PLACEMENT.length).fill(null));
  const [selected, setSelected] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelected(answers[qIdx]);
  }, [qIdx, answers]);

  const onNext = async () => {
    const next = [...answers];
    next[qIdx] = selected;
    setAnswers(next);
    if (qIdx < PLACEMENT.length - 1) {
      setQIdx(qIdx + 1);
    } else {
      const estimated = estimate(next);
      setSaving(true);
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { error } = await supabase
        .from("profiles")
        .update({ target_cefr_level: target, current_estimated_level: estimated })
        .eq("id", u.user.id);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success(`Your estimated level: ${estimated}`);
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-xl bg-card rounded-3xl shadow-card p-6 md:p-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">CLOE Prep</span>
        </div>

        {step === "target" && (
          <>
            <h1 className="text-2xl font-bold text-primary">What level are you aiming for?</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Pick your target CEFR level. You can change it later.
            </p>
            <RadioGroup
              className="mt-6 space-y-2"
              value={target ?? ""}
              onValueChange={(v) => setTarget(v as CefrLevel)}
            >
              {LEVELS.map((l) => (
                <Label
                  key={l.value}
                  htmlFor={l.value}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-accent cursor-pointer has-[:checked]:border-accent has-[:checked]:bg-accent/5"
                >
                  <RadioGroupItem value={l.value} id={l.value} className="mt-1" />
                  <div>
                    <div className="font-semibold text-foreground">{l.label}</div>
                    <div className="text-sm text-muted-foreground">{l.desc}</div>
                  </div>
                </Label>
              ))}
            </RadioGroup>
            <Button
              disabled={!target}
              onClick={() => setStep("placement")}
              className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Continue to quick placement
            </Button>
          </>
        )}

        {step === "placement" && (
          <>
            <div className="text-xs font-semibold text-muted-foreground">
              Question {qIdx + 1} of {PLACEMENT.length}
            </div>
            <h2 className="text-xl font-bold text-primary mt-2">{PLACEMENT[qIdx].q}</h2>
            <RadioGroup
              className="mt-6 space-y-2"
              value={selected !== null ? String(selected) : ""}
              onValueChange={(v) => setSelected(Number(v))}
            >
              {PLACEMENT[qIdx].opts.map((opt, i) => (
                <Label
                  key={i}
                  htmlFor={`opt-${i}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-accent cursor-pointer has-[:checked]:border-accent has-[:checked]:bg-accent/5"
                >
                  <RadioGroupItem value={String(i)} id={`opt-${i}`} />
                  <span>{opt}</span>
                </Label>
              ))}
            </RadioGroup>
            <Button
              disabled={selected === null || saving}
              onClick={onNext}
              className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {qIdx === PLACEMENT.length - 1 ? (saving ? "Saving…" : "Finish") : "Next"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
