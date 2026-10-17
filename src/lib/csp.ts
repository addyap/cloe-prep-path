// Content-Security-Policy for server-rendered pages, sent by src/server.ts
// with a fresh nonce per request. TanStack Start's SSR inline scripts
// ($_TSR dehydration, scroll restoration, stream boundaries) carry that
// nonce through the router's `ssr.nonce` option (see src/router.tsx).
//
// 'unsafe-inline' is only a fallback for browsers without nonce support:
// any browser that understands nonces ignores it.

type NonceStore = { getStore(): string | undefined };

const STORE_KEY = "__cloeCspNonceStore";

/** Called once by the server entry with its per-request AsyncLocalStorage. */
export function registerNonceStore(store: NonceStore) {
  (globalThis as Record<string, unknown>)[STORE_KEY] = store;
}

/** The current request's nonce on the server; undefined in the browser. */
export function currentNonce(): string | undefined {
  return ((globalThis as Record<string, unknown>)[STORE_KEY] as NonceStore | undefined)?.getStore();
}

export function contentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://va.vercel-scripts.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://www.antonyaddy.com",
    "font-src 'self'",
    "media-src 'self' https://*.supabase.co data: blob:",
    "connect-src 'self' https://*.supabase.co https://va.vercel-scripts.com",
    "manifest-src 'self'",
    "worker-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}
