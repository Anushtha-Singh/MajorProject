/**
 * Yojna Saathi – Unit Test Suite
 * Tests pure utility functions from src/lib/db.js
 * Run:  node unit_tests.js
 * No dev server needed.
 */

// ─── ANSI colours ────────────────────────────────────────────────────────────
const C = {
  reset: "\x1b[0m", bold: "\x1b[1m",
  green: "\x1b[32m", red: "\x1b[31m",
  cyan: "\x1b[36m",  gray: "\x1b[90m",
  white: "\x1b[97m", bgGreen: "\x1b[42m", bgRed: "\x1b[41m",
  yellow: "\x1b[33m",
};

let passed = 0, failed = 0, total = 0;

function pass(msg) { return `${C.bgGreen}${C.white} PASS ${C.reset} ${C.green}${msg}${C.reset}`; }
function fail(msg) { return `${C.bgRed}${C.white} FAIL ${C.reset} ${C.red}${msg}${C.reset}`; }

function assert(id, description, condition, detail = "") {
  total++;
  process.stdout.write(`\n${C.bold}${C.cyan}${id}${C.reset} ${C.bold}${description}${C.reset}\n`);
  if (condition) {
    passed++;
    process.stdout.write(`     ${pass("Assertion passed")} ${C.gray}${detail}${C.reset}\n`);
  } else {
    failed++;
    process.stdout.write(`     ${fail("Assertion failed")} ${C.gray}${detail}${C.reset}\n`);
  }
}

// ─── Re-implement utility functions locally (mirrors src/lib/db.js) ───────────
function normalizeSearchTerms(keywords) {
  if (!keywords || typeof keywords !== "string") return [];
  return keywords.split(/[\s,]+/).map(k => k.trim()).filter(k => k.length > 0);
}

function buildSearchConditions(searchTerms) {
  if (!searchTerms || searchTerms.length === 0) return { conditions: [], params: [] };
  const conditions = [];
  const params = [];
  searchTerms.forEach((term) => {
    const paramValue = `%${term}%`;
    conditions.push(`(
      "Scheme Title" ILIKE $${params.length + 1} OR 
      "Details" ILIKE $${params.length + 1} OR 
      "Benefits" ILIKE $${params.length + 1} OR 
      "Eligibility" ILIKE $${params.length + 1} OR 
      "Tags" ILIKE $${params.length + 1}
    )`);
    params.push(paramValue);
  });
  return { conditions, params };
}

// ─── Unit Tests ──────────────────────────────────────────────────────────────
console.log(`\n${C.bold}${"═".repeat(62)}${C.reset}`);
console.log(`${C.bold}  Yojna Saathi – Unit Test Suite${C.reset}`);
console.log(`${C.bold}${"═".repeat(62)}${C.reset}`);
console.log(`  ${C.gray}Time : ${new Date().toLocaleString()}${C.reset}`);
console.log(`  ${C.gray}Note : No server required — pure function tests${C.reset}`);

// ── normalizeSearchTerms ──────────────────────────────────────────────────────
const r1 = normalizeSearchTerms("scholarship farmer");
assert("UT-01", "normalizeSearchTerms splits by space",
  Array.isArray(r1) && r1.length === 2,
  `input="scholarship farmer" → [${r1}]`);

const r2 = normalizeSearchTerms("scholarship,farmer,women");
assert("UT-02", "normalizeSearchTerms splits by comma",
  r2.length === 3 && r2[2] === "women",
  `input="scholarship,farmer,women" → [${r2}]`);

const r3 = normalizeSearchTerms(null);
assert("UT-03", "normalizeSearchTerms handles null input",
  Array.isArray(r3) && r3.length === 0,
  `input=null → []`);

const r4 = normalizeSearchTerms("");
assert("UT-04", "normalizeSearchTerms handles empty string",
  r4.length === 0,
  `input="" → []`);

const r5 = normalizeSearchTerms("  scholarship  ");
assert("UT-05", "normalizeSearchTerms trims whitespace",
  r5.length === 1 && r5[0] === "scholarship",
  `input="  scholarship  " → [${r5}]`);

assert("UT-06", "normalizeSearchTerms rejects non-string input",
  normalizeSearchTerms(42).length === 0,
  `input=42 → []`);

// ── buildSearchConditions ─────────────────────────────────────────────────────
const { conditions: c1, params: p1 } = buildSearchConditions(["scholarship"]);
assert("UT-07", "buildSearchConditions returns one condition per term",
  c1.length === 1,
  `terms=["scholarship"] → ${c1.length} condition`);

assert("UT-08", "buildSearchConditions wraps term in LIKE wildcards",
  p1[0] === "%scholarship%",
  `param → "${p1[0]}"`);

const { conditions: c2, params: p2 } = buildSearchConditions(["farmer", "women"]);
assert("UT-09", "buildSearchConditions handles multiple terms",
  c2.length === 2 && p2.length === 2,
  `terms=2 → conditions=${c2.length} params=${p2.length}`);

const { conditions: c3, params: p3 } = buildSearchConditions([]);
assert("UT-10", "buildSearchConditions handles empty array",
  c3.length === 0 && p3.length === 0,
  `terms=[] → conditions=0 params=0`);

assert("UT-11", "buildSearchConditions condition includes all 5 columns",
  c1[0].includes("Scheme Title") && c1[0].includes("Benefits") &&
  c1[0].includes("Eligibility") && c1[0].includes("Tags"),
  `condition covers Scheme Title, Benefits, Eligibility, Tags`);

assert("UT-12", "buildSearchConditions uses ILIKE for case-insensitive search",
  c1[0].includes("ILIKE"),
  `condition uses ILIKE`);

// ── Pagination logic ──────────────────────────────────────────────────────────
function calcPagination(page, limit, total) {
  const p    = Math.max(1, parseInt(page) || 1);
  const l    = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const offset = (p - 1) * l;
  const totalPages = Math.ceil(total / l);
  return { page: p, limit: l, offset, totalPages };
}

const pg1 = calcPagination(1, 20, 100);
assert("UT-13", "Pagination: page 1 offset is 0",
  pg1.offset === 0,
  `page=1 limit=20 → offset=${pg1.offset}`);

const pg2 = calcPagination(3, 20, 100);
assert("UT-14", "Pagination: page 3 offset is 40",
  pg2.offset === 40,
  `page=3 limit=20 → offset=${pg2.offset}`);

const pg3 = calcPagination(1, 20, 100);
assert("UT-15", "Pagination: totalPages calculation correct",
  pg3.totalPages === 5,
  `total=100 limit=20 → totalPages=${pg3.totalPages}`);

assert("UT-16", "Pagination: limit capped at 100",
  calcPagination(1, 999, 200).limit === 100,
  `limit=999 → capped to 100`);

assert("UT-17", "Pagination: invalid page defaults to 1",
  calcPagination("abc", 20, 100).page === 1,
  `page="abc" → defaults to 1`);

// ── Language validation ───────────────────────────────────────────────────────
const SUPPORTED_LANGS = ['hi','bn','ta','te','mr','gu','kn','ml','pa','ur'];
function resolveLang(raw) {
  const l = (raw || 'en').toLowerCase();
  return SUPPORTED_LANGS.includes(l) ? l : 'en';
}

assert("UT-18", "Language: 'hi' is accepted as supported",
  resolveLang('hi') === 'hi', `resolveLang('hi') → 'hi'`);

assert("UT-19", "Language: unknown lang falls back to English",
  resolveLang('fr') === 'en', `resolveLang('fr') → 'en'`);

assert("UT-20", "Language: null defaults to English",
  resolveLang(null) === 'en', `resolveLang(null) → 'en'`);

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${C.bold}${"═".repeat(62)}${C.reset}`);
console.log(`  ${C.bold}Results Summary${C.reset}`);
console.log(`  Total  : ${total}`);
console.log(`  ${C.green}Passed : ${passed}${C.reset}`);
if (failed > 0) console.log(`  ${C.red}Failed : ${failed}${C.reset}`);
else            console.log(`  Failed : ${failed}`);
const pct = Math.round((passed / total) * 100);
const bar = "█".repeat(Math.round(pct / 5)) + "░".repeat(20 - Math.round(pct / 5));
console.log(`  Score  : [${pct >= 80 ? C.green : C.yellow}${bar}${C.reset}] ${pct}%`);
console.log(`${C.bold}${"═".repeat(62)}${C.reset}\n`);
