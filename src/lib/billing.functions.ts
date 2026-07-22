import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { resolvePlan, type SubscriptionRow } from "@/lib/entitlements";

/**
 * Stripe is called over REST (no SDK dependency). All of this is dormant
 * until STRIPE_SECRET_KEY / STRIPE_PRICE_PRO are set in the environment —
 * nothing in the current UI calls createCheckoutSession yet.
 */

const STRIPE_API = "https://api.stripe.com/v1";

function stripeKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("BILLING_NOT_CONFIGURED");
  return key;
}

async function stripePost(path: string, params: Record<string, string>): Promise<unknown> {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params),
  });
  const json = (await res.json()) as { error?: { message?: string } };
  if (!res.ok) throw new Error(json.error?.message ?? `Stripe error (${res.status})`);
  return json;
}

export const getSubscription = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("subscriptions")
      .select("plan, status, current_period_end")
      .eq("user_id", context.userId)
      .maybeSingle();
    const sub = (data ?? null) as SubscriptionRow | null;
    return { subscription: sub, plan: resolvePlan(sub) };
  });

const CheckoutInput = z.object({
  success_url: z.string().url(),
  cancel_url: z.string().url(),
});

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => CheckoutInput.parse(d))
  .handler(async ({ data, context }) => {
    const price = process.env.STRIPE_PRICE_PRO;
    if (!price) throw new Error("BILLING_NOT_CONFIGURED");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", context.userId)
      .maybeSingle();

    let customerId = existing?.stripe_customer_id ?? null;
    if (!customerId) {
      const email = typeof context.claims.email === "string" ? context.claims.email : "";
      const customer = (await stripePost("/customers", {
        ...(email ? { email } : {}),
        "metadata[supabase_user_id]": context.userId,
      })) as { id: string };
      customerId = customer.id;
      await supabaseAdmin.from("subscriptions").upsert(
        {
          user_id: context.userId,
          stripe_customer_id: customerId,
        },
        { onConflict: "user_id" },
      );
    }

    const session = (await stripePost("/checkout/sessions", {
      mode: "subscription",
      customer: customerId,
      "line_items[0][price]": price,
      "line_items[0][quantity]": "1",
      success_url: data.success_url,
      cancel_url: data.cancel_url,
      "subscription_data[metadata][supabase_user_id]": context.userId,
    })) as { url: string };

    return { url: session.url };
  });
