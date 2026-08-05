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
        content: "Free and Pro plans for CLOE Prep — practice for the CLOE English certification.",
      },
      { property: "og:url", content: "https://cloe.antonyaddy.com/pricing" },
    ],
    links: [{ rel: "canonical", href: "https://cloe.antonyaddy.com/pricing" }],
  }),
  component: PricingPage,
});

// Placeholder monthly price for the Pro plan — update once billing is configured
// in Stripe (this is display-only right now; ENFORCE_ENTITLEMENTS in
// src/lib/entitlements.ts is off, so nothing is actually gated yet).
const PRO_PRICE_DISPLAY = "€7.99";

const FREE_FEATURES = [
  "Listening practice",
  "Reading practice",
  "Grammar & vocabulary practice",
  "Progress tracking & CEFR estimate",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Writing practice with AI feedback",
  "Speaking simulator with AI feedback",
  "Full timed mock exams",
  "Priority support",
];

function PricingPage() {
  return (
    <PublicPageShell>
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Simple pricing</h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Start free. Upgrade when you're ready for AI-graded writing and speaking practice, plus
          full mock exams.
        </p>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
          Every plan includes unlimited listening, reading, and grammar &amp; vocabulary practice
          with adaptive difficulty from A1 to C2 — so you can prepare at your own pace with no
          session limits.
        </p>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
          <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Free
          </div>
          <div className="mt-2 text-4xl font-extrabold text-foreground">€0</div>
          <p className="mt-1 text-sm text-muted-foreground">Forever, no card required.</p>
          <ul className="mt-6 space-y-2.5">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link to="/dashboard">
            <Button variant="outline" className="w-full mt-8">
              Get started
            </Button>
          </Link>
        </div>

        <div className="rounded-3xl border-2 border-accent bg-card p-6 md:p-8 shadow-elevated relative">
          <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Recommended
          </div>
          <div className="text-sm font-semibold uppercase tracking-wide text-accent">Pro</div>
          <div className="mt-2 text-4xl font-extrabold text-foreground">
            {PRO_PRICE_DISPLAY}
            <span className="text-base font-medium text-muted-foreground">/month</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Cancel anytime.</p>
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
              Try Pro free
            </Button>
          </Link>
          <p className="mt-2 text-xs text-center text-muted-foreground">
            Pro billing isn't live yet — every feature is free while we finish setup.
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
