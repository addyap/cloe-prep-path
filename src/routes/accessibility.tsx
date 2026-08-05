import { createFileRoute } from "@tanstack/react-router";
import { PublicPageShell } from "@/components/public-page-shell";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility — CLOE Prep" },
      {
        name: "description",
        content:
          "CLOE Prep's commitment to accessibility — what we support, known limitations, and how to report barriers.",
      },
      { property: "og:url", content: "https://cloe.antonyaddy.com/accessibility" },
    ],
    links: [{ rel: "canonical", href: "https://cloe.antonyaddy.com/accessibility" }],
  }),
  component: AccessibilityPage,
});

function AccessibilityPage() {
  return (
    <PublicPageShell>
      <h1 className="text-3xl md:text-4xl font-bold text-primary">Accessibility</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: 5 August 2026</p>

      <div className="mt-8 space-y-8 text-sm md:text-base leading-relaxed text-foreground/90">
        <section>
          <h2 className="text-lg font-semibold text-foreground">Our commitment</h2>
          <p className="mt-2">
            CLOE Prep is committed to making English certification practice accessible to as many
            people as possible. We aim to conform to the{" "}
            <a
              href="https://www.w3.org/TR/WCAG22/"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web Content Accessibility Guidelines (WCAG) 2.2
            </a>{" "}
            at the AA level.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">What we do</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Semantic HTML and ARIA landmarks throughout the site.</li>
            <li>Keyboard navigation for all interactive elements.</li>
            <li>Skip-to-content links on every page.</li>
            <li>Colour contrast that meets WCAG AA requirements.</li>
            <li>Text that can be resized up to 200% without loss of content.</li>
            <li>
              Labels and instructions for all form controls, including practice exercises.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Known limitations</h2>
          <p className="mt-2">
            We are aware of the following areas where accessibility could be improved:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <strong>Listening exercises:</strong> Audio content is accompanied by transcripts
              after submission, but real-time captions are not yet available during playback.
            </li>
            <li>
              <strong>Speaking exercises:</strong> The microphone-based speaking simulator requires
              verbal input. We are exploring alternative input methods for users who cannot use
              speech.
            </li>
            <li>
              <strong>Timed mock exams:</strong> The countdown timer may create pressure for some
              users. We plan to add an option to extend or disable the timer.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Feedback</h2>
          <p className="mt-2">
            If you encounter any accessibility barriers while using CLOE Prep, please let us know.
            We take every report seriously and will do our best to address the issue promptly.
          </p>
          <p className="mt-2">
            Email:{" "}
            <a href="mailto:formations@antonyaddy.com" className="underline">
              formations@antonyaddy.com
            </a>
          </p>
          <p className="mt-2">
            When reporting an issue, it helps to include which page you were on, what you were
            trying to do, and what assistive technology you were using (if any).
          </p>
        </section>
      </div>
    </PublicPageShell>
  );
}
