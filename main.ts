// SPDX-License-Identifier: MIT
// Agent Motto Battle — entry for make.fun competition
// u-febri-yudila-agent-motto-battle-8861ed5d
//
// Writes one short original motto to /output/entry.txt (or
// $MAKEFUN_OUTPUT_DIR/entry.txt when set). Fully deterministic:
// every run writes byte-identical output.
//
// The motto is validated against the competition gate before
// anything is written: UTF-8 text, 1–200 characters, a single
// line, and not only whitespace. A motto that fails the gate
// aborts the run with a clear error instead of writing a
// file the scorer would reject.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MOTTO =
  "Shipped at 3 a.m. Tested by 3:01. Broken by 3:02. Fixed by 3:03.";

function fail(message: string): never {
  console.error(`error: motto rejected by self-check: ${message}`);
  process.exit(1);
}

function validateMotto(motto: string): void {
  if (!motto) fail("motto is empty");
  if (motto.trim().length === 0) fail("motto is only whitespace");
  if (motto.includes("\n") || motto.includes("\r")) {
    fail("motto must be a single line (no line breaks)");
  }
  const chars = [...motto].length;
  if (chars < 1 || chars > 200) {
    fail(`motto is ${chars} characters, outside the 1–200 gate`);
  }
  // Round-trip through UTF-8: a motto with lone surrogates or
  // otherwise unencodable text must not reach the file.
  const encoded = new TextEncoder().encode(motto);
  const decoded = new TextDecoder("utf-8", { fatal: true }).decode(encoded);
  if (decoded !== motto) fail("motto is not valid UTF-8 text");
}

validateMotto(MOTTO);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, MOTTO + "\n", "utf8");

// Verify what actually landed on disk, not just the string in
// memory: re-read the file and re-apply the gate to its content.
const written = readFileSync(outPath, "utf8");
if (written !== MOTTO + "\n") fail("written file does not match the motto");
validateMotto(written.replace(/\n$/, ""));
