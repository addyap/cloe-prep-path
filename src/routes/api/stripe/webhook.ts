import { createFileRoute } from "@tanstack/react-router";

/**
 * Stripe webhook receiver. Dormant until STRIPE_WEBHOOK_SECRET is set —
 * returns 503 so Stripe retries are meaningful once configured.
 * Handles subscription lifecycle events and mirrors them into
 * public.subscriptions (service role — RLS allows no client writes).
 */

const TOLERANCE_SECONDS = 300;

async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string,
): Promise<boolean> {
  const parts = new Map(
    sigHeader.split(",").map((kv) => {
      const [k, ...v] = kv.split("=");
      return [k.trim(), v.join("=")] as const;
    }),
  );
  const timestamp = parts.get("t");
  const signature = parts.get("v1");
  if (!timestamp || !signature) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${payload}`));
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

type StripeSubscription = {
  id: string;
  customer: string;
  status: string;
  current_period_end: number;
  metadata?: Record<string, string>;
};

const STATUS_MAP: Record<string, "active" | "trialing" | "past_due" | "canceled" | "incomplete"> = {
  active: "active",
  trialing: "trialing",
  past_due: "past_due",
  canceled: "canceled",
  unpaid: "canceled",
  incomplete: "incomplete",
  incomplete_expired: "canceled",
  paused: "canceled",
};

export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!secret) {
          return new Response(JSON.stringify({ error: "Billing not configured" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          });
        }

        const payload = await request.text();
        const sigHeader = request.headers.get("stripe-signature") ?? "";
        if (!(await verifyStripeSignature(payload, sigHeader, secret))) {
          return new Response(JSON.stringify({ error: "Invalid signature" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const event = JSON.parse(payload) as { type: string; data: { object: unknown } };

        if (
          event.type === "customer.subscription.created" ||
          event.type === "customer.subscription.updated" ||
          event.type === "customer.subscription.deleted"
        ) {
          const sub = event.data.object as StripeSubscription;
          const userId = sub.metadata?.supabase_user_id;
          const status = STATUS_MAP[sub.status] ?? "canceled";
          const deleted = event.type === "customer.subscription.deleted";

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          if (userId) {
            await supabaseAdmin.from("subscriptions").upsert(
              {
                user_id: userId,
                plan: deleted || status === "canceled" ? "free" : "pro",
                status: deleted ? "canceled" : status,
                stripe_customer_id: sub.customer,
                stripe_subscription_id: sub.id,
                current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
                updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id" },
            );
          } else {
            // Fall back to matching by customer id (customer created before metadata existed)
            await supabaseAdmin
              .from("subscriptions")
              .update({
                plan: deleted || status === "canceled" ? "free" : "pro",
                status: deleted ? "canceled" : status,
                stripe_subscription_id: sub.id,
                current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq("stripe_customer_id", sub.customer);
          }
        }

        return Response.json({ received: true });
      },
    },
  },
});
