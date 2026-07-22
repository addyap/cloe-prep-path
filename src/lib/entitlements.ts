/**
 * Feature entitlements. ENFORCE_ENTITLEMENTS is the master switch:
 * while false, every user gets the full "pro" feature set regardless of their
 * subscription row, so the app behaves exactly as it did before billing
 * existed. Flip to true (and set the Stripe env vars) to start gating.
 */
export const ENFORCE_ENTITLEMENTS = false;

export type Plan = "free" | "pro";

export type Feature =
  | "practice.listening"
  | "practice.reading"
  | "practice.grammar_vocab"
  | "practice.writing"
  | "practice.speaking"
  | "mock_exam"
  | "ai_writing_feedback"
  | "ai_speaking_feedback"
  | "progress_history";

const PLAN_FEATURES: Record<Plan, ReadonlySet<Feature>> = {
  free: new Set<Feature>([
    "practice.listening",
    "practice.reading",
    "practice.grammar_vocab",
    "progress_history",
  ]),
  pro: new Set<Feature>([
    "practice.listening",
    "practice.reading",
    "practice.grammar_vocab",
    "practice.writing",
    "practice.speaking",
    "mock_exam",
    "ai_writing_feedback",
    "ai_speaking_feedback",
    "progress_history",
  ]),
};

export type SubscriptionRow = {
  plan: Plan;
  status: "active" | "trialing" | "past_due" | "canceled" | "incomplete";
  current_period_end: string | null;
};

/** Resolve the effective plan from a subscription row (or its absence). */
export function resolvePlan(sub: SubscriptionRow | null | undefined): Plan {
  if (!ENFORCE_ENTITLEMENTS) return "pro";
  if (!sub) return "free";
  const usable = sub.status === "active" || sub.status === "trialing" || sub.status === "past_due";
  if (!usable) return "free";
  if (sub.current_period_end && new Date(sub.current_period_end).getTime() < Date.now()) {
    return "free";
  }
  return sub.plan;
}

export function hasFeature(plan: Plan, feature: Feature): boolean {
  return PLAN_FEATURES[plan].has(feature);
}
