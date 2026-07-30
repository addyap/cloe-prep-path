import { createFileRoute } from "@tanstack/react-router";
import { PublicPageShell } from "@/components/public-page-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — CLOE Prep" },
      {
        name: "description",
        content: "How CLOE Prep collects, uses, and protects your data.",
      },
      { property: "og:url", content: "https://cloe.antonyaddy.com/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://cloe.antonyaddy.com/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PublicPageShell>
      <h1 className="text-3xl md:text-4xl font-bold text-primary">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: 27 July 2026</p>

      <div className="mt-8 space-y-8 text-sm md:text-base leading-relaxed text-foreground/90">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Who we are</h2>
          <p className="mt-2">
            CLOE Prep is published by Antony Addy, an independent auto-entrepreneur (certified
            Formateur Professionnel d'Adultes) registered in France.
          </p>
          <p className="mt-2">
            Address: 135 rue Henri Vadon, Résidence des Arènes, 83600 Fréjus, France
            <br />
            SIRET: 48317889300028
            <br />
            Contact: formations@antonyaddy.com
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. What we collect</h2>
          <p className="mt-2">
            You can use CLOE Prep as a guest (an anonymous account with no email) or by creating a
            full account with email/password, a magic link, or Google sign-in. Depending on how you
            use the app, we collect:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Your email address, if you create a full account.</li>
            <li>
              Your practice activity: answers, scores, CEFR level estimates, and session history, so
              we can track your progress and adapt difficulty.
            </li>
            <li>
              Text you submit for AI-graded writing feedback, and the transcript of anything you say
              for AI-graded speaking feedback (see section 3 — we do not keep your raw audio
              recording).
            </li>
            <li>
              Standard technical data (IP address, browser type, pages visited) via our hosting and
              analytics providers.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. How we use third parties</h2>
          <p className="mt-2">We share the minimum data necessary with:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <strong>Supabase</strong> — hosts our database, authentication, and file storage
              (including generated listening audio clips).
            </li>
            <li>
              <strong>OpenAI</strong> — grades your writing submissions, transcribes your speaking
              recordings, and evaluates the transcript, to produce your CEFR feedback. Your spoken
              audio is sent to OpenAI for transcription only and is not stored by us afterward —
              only the resulting text transcript is saved to your account. Text you submit for
              grading is retained as part of your practice history.
            </li>
            <li>
              <strong>Vercel</strong> — hosts the website itself.
            </li>
            <li>
              <strong>Stripe</strong> — if you subscribe to a paid plan, Stripe processes your
              payment directly. We never see or store your card details.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Why we process your data</h2>
          <p className="mt-2">
            To provide the service you asked for (practice sessions, AI feedback, progress
            tracking), to maintain your account, and — if you subscribe — to bill you. We do not
            sell your data or use it for advertising.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. How long we keep it</h2>
          <p className="mt-2">
            We keep your account and practice history for as long as your account is active. If you
            delete your account, we delete your personal data within a reasonable period, except
            where we're required to keep records (e.g. billing records) for legal reasons.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Your rights</h2>
          <p className="mt-2">
            If you're in the EU/EEA, UK, or a jurisdiction with similar protections, you have the
            right to access, correct, export, or delete your personal data, and to object to or
            restrict certain processing. To exercise any of these rights, email
            formations@antonyaddy.com. You can also lodge a complaint with your local data
            protection authority — in France, the CNIL (www.cnil.fr).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Changes to this policy</h2>
          <p className="mt-2">
            We may update this policy as the app evolves. We'll update the "last updated" date above
            when we do.
          </p>
        </section>

        <p className="text-xs text-muted-foreground italic">
          This policy describes our current data practices in plain language. It isn't a substitute
          for legal advice specific to your situation.
        </p>
      </div>
    </PublicPageShell>
  );
}
