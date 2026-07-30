import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicPageShell } from "@/components/public-page-shell";

const FAQS: Array<{ q: string; a: React.ReactNode; plainAnswer: string }> = [
  {
    q: "Is CLOE Prep official CLOE material?",
    a: "No. CLOE Prep is an independent study tool built to mirror the format and difficulty of the real exam, but it isn't affiliated with, endorsed by, or connected to the official CLOE certification or the organisations that deliver it.",
    plainAnswer:
      "No. CLOE Prep is an independent study tool built to mirror the format and difficulty of the real exam, but it isn't affiliated with, endorsed by, or connected to the official CLOE certification or the organisations that deliver it.",
  },
  {
    q: "Do I need to create an account?",
    a: 'No — click "Get started" and you\'re straight into the app as a guest. You can create a full account (email, magic link, or Google) later if you want your progress to persist across devices.',
    plainAnswer:
      'No — click "Get started" and you\'re straight into the app as a guest. You can create a full account (email, magic link, or Google) later if you want your progress to persist across devices.',
  },
  {
    q: "What's free, and what needs a Pro plan?",
    a: (
      <>
        Everything is free right now, including writing practice, the speaking simulator, full mock
        exams, and AI-generated feedback — Pro billing isn't live yet, so there's nothing to pay for
        while we finish testing. See{" "}
        <Link to="/pricing" className="underline">
          Pricing
        </Link>{" "}
        for what's planned once it launches.
      </>
    ),
    plainAnswer:
      "Everything is free right now, including writing practice, the speaking simulator, full mock exams, and AI-generated feedback — Pro billing isn't live yet, so there's nothing to pay for while we finish testing.",
  },
  {
    q: "How does the AI feedback work?",
    a: "When you submit a writing task or a speaking recording, it's sent to an AI model that grades it against the CEFR scale (A1–C2) and gives you a score, strengths, and concrete suggestions — the same way a human examiner would evaluate it, though it's not a certified assessment.",
    plainAnswer:
      "When you submit a writing task or a speaking recording, it's sent to an AI model that grades it against the CEFR scale (A1-C2) and gives you a score, strengths, and concrete suggestions. It's not a certified assessment.",
  },
  {
    q: "Will I have to pay eventually?",
    a: "Not for what you're already using. If a paid Pro plan launches, it won't retroactively lock features you already have access to for free — see our Refund Policy for how billing would work once it's live.",
    plainAnswer:
      "Not for what you're already using. If a paid Pro plan launches, it won't retroactively lock features you already have access to for free.",
  },
  {
    q: "Is my data safe?",
    a: (
      <>
        Yes — we only share what's needed with the providers that run the service (database hosting,
        AI grading, payments), we never sell your data, and you can request deletion at any time.
        Full details in our{" "}
        <Link to="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </>
    ),
    plainAnswer:
      "Yes — we only share what's needed with the providers that run the service (database hosting, AI grading, payments), we never sell your data, and you can request deletion at any time.",
  },
  {
    q: "What CEFR levels does CLOE Prep cover?",
    a: "All six — A1 through C2 — across every skill.",
    plainAnswer: "All six - A1 through C2 - across every skill.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — CLOE Prep" },
      {
        name: "description",
        content: "Common questions about CLOE Prep — pricing, accounts, AI feedback, and data.",
      },
      { property: "og:url", content: "https://cloe.antonyaddy.com/faq" },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.plainAnswer },
          })),
        },
      },
    ],
    links: [{ rel: "canonical", href: "https://cloe.antonyaddy.com/faq" }],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <PublicPageShell>
      <h1 className="text-3xl md:text-4xl font-bold text-primary">Frequently asked questions</h1>
      <div className="mt-8 space-y-6">
        {FAQS.map((f) => (
          <div key={f.q} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-semibold text-foreground">{f.q}</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </PublicPageShell>
  );
}
