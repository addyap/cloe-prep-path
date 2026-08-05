import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    let user = !error && data.user ? data.user : null;

    if (!user) {
      const { data: anon, error: anonError } = await supabase.auth.signInAnonymously();
      if (anonError || !anon.user) throw redirect({ to: "/auth" });
      user = anon.user;
    }

    if (location.pathname !== "/onboarding") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("target_cefr_level")
        .eq("id", user.id)
        .maybeSingle();
      if (!profile?.target_cefr_level) throw redirect({ to: "/onboarding" });
    }

    return { user };
  },
  component: () => <Outlet />,
});
