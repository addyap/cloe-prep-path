import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const FOOTER_LINKS = [
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
  { to: "/refund-policy", label: "Refund Policy" },
] as const;

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
              className="hover:text-foreground underline-offset-2 hover:underline"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <p>© {new Date().getFullYear()} CLOE Prep.</p>
      </div>
    </footer>
  );
}

export function PublicPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="px-6 md:px-10 py-5 flex items-center justify-between">
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
      </header>

      <main className="flex-1 px-6 md:px-10 py-10 md:py-16">
        <div className="max-w-3xl mx-auto w-full">{children}</div>
      </main>

      <PublicFooter />
    </div>
  );
}
