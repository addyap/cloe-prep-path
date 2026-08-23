import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const FOOTER_LINKS = [
  { to: "/pricing", label: "Pricing", lang: undefined },
  { to: "/faq", label: "FAQ", lang: undefined },
  { to: "/privacy", label: "Privacy Policy", lang: undefined },
  { to: "/terms", label: "Terms of Service", lang: undefined },
  { to: "/refund-policy", label: "Refund Policy", lang: undefined },
  { to: "/accessibility", label: "Accessibility", lang: undefined },
  { to: "/mentions-legales", label: "Mentions légales", lang: "fr" as const },
];

export function PublicFooter() {
  return (
    <footer className="px-6 md:px-10 py-10 border-t border-border bg-card">
      <div className="max-w-6xl mx-auto text-sm text-muted-foreground space-y-3">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <GraduationCap className="h-4 w-4" /> CLOE Prep
        </div>
        <p>
          <strong>Disclaimer:</strong> CLOE Prep is an independent study tool. It is not affiliated
          with, endorsed by, or connected to the official CLOE certification or the organisations
          that deliver it. All practice material is original and designed only to help learners
          prepare.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {FOOTER_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              lang={l.lang}
              className="py-0.5 hover:text-foreground underline-offset-2 hover:underline"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <p>© {new Date().getFullYear()} CLOE Prep.</p>
        <p>
          Part of{" "}
          <a
            href="https://www.antonyaddy.com/ressources-en-ligne"
            className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
          >
            Fluentory by Antony Addy
          </a>{" "}
          — free tools for grammar, listening, speaking and exam prep, built by a certified trainer.
        </p>
      </div>
    </footer>
  );
}

export function PublicPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to content
      </a>
      <header className="px-6 md:px-10 py-5 flex items-center justify-between">
        <nav aria-label="Main" className="flex items-center justify-between w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">CLOE Prep</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                Get started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content" className="flex-1 px-6 md:px-10 py-10 md:py-16">
        <div className="max-w-3xl mx-auto w-full">{children}</div>
      </main>

      <PublicFooter />
    </div>
  );
}
