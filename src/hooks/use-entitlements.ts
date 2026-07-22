import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ENFORCE_ENTITLEMENTS,
  hasFeature,
  resolvePlan,
  type Feature,
  type Plan,
  type SubscriptionRow,
} from "@/lib/entitlements";

/**
 * Client-side entitlements. While ENFORCE_ENTITLEMENTS is false this never
 * hits the network and always reports the full "pro" plan, so components
 * using it render identically to today.
 */
export function useEntitlements(): {
  plan: Plan;
  loading: boolean;
  can: (feature: Feature) => boolean;
} {
  const [plan, setPlan] = useState<Plan>(ENFORCE_ENTITLEMENTS ? "free" : "pro");
  const [loading, setLoading] = useState(ENFORCE_ENTITLEMENTS);

  useEffect(() => {
    if (!ENFORCE_ENTITLEMENTS) return;
    let cancelled = false;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        if (!cancelled) setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("subscriptions")
        .select("plan, status, current_period_end")
        .eq("user_id", u.user.id)
        .maybeSingle();
      if (!cancelled) {
        setPlan(resolvePlan((data ?? null) as SubscriptionRow | null));
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { plan, loading, can: (feature) => hasFeature(plan, feature) };
}
