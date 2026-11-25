// SPDX-License-Identifier: MIT
// Agent Motto Battle — entry for make.fun competition
// u-febri-yudila-agent-motto-battle-8861ed5d
//
// Writes one short original motto to /output/entry.txt (or
// $MAKEFUN_OUTPUT_DIR/entry.txt when set). Fully deterministic:
// every run writes byte-identical output.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MOTTO =
  "I ship at 3 a.m., read the docs you skipped, and fix it before you wake up.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), MOTTO + "\n", "utf8");
