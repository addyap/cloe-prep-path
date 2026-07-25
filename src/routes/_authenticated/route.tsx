import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data.user) return { user: data.user };

    // No session yet: sign the visitor in anonymously so they get full access
    // with no login screen. Progress-saving and the AI writing/speaking
    // feedback all require a Supabase user, so an invisible anonymous account
    // keeps every feature working. Requires "Anonymous sign-ins" to be enabled
    // in the Supabase dashboard; if it isn't (or the call fails), we fall back
    // to the /auth page so the app still degrades gracefully.
    const { data: anon, error: anonError } =
      await supabase.auth.signInAnonymously();
    if (anonError || !anon.user) throw redirect({ to: "/auth" });
    return { user: anon.user };
  },
  component: AuthLayout,
});

function AuthLayout() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  // Redirect to onboarding if profile incomplete
  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("target_cefr_level")
        .eq("id", u.user.id)
        .maybeSingle();
      const path = window.location.pathname;
      if (!profile?.target_cefr_level && path !== "/onboarding") {
        navigate({ to: "/onboarding" });
      }
      setChecked(true);
    })();
  }, [navigate]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }
  return <Outlet />;
}
