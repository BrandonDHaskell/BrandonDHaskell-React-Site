#!/usr/bin/env node
/**
 * resume-report.js
 * Fill report + linter for the resume master data set.
 *
 * Usage:  node resume-report.js path/to/resume-data.json [--role <tag>]
 *
 * Reports, per role selection (and "everything"):
 *   - estimated lines used vs the two-page budget
 *   - which bullets / highlights were included vs cut
 *   - which experience entries are thin for that role
 * Lints:
 *   - duplicate top-level JSON keys
 *   - tags that don't exist in roles[]
 *   - bullets tagged for a role but missing a weight for it (and vice versa)
 *   - overlapping experience date ranges
 *   - em dashes in any text content
 *
 * Calibrate the constants below against a real PDF export once
 * (see CHARS_PER_LINE / LINES_BUDGET), then trust the cheap report.
 */

const fs = require("fs");

/* ---------------- calibration constants ---------------- */
const CHARS_PER_LINE = 95;   // avg chars per rendered line at resume body size
const LINES_BUDGET = 96;     // usable content lines across 2 pages
const FIXED_OVERHEAD = 18;   // header, summary block, section titles, edu (lines)
const DEFAULT_WEIGHT_UNTAGGED = 5; // bullets with no tags always render high
const DEFAULT_WEIGHT_OFFROLE = 2;  // tagged bullets without this role's tag
const HEADER_LINES_PER_ENTRY = 1;  // company/title/date line
/* -------------------------------------------------------- */

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith("--"));
if (!file) {
  console.error("Usage: node resume-report.js <resume-data.json> [--role <tag>]");
  process.exit(1);
}
const onlyRole = args.includes("--role") ? args[args.indexOf("--role") + 1] : null;

const raw = fs.readFileSync(file, "utf8");
let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.error("JSON parse error:", e.message);
  process.exit(1);
}

const roleTags = (data.roles || []).map(r => r.tag);
const problems = [];
const warnings = [];

/* ===================== LINT ===================== */

// 1. Duplicate top-level keys (JSON.parse silently keeps the last one)
{
  const topKeys = [];
  let depth = 0, inStr = false, esc = false, keyStart = -1;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') {
        inStr = false;
        if (depth === 1 && keyStart >= 0) {
          // lookahead for ':' to confirm it's a key
          let j = i + 1;
          while (j < raw.length && /\s/.test(raw[j])) j++;
          if (raw[j] === ":") topKeys.push(raw.slice(keyStart, i));
          keyStart = -1;
        }
      }
      continue;
    }
    if (c === '"') { inStr = true; if (depth === 1) keyStart = i + 1; }
    else if (c === "{" || c === "[") depth++;
    else if (c === "}" || c === "]") depth--;
  }
  const seen = new Set();
  for (const k of topKeys) {
    if (seen.has(k)) problems.push(`Duplicate top-level key "${k}" - the later block silently overrides the earlier one.`);
    seen.add(k);
  }
}

// 2 & 3. Tag and weight validation + em dash check
function checkText(text, where) {
  if (typeof text === "string" && text.includes("\u2014"))
    warnings.push(`Em dash found in ${where}`);
}
function checkTagged(item, where) {
  for (const t of item.tags || []) {
    if (!roleTags.includes(t)) problems.push(`Unknown tag "${t}" in ${where}`);
  }
  if (item.weight) {
    for (const t of Object.keys(item.weight)) {
      if (!(item.tags || []).includes(t))
        warnings.push(`Weight for "${t}" in ${where} but tag is not listed`);
    }
    for (const t of item.tags || []) {
      if (!(t in item.weight))
        warnings.push(`Tag "${t}" in ${where} has no weight (will rank below weighted peers)`);
    }
  }
}

for (const [k, v] of Object.entries(data.profile?.summary || {})) checkText(v, `summary.${k}`);
for (const e of data.experience || []) {
  checkTagged(e, `${e.company} / ${e.title}`);
  for (const b of e.bullets || []) {
    checkTagged(b, `${e.company}: "${b.text.slice(0, 50)}..."`);
    checkText(b.text, `${e.company} bullet`);
  }
}
for (const p of data.projects || []) {
  checkTagged(p, `project ${p.name}`);
  checkText(p.description, `project ${p.name} description`);
  for (const h of p.highlights || []) {
    checkTagged(h, `project ${p.name} highlight`);
    checkText(h.text, `project ${p.name} highlight`);
  }
}
for (const s of data.skills || []) checkTagged(s, `skills category ${s.category}`);

// 4. Date overlap check
function parseDate(d, isEnd) {
  if (d == null) return isEnd ? Infinity : null;
  const m = String(d).match(/^(\d{4})(?:-(\d{2}))?$/);
  if (!m) { warnings.push(`Unparseable date "${d}"`); return null; }
  return parseInt(m[1]) * 12 + (m[2] ? parseInt(m[2]) - 1 : (isEnd ? 11 : 0));
}
{
  const spans = (data.experience || [])
    .map(e => ({ name: `${e.company} / ${e.title}`, s: parseDate(e.start, false), e: parseDate(e.end, true) }))
    .filter(x => x.s != null);
  for (let i = 0; i < spans.length; i++)
    for (let j = i + 1; j < spans.length; j++) {
      const a = spans[i], b = spans[j];
      const overlap = Math.min(a.e, b.e) - Math.max(a.s, b.s);
      if (overlap > 0)
        warnings.push(`Date overlap (${overlap} mo): "${a.name}" and "${b.name}"`);
    }
}

/* ===================== FILL REPORT ===================== */

const estLines = t => Math.max(1, Math.ceil((t || "").length / CHARS_PER_LINE));

function weightFor(item, role) {
  if (role === "everything") return { w: 10, rel: "on" };
  const tags = item.tags || [];
  if (tags.length === 0) return { w: DEFAULT_WEIGHT_UNTAGGED, rel: "neutral" };
  if (!tags.includes(role)) return { w: DEFAULT_WEIGHT_OFFROLE, rel: "backfill" };
  return { w: item.weight?.[role] ?? DEFAULT_WEIGHT_UNTAGGED, rel: "on" };
}

function report(role) {
  // Gather every variable-content item with its cost and weight
  const pool = [];
  for (const e of data.experience || [])
    for (const b of e.bullets || [])
      pool.push({ kind: "exp", owner: `${e.company} (${e.title})`, text: b.text, lines: estLines(b.text), ...weightFor(b, role) });
  for (const p of data.projects || []) {
    pool.push({ kind: "proj-desc", owner: p.name, text: p.description, lines: estLines(p.description), ...weightFor(p, role) });
    for (const h of p.highlights || [])
      pool.push({ kind: "proj-hl", owner: p.name, text: h.text, lines: estLines(h.text), ...weightFor(h, role) });
  }
  for (const s of data.skills || [])
    pool.push({ kind: "skills", owner: s.category, text: s.items.join(", "), lines: estLines(s.items.join(", ")) , ...weightFor(s, role) });

  const summaryText = data.profile?.summary?.[role] || data.profile?.summary?.default || "";
  const headerLines = (data.experience || []).length * HEADER_LINES_PER_ENTRY
    + (data.projects || []).length * HEADER_LINES_PER_ENTRY;
  const fixed = FIXED_OVERHEAD + estLines(summaryText) + headerLines;

  const budget = LINES_BUDGET - fixed;
  const ranked = [...pool].sort((a, z) => z.w - a.w);
  let used = 0;
  const included = [], cut = [];
  for (const item of ranked) {
    if (used + item.lines <= budget) { included.push(item); used += item.lines; }
    else cut.push(item);
  }

  const pct = Math.round(((used + fixed) / LINES_BUDGET) * 100);
  const slack = budget - used;

  // Relevance density: of the variable lines included, how many are
  // genuinely on-role (tagged for this role) vs off-role backfill?
  const onRole = included.filter(i => i.rel === "on");
  const neutral = included.filter(i => i.rel === "neutral");
  const backfill = included.filter(i => i.rel === "backfill");
  const sum = arr => arr.reduce((s, i) => s + i.lines, 0);
  const density = used > 0 ? Math.round((sum(onRole) / used) * 100) : 0;

  console.log(`\n${"=".repeat(70)}`);
  console.log(`ROLE: ${role}`);
  console.log(`Fill: ${used + fixed}/${LINES_BUDGET} lines (${pct}%)  |  Slack: ${slack}  |  Cut: ${cut.length}`);
  if (role !== "everything") {
    console.log(`Relevance: ${density}% on-role  (${sum(onRole)} on-role, ${sum(neutral)} neutral, ${sum(backfill)} backfill lines)`);
    if (density < 60)
      console.log(`>>> LOW DENSITY: this role's page is mostly backfill. Add role-tagged bullets.`);

    // Thin owners: entries with zero or one on-role bullet for this role
    const byOwner = {};
    for (const item of onRole.filter(i => i.kind === "exp"))
      byOwner[item.owner] = (byOwner[item.owner] || 0) + 1;
    const thin = [];
    for (const e of data.experience || []) {
      const key = `${e.company} (${e.title})`;
      const hasTagged = (e.bullets || []).some(b => (b.tags || []).includes(role));
      const n = byOwner[key] || 0;
      if ((e.bullets || []).some(b => (b.tags || []).length > 0) && n === 0 && !hasTagged)
        thin.push(key);
    }
    if (thin.length) {
      console.log(`Entries with NO on-role bullets (Fix 2 targets):`);
      for (const t of thin) console.log(`    - ${t}`);
    }
    if (backfill.length) {
      console.log(`Backfill currently padding this view (replace with on-role content):`);
      for (const b of backfill.slice(0, 5))
        console.log(`    [w=${b.w}] ${b.owner}: "${b.text.slice(0, 55)}..."`);
    }
  }
  if (cut.length > 0) {
    console.log(`Cut (lowest weight first):`);
    for (const c of cut.sort((a, z) => a.w - z.w).slice(0, 8))
      console.log(`    [w=${c.w}] ${c.owner}: "${c.text.slice(0, 55)}..."`);
  }
}

console.log(`Resume fill report - ${new Date().toISOString().slice(0, 10)}`);
console.log(`Budget: ${LINES_BUDGET} lines @ ~${CHARS_PER_LINE} chars/line (calibrate against a real export)`);

const rolesToReport = onlyRole ? [onlyRole] : ["everything", ...roleTags];
for (const r of rolesToReport) report(r);

/* ===================== LINT OUTPUT ===================== */
console.log(`\n${"=".repeat(70)}\nLINT`);
if (problems.length === 0 && warnings.length === 0) console.log("Clean: no problems found.");
for (const p of problems) console.log(`  ERROR   ${p}`);
for (const w of warnings) console.log(`  warning ${w}`);
process.exit(problems.length > 0 ? 1 : 0);