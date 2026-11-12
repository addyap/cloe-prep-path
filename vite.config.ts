import { defineConfig } from "vite";
import { readFile } from "node:fs/promises";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig(async ({ command }) => {
  const plugins = [
    {
      name: "kokoro-runtime-dev",
      configureServer(server: import("vite").ViteDevServer) {
        server.middlewares.use((request, response, next) => {
          const path = request.url?.split("?")[0];
          const name = path?.replace(/^\/kokoro-runtime\//, "");
          if (
            !path?.startsWith("/kokoro-runtime/") ||
            !["ort-wasm-simd-threaded.jsep.mjs", "ort-wasm-simd-threaded.jsep.wasm"].includes(name!)
          )
            return next();
          // Runtime dynamic imports can carry Vite's ?import suffix. Serve the
          // prebuilt module unchanged before Vite's source transformer sees it.
          void readFile(new URL(`./public/kokoro-runtime/${name}`, import.meta.url)).then(
            (bytes) => {
              response.setHeader(
                "Content-Type",
                name!.endsWith(".wasm") ? "application/wasm" : "text/javascript",
              );
              response.end(bytes);
            },
            next,
          );
        });
      },
    },
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      // TanStack Start's bundled server entry is redirected to src/server.ts (our SSR error wrapper).
      server: { entry: "server" },
    }),
    viteReact(),
  ];

  if (command === "build") {
    const { nitro } = await import("nitro/vite");
    plugins.push(
      nitro({
        preset: "vercel",
        vercel: { functions: { maxDuration: 300 } },
      }),
    );
  }

  return {
    worker: { format: "es" as const },
    resolve: {
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
    server: { host: "::", port: 8080 },
    plugins,
  };
});
