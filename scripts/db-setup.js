#!/usr/bin/env node
/* eslint-disable no-console */
// Runs at Vercel build time BEFORE `next build`.
// - If DATABASE_URL is absent → skip entirely (site builds as a static/info portal).
// - If present → apply Prisma migrations (must succeed) then seed students (best-effort).
// Keeps production safe: a seed hiccup never blocks the deploy, and no DB → no-op.
const { execSync } = require("node:child_process");

const url = process.env.DATABASE_URL;
if (!url) {
  console.log("[db-setup] DATABASE_URL not set — skipping migrate/seed (informational build).");
  process.exit(0);
}

function run(cmd) {
  console.log(`[db-setup] $ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

try {
  run("prisma migrate deploy");
} catch (e) {
  console.error("[db-setup] migrate deploy FAILED — aborting build to avoid a broken schema.");
  process.exit(1);
}

try {
  run("tsx prisma/seed.ts");
  console.log("[db-setup] seed complete.");
} catch (e) {
  // Idempotent seed; a transient failure shouldn't break an otherwise-good deploy.
  console.warn("[db-setup] seed step failed (non-fatal) — continuing build.");
}
