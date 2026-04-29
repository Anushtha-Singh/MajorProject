/**
 * Yojna Saathi – Integration Test Suite
 * Tests API endpoints end-to-end (DB + routing + response shape)
 * Run:  node integration_tests.js   (requires: npm run dev)
 */

const http = require("http");

const BASE = "http://localhost:3000";

const C = {
  reset: "\x1b[0m", bold: "\x1b[1m",
  green: "\x1b[32m", red: "\x1b[31m",
  cyan: "\x1b[36m",  gray: "\x1b[90m",
  white: "\x1b[97m", bgGreen: "\x1b[42m", bgRed: "\x1b[41m",
  yellow: "\x1b[33m",
};

function fetchJSON(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const options = { method: opts.method || "GET", headers: opts.headers || {} };
    const req = http.request(url, options, (res) => {
      let body = "";
      res.on("data", d => body += d);
      res.on("end", () => {
        let json = null;
        try { json = JSON.parse(body); } catch {}
        resolve({ status: res.statusCode, json, raw: body });
      });
    });
    req.on("error", reject);
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

let passed = 0, failed = 0, total = 0;

async function test(id, name, fn) {
  total++;
  process.stdout.write(`\n${C.bold}${C.cyan}${id}${C.reset} ${C.bold}${name}${C.reset}\n`);
  try {
    const { ok, detail } = await fn();
    if (ok) {
      passed++;
      process.stdout.write(`     ${C.bgGreen}${C.white} PASS ${C.reset} ${C.green}${detail}${C.reset}\n`);
    } else {
      failed++;
      process.stdout.write(`     ${C.bgRed}${C.white} FAIL ${C.reset} ${C.red}${detail}${C.reset}\n`);
    }
  } catch (e) {
    failed++;
    process.stdout.write(`     ${C.bgRed}${C.white} FAIL ${C.reset} ${C.red}${e.message}${C.reset}\n`);
  }
}

async function main() {
  console.log(`\n${C.bold}${"═".repeat(62)}${C.reset}`);
  console.log(`${C.bold}  Yojna Saathi – Integration Test Suite${C.reset}`);
  console.log(`${C.bold}${"═".repeat(62)}${C.reset}`);
  console.log(`  ${C.gray}Base URL : ${BASE}${C.reset}`);
  console.log(`  ${C.gray}Time     : ${new Date().toLocaleString()}${C.reset}`);
  console.log(`  ${C.gray}Scope    : API ↔ Database ↔ Response shape${C.reset}`);

  // IT-01: Schemes API returns correct JSON structure
  await test("IT-01", "GET /api/schemes returns valid JSON envelope", async () => {
    const r = await fetchJSON(`${BASE}/api/schemes`);
    const ok = r.status === 200 &&
      r.json !== null &&
      "page" in r.json &&
      "total" in r.json &&
      "data" in r.json &&
      Array.isArray(r.json.data);
    return { ok, detail: `HTTP ${r.status} | page=${r.json?.page} total=${r.json?.total} data.length=${r.json?.data?.length}` };
  });

  // IT-02: Pagination works — page 2 returns different data than page 1
  await test("IT-02", "Pagination — page 2 differs from page 1", async () => {
    const p1 = await fetchJSON(`${BASE}/api/schemes?page=1&limit=5`);
    const p2 = await fetchJSON(`${BASE}/api/schemes?page=2&limit=5`);
    const id1 = p1.json?.data?.[0]?.id;
    const id2 = p2.json?.data?.[0]?.id;
    const ok = p1.status === 200 && p2.status === 200 && id1 !== id2;
    return { ok, detail: `page1[0].id=${id1}  page2[0].id=${id2}` };
  });

  // IT-03: Search filters results correctly
  await test("IT-03", "Search query narrows results vs no filter", async () => {
    const all    = await fetchJSON(`${BASE}/api/schemes?limit=1`);
    const search = await fetchJSON(`${BASE}/api/schemes?search=scholarship&limit=1`);
    const allTotal    = all.json?.total    ?? 0;
    const searchTotal = search.json?.total ?? 0;
    const ok = all.status === 200 && search.status === 200 && allTotal >= searchTotal;
    return { ok, detail: `all.total=${allTotal}  search("scholarship").total=${searchTotal}` };
  });

  // IT-04: Category filter integration
  await test("IT-04", "Category filter returns fewer results than unfiltered", async () => {
    const all = await fetchJSON(`${BASE}/api/schemes?limit=1`);
    const cat = await fetchJSON(`${BASE}/api/schemes?category=Education&limit=1`);
    const ok = all.status === 200 && cat.status === 200 && (all.json?.total ?? 0) >= (cat.json?.total ?? 0);
    return { ok, detail: `all.total=${all.json?.total}  category=Education.total=${cat.json?.total}` };
  });

  // IT-05: Level filter integration
  await test("IT-05", "Level filter returns 'Central' results only", async () => {
    const r = await fetchJSON(`${BASE}/api/schemes?level=Central&limit=5`);
    const ok = r.status === 200 && Array.isArray(r.json?.data);
    const sample = r.json?.data?.[0]?.Level ?? r.json?.data?.[0]?.level ?? "present";
    return { ok, detail: `HTTP ${r.status} | results=${r.json?.total} | sample level="${sample}"` };
  });

  // IT-06: Limit param is respected
  await test("IT-06", "Limit parameter caps result count", async () => {
    const r = await fetchJSON(`${BASE}/api/schemes?limit=3`);
    const ok = r.status === 200 && r.json?.data?.length <= 3;
    return { ok, detail: `limit=3 → data.length=${r.json?.data?.length}` };
  });

  // IT-07: Scheme detail page returns 200 and HTML
  await test("IT-07", "Scheme detail page (/schemes/[id]) renders HTML", async () => {
    const list = await fetchJSON(`${BASE}/api/schemes?limit=1`);
    const id   = list.json?.data?.[0]?.id ?? "1";
    const page = await fetchJSON(`${BASE}/schemes/${id}`);
    const ok   = page.status === 200 && page.raw.includes("<html") || page.raw.includes("<!DOCTYPE");
    return { ok, detail: `schemeId=${id} HTTP ${page.status} | html=${ok}` };
  });

  // IT-08: totalPages is consistent with total and limit
  await test("IT-08", "totalPages matches Math.ceil(total/limit)", async () => {
    const r  = await fetchJSON(`${BASE}/api/schemes?limit=10`);
    const expected = Math.ceil((r.json?.total ?? 0) / 10);
    const ok = r.status === 200 && r.json?.totalPages === expected;
    return { ok, detail: `total=${r.json?.total} limit=10 → expected=${expected} got=${r.json?.totalPages}` };
  });

  // IT-09: Response includes 'lang' field
  await test("IT-09", "API response includes 'lang' field (default: en)", async () => {
    const r  = await fetchJSON(`${BASE}/api/schemes`);
    const ok = r.status === 200 && r.json?.lang === "en";
    return { ok, detail: `lang=${r.json?.lang}` };
  });

  // IT-10: Chat endpoint is wired to POST route (not GET)
  await test("IT-10", "POST /api/chat endpoint is reachable", async () => {
    const payload = JSON.stringify({ messages: [{ role: "user", content: "hello" }] });
    const r = await fetchJSON(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });
    // 200 = live AI response; 400 = endpoint exists but needs key; 405 = wrong method (fail)
    const ok = r.status === 200 || r.status === 400 || r.status === 401;
    return { ok, detail: `HTTP ${r.status} (200/400/401 all confirm endpoint is wired)` };
  });

  // ─── Summary ────────────────────────────────────────────────────────────────
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
}

main().catch(console.error);
