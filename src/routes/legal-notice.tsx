import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/legal-notice")({
  beforeLoad: () => {
    throw redirect({ to: "/mentions-legales", statusCode: 301 });
  },
});
