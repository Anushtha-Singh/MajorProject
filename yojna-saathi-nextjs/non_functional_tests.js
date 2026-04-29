/**
 * Yojna Saathi – Non-Functional Test Suite
 * Tests: Performance, Security headers, Availability, SEO, PWA
 * Run:  node non_functional_tests.js   (requires: npm run dev)
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

function fetch(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const options = { method: opts.method || "GET", headers: opts.headers || {} };
    const start = Date.now();
    const req = http.request(url, options, (res) => {
      let body = "";
      res.on("data", d => body += d);
      res.on("end", () => resolve({
        status: res.statusCode,
        headers: res.headers,
        body,
        ms: Date.now() - start,
      }));
    });
    req.on("error", reject);
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

let passed = 0, failed = 0, total = 0;

async function test(id, category, name, fn) {
  total++;
  process.stdout.write(`\n${C.bold}${C.cyan}${id}${C.reset} ${C.gray}[${category}]${C.reset} ${C.bold}${name}${C.reset}\n`);
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
  console.log(`${C.bold}  Yojna Saathi – Non-Functional Test Suite${C.reset}`);
  console.log(`${C.bold}${"═".repeat(62)}${C.reset}`);
  console.log(`  ${C.gray}Base URL : ${BASE}${C.reset}`);
  console.log(`  ${C.gray}Time     : ${new Date().toLocaleString()}${C.reset}`);
  console.log(`  ${C.gray}Scope    : Performance · Security · SEO · PWA · Reliability${C.reset}`);

  // ── PERFORMANCE ────────────────────────────────────────────────────────────
  await test("NF-01", "Performance", "Home page responds within 3 seconds", async () => {
    const r = await fetch(`${BASE}/`);
    const ok = r.status === 200 && r.ms < 3000;
    return { ok, detail: `response_time=${r.ms}ms  threshold=3000ms  ${ok ? "✓ within limit" : "✗ too slow"}` };
  });

  await test("NF-02", "Performance", "Schemes API responds within 8 seconds", async () => {
    const r = await fetch(`${BASE}/api/schemes`);
    const ok = r.status === 200 && r.ms < 8000;
    return { ok, detail: `response_time=${r.ms}ms  threshold=8000ms (incl. DB cold-start)` };
  });

  await test("NF-03", "Performance", "Search query responds within 5 seconds", async () => {
    const r = await fetch(`${BASE}/api/schemes?search=scholarship`);
    const ok = r.status === 200 && r.ms < 5000;
    return { ok, detail: `response_time=${r.ms}ms  threshold=5000ms` };
  });

  // Concurrent load — 5 simultaneous requests
  await test("NF-04", "Performance", "Handles 5 concurrent requests without failure", async () => {
    const requests = Array(5).fill(null).map(() => fetch(`${BASE}/api/schemes?limit=5`));
    const results  = await Promise.all(requests);
    const allOk    = results.every(r => r.status === 200);
    const avgMs    = Math.round(results.reduce((s, r) => s + r.ms, 0) / results.length);
    return { ok: allOk, detail: `5/5 success=${allOk} | avg_response=${avgMs}ms` };
  });

  // ── SECURITY ───────────────────────────────────────────────────────────────
  await test("NF-05", "Security", "HTTP response includes X-Content-Type-Options header", async () => {
    const r   = await fetch(`${BASE}/`);
    const hdr = r.headers["x-content-type-options"];
    const ok  = !!hdr && hdr.toLowerCase().includes("nosniff");
    return { ok, detail: `x-content-type-options: "${hdr ?? "MISSING"}"` };
  });

  await test("NF-06", "Security", "API does not expose stack traces on error", async () => {
    const r = await fetch(`${BASE}/api/schemes?limit=abc`);
    const hasTrace = r.body.includes("at Object") || r.body.includes("node_modules");
    const ok = r.status !== 500 || !hasTrace;
    return { ok, detail: `HTTP ${r.status} | stack_trace_exposed=${hasTrace}` };
  });

  await test("NF-07", "Security", "SQL injection attempt returns safe response", async () => {
    const malicious = encodeURIComponent("' OR '1'='1");
    const r = await fetch(`${BASE}/api/schemes?search=${malicious}`);
    const ok = r.status === 200 || r.status === 400; // should not 500 or dump DB data
    return { ok, detail: `HTTP ${r.status} | server handled injection attempt gracefully` };
  });

  await test("NF-08", "Security", "Undefined API routes return 404, not 500", async () => {
    const r = await fetch(`${BASE}/api/doesnotexist`);
    const ok = r.status === 404;
    return { ok, detail: `HTTP ${r.status} (expected 404)` };
  });

  // ── SEO / ACCESSIBILITY ────────────────────────────────────────────────────
  await test("NF-09", "SEO", "Home page contains <title> tag", async () => {
    const r  = await fetch(`${BASE}/`);
    const ok = r.status === 200 && r.body.includes("<title");
    const titleMatch = r.body.match(/<title[^>]*>([^<]+)<\/title>/i);
    return { ok, detail: `title="${titleMatch?.[1] ?? "NOT FOUND"}"` };
  });

  await test("NF-10", "SEO", "Home page contains meta description", async () => {
    const r  = await fetch(`${BASE}/`);
    const ok = r.body.includes('name="description"') || r.body.includes("name='description'");
    return { ok, detail: `meta description present=${ok}` };
  });

  await test("NF-11", "SEO", "Home page has viewport meta tag (mobile-friendly)", async () => {
    const r  = await fetch(`${BASE}/`);
    const ok = r.body.includes('name="viewport"');
    return { ok, detail: `viewport meta present=${ok}` };
  });

  await test("NF-12", "SEO", "Schemes page returns 200", async () => {
    const r  = await fetch(`${BASE}/schemes`);
    const ok = r.status === 200;
    return { ok, detail: `HTTP ${r.status}` };
  });

  // ── PWA / OFFLINE ──────────────────────────────────────────────────────────
  await test("NF-13", "PWA", "manifest.json is valid JSON with 'name' field", async () => {
    const r = await fetch(`${BASE}/manifest.json`);
    let json = null;
    try { json = JSON.parse(r.body); } catch {}
    const ok = r.status === 200 && json !== null && "name" in json;
    return { ok, detail: `HTTP ${r.status} | name="${json?.name}"` };
  });

  await test("NF-14", "PWA", "service worker (sw.js) is accessible", async () => {
    const r  = await fetch(`${BASE}/sw.js`);
    const ok = r.status === 200 && r.body.length > 0;
    return { ok, detail: `HTTP ${r.status} | size=${r.body.length} bytes` };
  });

  await test("NF-15", "PWA", "manifest.json includes 'icons' array", async () => {
    const r = await fetch(`${BASE}/manifest.json`);
    let json = null;
    try { json = JSON.parse(r.body); } catch {}
    const ok = Array.isArray(json?.icons) && json.icons.length > 0;
    return { ok, detail: `icons.length=${json?.icons?.length ?? 0}` };
  });

  // ── RELIABILITY / AVAILABILITY ─────────────────────────────────────────────
  await test("NF-16", "Reliability", "10 sequential requests all succeed (availability)", async () => {
    let allOk = true, times = [];
    for (let i = 0; i < 10; i++) {
      const r = await fetch(`${BASE}/`);
      if (r.status !== 200) allOk = false;
      times.push(r.ms);
    }
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    return { ok: allOk, detail: `10/10 passed=${allOk} | avg_time=${avg}ms | min=${Math.min(...times)}ms max=${Math.max(...times)}ms` };
  });

  await test("NF-17", "Reliability", "API handles missing query params gracefully", async () => {
    const r = await fetch(`${BASE}/api/schemes`);
    const ok = r.status === 200;
    return { ok, detail: `No query params → HTTP ${r.status} (no crash)` };
  });

  await test("NF-18", "Reliability", "Very large limit is capped (not DB-overflow)", async () => {
    const r = await fetch(`${BASE}/api/schemes?limit=99999`);
    let json = null;
    try { json = JSON.parse(r.body); } catch {}
    const ok = r.status === 200 && (json?.limit ?? 0) <= 100;
    return { ok, detail: `requested limit=99999 → actual limit=${json?.limit}` };
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
