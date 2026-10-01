/**
 * UI boundary check — enforces the 4-layer token system:
 *
 *   primitive tokens (globals.css :root)
 *     → semantic tokens (@theme inline)
 *       → component ui (src/components/ui/** — the ONLY place
 *          Tailwind classes may appear)
 *         → feature code (pages/atoms/molecules/organisms/templates
 *            + data/lib) must compose ui components only.
 *
 * Fails if any file outside src/components/ui/** contains:
 *   - className=            (Tailwind attachment point, incl. lucide icons)
 *   - cn( / clsx( / twMerge( (class composition helpers)
 *   - @/lib/utils import    (only ui may compose classes)
 *   - style=                (inline-style escape hatch)
 *   - bg-|text-|border-... class-like literals in data/lib
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "src");

const UI_DIR = join(SRC, "components", "ui");

function walk(dir) {
  const out = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(tsx|ts|mjs|js)$/.test(f)) out.push(p);
  }
  return out;
}

const violations = [];

for (const file of walk(SRC)) {
  const rel = relative(ROOT, file);
  const insideUi = file.startsWith(UI_DIR + "/");
  // src/lib/utils.ts only *defines* cn — it attaches no classes itself.
  if (insideUi || rel === "src/lib/utils.ts") continue;
  const src = readFileSync(file, "utf8");

  const checks = [
    ["className=", /className\s*=/],
    ["cn(/clsx(/twMerge(", /\b(cn|clsx|twMerge)\s*\(/],
    ['@/lib/utils import', /from\s+["']@\/lib\/utils["']/],
    ["style=", /\bstyle\s*=\s*\{/],
  ];

  for (const [label, re] of checks) {
    if (re.test(src)) violations.push(`${rel}  →  forbidden ${label} outside src/components/ui/**`);
  }

  // data + lib must not smuggle Tailwind-looking literals either
  if (/(^|\/)src\/(data|lib)\//.test(rel)) {
    const m = src.match(/["'`](bg-|text-|border|rounded|shadow)-[^"'`]*["'`]/);
    if (m) violations.push(`${rel}  →  Tailwind-looking literal ${m[0]} in data/lib layer`);
  }
}

if (violations.length) {
  console.error(`UI boundary violated (${violations.length}):\n- ${violations.join("\n- ")}`);
  process.exit(1);
}
console.log("UI boundary clean: feature layers use component-ui only.");
