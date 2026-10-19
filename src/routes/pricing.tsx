import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { PublicPageShell } from "@/components/public-page-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — CLOE Prep" },
      {
        name: "description",
        content:
          "CLOE Prep is free during launch — every feature unlocked, no card required. Practice for the CLOE English certification.",
      },
      { property: "og:url", content: "https://cloe.antonyaddy.com/pricing" },
    ],
    links: [{ rel: "canonical", href: "https://cloe.antonyaddy.com/pricing" }],
  }),
  component: PricingPage,
});

// Listed in full rather than "Everything in Free" — there is no Free card on
// this page to refer back to, so the list has to stand on its own.
const PRO_FEATURES = [
  "Listening practice",
  "Reading practice",
  "Grammar & vocabulary practice",
  "Progress tracking & CEFR estimate",
  "Writing practice with AI feedback",
  "Speaking simulator with AI feedback",
  "Full timed mock exams",
  "Priority support",
];

function PricingPage() {
  return (
    <PublicPageShell>
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Free during launch</h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Every feature is free during launch — including AI-graded writing and speaking practice
          and full mock exams. No card required.
        </p>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
          That includes unlimited listening, reading, and grammar &amp; vocabulary practice with
          adaptive difficulty from A1 to C2 — so you can prepare at your own pace with no session
          limits.
        </p>
      </div>

      <div className="mt-10 max-w-md mx-auto">
        <div className="rounded-3xl border-2 border-accent bg-card p-6 md:p-8 shadow-elevated relative">
          <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Recommended
          </div>
          <div className="text-sm font-semibold uppercase tracking-wide text-accent">Pro</div>
          <div className="mt-2 text-4xl font-extrabold text-foreground">
            Free
            <span className="text-base font-medium text-muted-foreground"> during launch</span>
          </div>
          <ul className="mt-6 space-y-2.5">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link to="/dashboard">
            <Button className="w-full mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
              Get started
            </Button>
          </Link>
          <p className="mt-2 text-xs text-center text-muted-foreground">
            Every Pro feature is free during launch — no card needed.
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Questions about plans?{" "}
        <Link to="/faq" className="underline">
          Check the FAQ
        </Link>{" "}
        or read our{" "}
        <Link to="/refund-policy" className="underline">
          Refund Policy
        </Link>
        .
      </p>
    </PublicPageShell>
  );
}
