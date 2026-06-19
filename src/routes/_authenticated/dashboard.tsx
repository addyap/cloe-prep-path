import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Headphones, BookOpen, PenLine, Mic, ClipboardCheck, GraduationCap, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { CefrProgress, type CefrLevel } from "@/components/cefr-progress";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const SKILLS = [
  { slug: "listening", title: "Listening", icon: Headphones, desc: "Phone calls, meetings, announcements." },
  { slug: "reading", title: "Reading", icon: BookOpen, desc: "Emails, reports, documents." },
  { slug: "grammar_vocab", title: "Grammar & Vocabulary", icon: PenLine, desc: "Fix errors, build precision." },
  { slug: "writing", title: "Writing", icon: PenLine, desc: "Professional emails and short texts." },
  { slug: "speaking", title: "Speaking", icon: Mic, desc: "Respond to realistic prompts." },
];

function Dashboard() {
  const [name, setName] = useState<string>("");
  const [current, setCurrent] = useState<CefrLevel | null>(null);
  const [target, setTarget] = useState<CefrLevel | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, current_estimated_level, target_cefr_level")
        .eq("id", u.user.id)
        .maybeSingle();
      setName((data?.full_name ?? u.user.email ?? "").split(" ")[0] ?? "");
      setCurrent((data?.current_estimated_level as CefrLevel) ?? null);
      setTarget((data?.target_cefr_level as CefrLevel) ?? null);
    })();
  }, []);

  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              Hi {name || "there"} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Let's get you closer to your CLOE goal today.</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-card shadow-card p-6 md:p-8 border border-border">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-accent" />
            <div className="text-sm font-semibold text-muted-foreground">Your estimated level</div>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-5xl font-extrabold text-primary">{current ?? "—"}</span>
            {target && (
              <span className="text-sm text-muted-foreground">
                Target: <strong className="text-foreground">{target}</strong>
              </span>
            )}
          </div>
          <CefrProgress current={current} target={target} className="mt-4" />
        </div>

        <h2 className="mt-10 text-lg font-bold text-foreground">Practice by skill</h2>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILLS.map((s) => {
            const readyTo: Record<string, "/practice/listening" | "/practice/reading" | "/practice/grammar-vocab" | "/practice/writing" | "/practice/speaking"> = {
              listening: "/practice/listening",
              reading: "/practice/reading",
              grammar_vocab: "/practice/grammar-vocab",
              writing: "/practice/writing",
              speaking: "/practice/speaking",
            };
            const ready = readyTo[s.slug];
            const linkProps = ready
              ? ({ to: ready } as const)
              : ({ to: "/coming-soon/$skill", params: { skill: s.slug } } as const);
            return (
              <Link
                key={s.slug}
                {...linkProps}
                className="group rounded-2xl bg-card border border-border p-5 shadow-card hover:shadow-elevated hover:border-accent/50 transition"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-semibold text-foreground">{s.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.desc}</div>
                <div className="mt-4 text-sm font-medium text-accent flex items-center gap-1">
                  {ready ? "Start" : "Coming soon"} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}

          <Link
            to="/coming-soon/$skill"
            params={{ skill: "mock" }}
            className="group rounded-2xl bg-primary text-primary-foreground p-5 shadow-elevated hover:opacity-95 transition"
          >
            <div className="h-10 w-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div className="mt-4 font-semibold">Full Mock Exam</div>
            <div className="text-sm text-primary-foreground/80 mt-1">
              Simulate the full adaptive CLOE in one sitting.
            </div>
            <div className="mt-4 text-sm font-medium text-accent flex items-center gap-1">
              Start mock <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
