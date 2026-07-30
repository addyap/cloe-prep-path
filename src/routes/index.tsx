import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  GraduationCap,
  ArrowRight,
  Check,
  Clock,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicFooter } from "@/components/public-page-shell";

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
      {/* Nav */}
      <header className="px-6 md:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">CLOE Prep</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/pricing"
            className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Pricing
          </Link>
          <Link to="/dashboard">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Get started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 md:px-10 pt-12 md:pt-20 pb-16 md:pb-24 max-w-6xl mx-auto w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold mb-6">
            <span className="h-2 w-2 rounded-full bg-accent" /> Built for CLOE candidates
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary">
            Pass CLOE with confidence.
          </h1>
          <p className="mt-5 text-lg md:text-xl text-muted-foreground leading-relaxed">
            Targeted, adaptive practice for the CLOE English certification. Train all four skills,
            track your CEFR level from A1 to C2, and walk into exam day ready.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-6 text-base"
              >
                Start practising <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#what-is-cloe">
              <Button size="lg" variant="outline" className="h-12 px-6 text-base">
                Learn about the exam
              </Button>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" /> Adaptive A1 → C2
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" /> Professional contexts
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" /> Mock exams
            </span>
          </div>
        </div>
      </section>

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
              t: "Computer-based",
              d: "You take CLOE on a computer at an approved test centre. No paper.",
            },
            {
              n: "2",
              t: "Adaptive sections",
              d: "The difficulty adjusts based on your answers, so each candidate gets a personalised test.",
            },
            {
              n: "3",
              t: "Your CEFR result",
              d: "You receive a level (A1 to C2) for each skill, plus an overall result valid for 2 years.",
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

      <PublicFooter />
    </div>
  );
}
