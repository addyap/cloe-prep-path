import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  GraduationCap,
  Clock,
  BarChart3,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicFooter } from "@/components/public-page-shell";
import { MeridianHero } from "@/components/meridian-hero";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CLOE Prep — Pass CLOE with confidence" },
      {
        name: "description",
        content:
          "Independent, structured preparation for the CLOE English certification. Adaptive practice across all four skills.",
      },
      { property: "og:url", content: "https://cloe.antonyaddy.com/" },
    ],
    links: [{ rel: "canonical", href: "https://cloe.antonyaddy.com/" }],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to content
      </a>
      <MeridianHero />

      <main id="main-content">
      {/* 4 skills */}
      <section id="what-is-cloe" className="px-6 md:px-10 py-16 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            The four skills, plus speaking.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            CLOE tests the English you actually use at work: emails, meetings, calls, negotiations
            and customer service.
          </p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Headphones,
                title: "Listening",
                desc: "Phone calls, meetings, announcements.",
              },
              {
                icon: BookOpen,
                title: "Reading",
                desc: "Emails, reports, professional documents.",
              },
              {
                icon: PenLine,
                title: "Grammar & Writing",
                desc: "Build clear, accurate messages.",
              },
              { icon: Mic, title: "Speaking", desc: "Respond to realistic work prompts." },
            ].map((s) => (
              <div key={s.title} className="rounded-2xl bg-background p-5 shadow-card">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="font-semibold text-foreground">{s.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-background p-6 shadow-card">
              <BarChart3 className="h-6 w-6 text-accent mb-3" />
              <div className="font-semibold">Adaptive format</div>
              <p className="text-sm text-muted-foreground mt-1">
                Questions adjust to your level. The more you practise, the more accurate your CEFR
                estimate.
              </p>
            </div>
            <div className="rounded-2xl bg-background p-6 shadow-card">
              <Clock className="h-6 w-6 text-accent mb-3" />
              <div className="font-semibold">Short, focused sessions</div>
              <p className="text-sm text-muted-foreground mt-1">
                Practise 10 minutes a day on one skill, or take a full mock exam when you feel
                ready.
              </p>
            </div>
            <div className="rounded-2xl bg-background p-6 shadow-card">
              <GraduationCap className="h-6 w-6 text-accent mb-3" />
              <div className="font-semibold">CEFR-aligned</div>
              <p className="text-sm text-muted-foreground mt-1">
                Every question is mapped to a CEFR level from A1 to C2, like the official exam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exam day */}
      <section className="px-6 md:px-10 py-16 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">What to expect on exam day</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {
              n: "1",
              t: "Written section, computer-based",
              d: "About 50 minutes of listening, reading and grammar on a computer at an approved test centre. The difficulty adapts as you answer.",
            },
            {
              n: "2",
              t: "Oral section, live with an examiner",
              d: "A 20-minute spoken exam with a certified examiner: personal-background questions, a role-play scenario, and a thematic discussion.",
            },
            {
              n: "3",
              t: "Your CEFR result",
              d: "You receive a CEFR level (A2 to B2) for each skill, plus an overall result.",
            },
          ].map((step) => (
            <div key={step.n} className="rounded-2xl bg-card p-6 shadow-card border border-border">
              <div className="h-9 w-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                {step.n}
              </div>
              <div className="mt-4 font-semibold text-foreground">{step.t}</div>
              <p className="text-sm text-muted-foreground mt-2">{step.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-card border border-border p-8 md:p-10">
          <h3 className="text-xl md:text-2xl font-bold text-primary">Built by a professional trainer</h3>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            CLOE Prep is created by Antony Addy, a certified{" "}
            <span lang="fr">Formateur Professionnel d'Adultes</span> with over 20 years of
            experience teaching professional English in France.
          </p>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-accent mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-sm">Certified trainer</div>
                <div className="text-xs text-muted-foreground">
                  FPA-certified, registered with DREETS (NDA 93830738883)
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-accent mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-sm">CEFR-aligned content</div>
                <div className="text-xs text-muted-foreground">
                  Every question mapped to A1–C2, mirroring the official exam format
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <GraduationCap className="h-5 w-5 text-accent mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-sm">20+ years in the field</div>
                <div className="text-xs text-muted-foreground">
                  Training professionals across the Var and Alpes-Maritimes
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-3xl bg-primary text-primary-foreground p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">Ready to start?</h3>
            <p className="mt-2 text-primary-foreground/80">
              Jump straight in — no account needed — and take a quick placement test.
            </p>
          </div>
          <Link to="/dashboard">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-6 text-base"
            >
              Start practising
            </Button>
          </Link>
        </div>
      </section>
      </main>

      <PublicFooter />
    </div>
  );
}
