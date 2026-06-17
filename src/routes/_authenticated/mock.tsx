import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { ClipboardCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/mock")({ component: MockPage });

function MockPage() {
  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Mock Exam</h1>
        <p className="text-sm text-muted-foreground mt-1">A full adaptive simulation of CLOE.</p>
        <div className="mt-6 rounded-3xl bg-card border border-border p-8 shadow-card text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
            <ClipboardCheck className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-bold text-foreground">Coming soon</h2>
          <p className="text-sm text-muted-foreground mt-2">
            The full adaptive mock exam will be available shortly.
          </p>
          <Link to="/dashboard"><Button className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">Back to dashboard</Button></Link>
        </div>
      </div>
    </AppShell>
  );
}
