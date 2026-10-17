import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { currentNonce } from "./lib/csp";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Server: this request's CSP nonce, stamped on every inline SSR script.
    ssr: { nonce: currentNonce() },
  });

  return router;
};
