import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Headphones, BookOpen, PenLine, Mic } from "lucide-react";

export const Route = createFileRoute("/_authenticated/practice/")({ component: PracticePage });

const SKILLS = [
  { slug: "listening", title: "Listening", icon: Headphones },
  { slug: "reading", title: "Reading", icon: BookOpen },
  { slug: "grammar_vocab", title: "Grammar & Vocabulary", icon: PenLine },
  { slug: "writing", title: "Writing", icon: PenLine },
  { slug: "speaking", title: "Speaking", icon: Mic },
];

function PracticePage() {
  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Practice</h1>
        <p className="text-sm text-muted-foreground mt-1">Choose a skill to drill.</p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {SKILLS.map((s) => {
            const readyTo: Record<string, "/practice/listening" | "/practice/reading" | "/practice/grammar-vocab" | "/practice/writing"> = {
              listening: "/practice/listening",
              reading: "/practice/reading",
              grammar_vocab: "/practice/grammar-vocab",
              writing: "/practice/writing",
            };
            const ready = readyTo[s.slug];
            const linkProps = ready
              ? ({ to: ready } as const)
              : ({ to: "/coming-soon/$skill", params: { skill: s.slug } } as const);
            return (
              <Link key={s.slug} {...linkProps}
                className="rounded-2xl bg-card border border-border p-5 shadow-card hover:border-accent/50 transition">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-semibold text-foreground">{s.title}</div>
                {!ready && <div className="text-xs text-muted-foreground mt-1">Coming soon</div>}
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
