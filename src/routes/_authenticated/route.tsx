import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { db } from "@/lib/local-db";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    // Each browser is one learner; there's no sign-in (see src/lib/local-db.ts).
    const { data } = await db.auth.getUser();
    const user = data.user!;

    if (location.pathname !== "/onboarding") {
      const { data: profile } = await db
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
