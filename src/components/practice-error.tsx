import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

/**
 * Scoped fallback for a practice/mock-exam session that failed to load or
 * crashed mid-session. Keeps the app shell (nav, sign-out) intact instead of
 * falling through to the root error boundary's full-page reset.
 */
export function PracticeErrorState({ message }: { message?: string }) {
  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-lg mx-auto">
        <div className="rounded-3xl bg-card border border-border shadow-card p-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-foreground">This session couldn't load</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {message ?? "Something went wrong fetching the questions. Please try again."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Try again
            </Button>
            <Link to="/practice">
              <Button variant="outline">Back to practice</Button>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/** Route-level errorComponent for practice/mock-exam routes — used via createFileRoute({ errorComponent: ... }). */
export function PracticeRouteError({ error }: { error: Error }) {
  console.error(error);
  return <PracticeErrorState />;
}
