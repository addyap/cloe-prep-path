import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/coming-soon/$skill")({
  component: ComingSoon,
});

const LABELS: Record<string, string> = {
  listening: "Listening",
  reading: "Reading",
  grammar_vocab: "Grammar & Vocabulary",
  writing: "Writing",
  speaking: "Speaking",
  mock: "Full Mock Exam",
};

function ComingSoon() {
  const { skill } = Route.useParams();
  const label = LABELS[skill] ?? "This module";
  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-2xl mx-auto">
        <div className="rounded-3xl bg-card border border-border p-8 md:p-12 shadow-card text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl md:text-3xl font-bold text-primary">{label}</h1>
          <p className="text-muted-foreground mt-2">
            This module is coming soon. We're building it next.
          </p>
          <Link to="/dashboard">
            <Button className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
              Back to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
