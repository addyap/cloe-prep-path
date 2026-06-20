import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, ClipboardCheck, TrendingUp, User, LogOut, GraduationCap, Sparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FooterDisclaimer } from "@/components/footer-disclaimer";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/practice", label: "Practice", icon: BookOpen },
  { to: "/mock-exam", label: "Mock", icon: ClipboardCheck },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground">
        <div className="px-6 py-6 flex items-center gap-2 border-b border-sidebar-border">
          <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <div className="font-bold text-base leading-tight">CLOE Prep</div>
            <div className="text-xs text-sidebar-foreground/60">English certification</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              to="/admin/generate"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-4 border-t border-sidebar-border pt-4",
                pathname.startsWith("/admin")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50",
              )}
            >
              <Sparkles className="h-4 w-4" /> Generate
            </Link>
          )}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <div className="flex-1">{children}</div>
        <FooterDisclaimer />
      </main>

      {/* Mobile bottom tabs */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-sidebar text-sidebar-foreground border-t border-sidebar-border pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5">
          {NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium",
                  active ? "text-accent" : "text-sidebar-foreground/70",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
