import { copyFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

// Serve the runtime shipped with the installed Transformers version from our
// own origin, rather than importing executable code from a third-party CDN.
const require = createRequire(import.meta.url);
const kokoroRequire = createRequire(require.resolve("kokoro-js"));
const dist = dirname(kokoroRequire.resolve("@huggingface/transformers"));
const destination = new URL("../public/kokoro-runtime/", import.meta.url);
await mkdir(destination, { recursive: true });
for (const file of ["ort-wasm-simd-threaded.jsep.mjs", "ort-wasm-simd-threaded.jsep.wasm"]) {
  await copyFile(join(dist, file), new URL(file, destination));
}
