import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Headphones, BookOpen, PenLine, Mic, LayoutGrid } from "lucide-react";
import { SKILL_ROUTES, type SkillSlug } from "@/lib/skills";

export const Route = createFileRoute("/_authenticated/practice/")({ component: PracticePage });

const SKILLS: { slug: SkillSlug; title: string; icon: typeof Headphones }[] = [
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
          {SKILLS.map((s) => (
            <Link
              key={s.slug}
              to={SKILL_ROUTES[s.slug]}
              className="rounded-2xl bg-card border border-border p-5 shadow-card hover:border-accent/50 transition"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-semibold text-foreground">{s.title}</div>
            </Link>
          ))}
          <Link
            to="/practice/word-bank"
            className="rounded-2xl bg-card border border-border p-5 shadow-card hover:border-accent/50 transition"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div className="mt-4 font-semibold text-foreground">Word bank</div>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
