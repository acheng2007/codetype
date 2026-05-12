// Tiny smoke test for the engine. Run with: node scripts/test-engine.mjs
// Compiles src/lib/engine.ts on the fly via tsx is not required; we use a
// minimal hand-port of the public behavior assertions by importing the
// compiled output. To keep this lightweight, we instead just shell-call
// `npx tsx`. Falls back to a friendly message if tsx is not installed.

import { spawnSync } from "node:child_process";

const r = spawnSync(
  "npx",
  ["--yes", "tsx", "scripts/test-engine.inline.ts"],
  { stdio: "inherit" },
);
process.exit(r.status ?? 1);
