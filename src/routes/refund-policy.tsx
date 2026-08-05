import { createFileRoute } from "@tanstack/react-router";
import { PublicPageShell } from "@/components/public-page-shell";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — CLOE Prep" },
      {
        name: "description",
        content: "Cancellation and refund terms for CLOE Prep Pro subscriptions — 14-day cooling-off period, how to cancel, and how to request a refund.",
      },
      { property: "og:url", content: "https://cloe.antonyaddy.com/refund-policy" },
    ],
    links: [{ rel: "canonical", href: "https://cloe.antonyaddy.com/refund-policy" }],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <PublicPageShell>
      <h1 className="text-3xl md:text-4xl font-bold text-primary">Refund Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: 27 July 2026</p>

      <div className="mt-8 space-y-8 text-sm md:text-base leading-relaxed text-foreground/90">
        <section>
          <h2 className="text-lg font-semibold text-foreground">Cancelling your subscription</h2>
          <p className="mt-2">
            You can cancel your Pro subscription at any time from your account settings. Cancelling
            stops future billing, but you'll keep Pro access until the end of the billing period
            you've already paid for — we don't cut off access early or prorate the remainder of a
            period you cancel mid-cycle.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">14-day cooling-off period</h2>
          <p className="mt-2">
            If you're an EU/EEA or UK consumer, you have a legal right to withdraw from an online
            purchase within 14 days without giving a reason. If you contact us at
            formations@antonyaddy.com within 14 days of your first payment and haven't made
            substantial use of Pro-only features in that time, we'll refund that payment in full.
          </p>
          <p className="mt-2">
            By starting to use Pro features (AI writing/speaking feedback, mock exams) right after
            subscribing, you're asking us to begin the service immediately — under EU consumer law
            this may mean the withdrawal right no longer applies once the service has been fully
            used. We'll always assess refund requests fairly rather than relying on a technicality.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">After the cooling-off period</h2>
          <p className="mt-2">
            Beyond the first 14 days, subscription payments are non-refundable, including for
            partially used billing periods — cancelling simply stops the next renewal. If
            something's gone genuinely wrong on our end (a billing error, a service outage that
            affected your ability to use Pro features), email us and we'll make it right.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">How to request a refund</h2>
          <p className="mt-2">
            Email formations@antonyaddy.com with your account email and the reason for your request.
            We aim to respond within a few business days.
          </p>
        </section>
      </div>
    </PublicPageShell>
  );
}
