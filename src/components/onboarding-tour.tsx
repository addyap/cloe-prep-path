import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { GraduationCap, ClipboardCheck, TrendingUp, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: Sparkles,
    title: "Welcome to CLOE Prep 👋",
    body: "A quick tour so you know where everything lives. It takes 20 seconds.",
  },
  {
    icon: GraduationCap,
    title: "Practice five skills",
    body: "Listening, Reading, Grammar & Vocabulary, Writing, and Speaking — each adapts to your level.",
  },
  {
    icon: ClipboardCheck,
    title: "Simulate the real exam",
    body: "Run a Full Mock Exam to see your CEFR estimate and a per-skill breakdown.",
  },
  {
    icon: TrendingUp,
    title: "Track your progress",
    body: "Streaks, badges, and a readiness meter keep you motivated until exam day.",
  },
];

export function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", u.user.id)
        .maybeSingle();
      if (!active) return;
      if (data && !data.onboarding_completed) setOpen(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const close = async () => {
    setOpen(false);
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", u.user.id);
    }
  };

  if (!open) return null;
  const s = STEPS[step];
  const Icon = s.icon;
  const last = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-card border border-border shadow-elevated p-6 md:p-8 animate-in fade-in zoom-in-95">
        <div className="h-12 w-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-primary">{s.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-6 rounded-full transition ${i === step ? "bg-accent" : "bg-secondary"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={close}>
              Skip
            </Button>
            <Button
              size="sm"
              onClick={() => (last ? close() : setStep(step + 1))}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {last ? "Get started" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
