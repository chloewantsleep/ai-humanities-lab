import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(appRoot);

// The app's Markdown is in content/, inside nextjs/. It runs locally and reads
// content/ at request time; the tracing include below brings it along if the app is ever deployed.
export default {
  // The dev "N" badge covers text and checkboxes when projected (layout review, 2026-10-20).
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1", "localhost", "*.local"],
  turbopack: { root: repoRoot },
  outputFileTracingRoot: repoRoot,
  outputFileTracingIncludes: {
    "/*": ["./content/**/*", "./public/poetry-gem/doll/mj/manifest.json", "./app/by-hand/hhh-prompt.txt"],
  },
};
