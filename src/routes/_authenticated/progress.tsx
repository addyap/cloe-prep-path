import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CefrProgress, type CefrLevel } from "@/components/cefr-progress";

export const Route = createFileRoute("/_authenticated/progress")({ component: ProgressPage });

function ProgressPage() {
  const [current, setCurrent] = useState<CefrLevel | null>(null);
  const [target, setTarget] = useState<CefrLevel | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase.from("profiles").select("current_estimated_level, target_cefr_level").eq("id", u.user.id).maybeSingle();
      setCurrent((data?.current_estimated_level as CefrLevel) ?? null);
      setTarget((data?.target_cefr_level as CefrLevel) ?? null);
    })();
  }, []);

  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your CEFR level over time.</p>
        <div className="mt-6 rounded-3xl bg-card border border-border p-6 md:p-8 shadow-card">
          <div className="text-sm font-semibold text-muted-foreground">Current estimated level</div>
          <div className="mt-1 text-4xl font-extrabold text-primary">{current ?? "—"}</div>
          <CefrProgress current={current} target={target} className="mt-4" />
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Detailed per-skill analytics will appear here once you complete practice sessions.
        </p>
      </div>
    </AppShell>
  );
}
