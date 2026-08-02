import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

/**
 * Shown on features that PLAN_FEATURES (src/lib/entitlements.ts) marks as
 * "pro" — writing, speaking, mock exam. ENFORCE_ENTITLEMENTS is off, so
 * everyone gets these for free right now; this badge is the only thing
 * telling users that's temporary, since nothing else in the authenticated
 * app references entitlements at all.
 */
export function ProFreeBadge() {
  return (
    <Link
      to="/pricing"
      className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-semibold hover:bg-accent/20 transition-colors"
    >
      <Sparkles className="h-3 w-3" />
      Pro feature — free while we're in beta
    </Link>
  );
}
