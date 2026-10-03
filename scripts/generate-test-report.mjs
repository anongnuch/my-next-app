// Builds a readable testing report from the last run's artefacts.
//
//   npm run test:report
//
// Reads reports/vitest.json (written by vitest's json reporter) and
// coverage/coverage-summary.json, then writes public/test-report.html, served
// at /test-report.html. Self-contained, so it also opens straight from disk.

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const resultsPath = path.join(root, "reports", "vitest.json");

if (!existsSync(resultsPath)) {
  console.error("No reports/vitest.json — run `npm run test:report` rather than this script alone.");
  process.exit(1);
}

const results = JSON.parse(readFileSync(resultsPath, "utf8"));

let coverage = null;
const coveragePath = path.join(root, "coverage", "coverage-summary.json");
if (existsSync(coveragePath)) {
  coverage = JSON.parse(readFileSync(coveragePath, "utf8"));
}

const escape = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const relative = (file) => path.relative(root, file).replace(/\\/g, "/");

// Each file is classified by the folder it lives in — that is what the unit and
// integration split in this report means.
const files = results.testResults.map((file) => {
  const name = relative(file.name);
  const cases = file.assertionResults.map((test) => ({
    suite: test.ancestorTitles.join(" › ") || "—",
    title: test.title,
    status: test.status,
    duration: test.duration ?? 0,
  }));

  return {
    name,
    type: name.includes("/integration/") ? "Integration" : "Unit",
    cases,
    passed: cases.filter((c) => c.status === "passed").length,
    failed: cases.filter((c) => c.status === "failed").length,
    duration: Math.round((file.endTime ?? 0) - (file.startTime ?? 0)),
  };
});

const totals = {
  passed: files.reduce((sum, f) => sum + f.passed, 0),
  failed: files.reduce((sum, f) => sum + f.failed, 0),
  files: files.length,
  duration: files.reduce((sum, f) => sum + f.duration, 0),
};
totals.tests = totals.passed + totals.failed;

const byType = (type) => files.filter((f) => f.type === type);
const countFor = (type) => byType(type).reduce((sum, f) => sum + f.cases.length, 0);

const statementPct = coverage ? coverage.total.statements.pct : null;

const fileRow = (file) => `
          <tr>
            <td class="mono">${escape(file.name)}</td>
            <td>${file.type}</td>
            <td class="num">${file.cases.length}</td>
            <td>${
              file.failed
                ? `<span class="pill fail">✕ ${file.failed} failed</span>`
                : '<span class="pill pass">✓ Pass</span>'
            }</td>
            <td class="num">${file.duration}ms</td>
          </tr>`;

const caseRows = (file) => {
  let lastSuite = null;
  return file.cases
    .map((test, index) => {
      const suiteCell =
        test.suite === lastSuite ? "" : `<span class="suite">${escape(test.suite)}</span>`;
      lastSuite = test.suite;
      return `
          <tr>
            <td>${suiteCell}</td>
            <td>${escape(test.title)}</td>
            <td class="num">${index + 1}</td>
            <td>${
              test.status === "passed"
                ? '<span class="pill pass">✓</span>'
                : `<span class="pill fail">✕ ${escape(test.status)}</span>`
            }</td>
          </tr>`;
    })
    .join("");
};

const section = (type, blurb) => `
      <section>
        <h2>${type} Tests <span class="count">(${countFor(type)} tests)</span></h2>
        <p class="blurb">${blurb}</p>
        ${byType(type)
          .map(
            (file) => `
        <h3 class="mono">${escape(file.name)}</h3>
        <div class="panel flush">
          <table>
            <thead>
              <tr><th style="width:28%">Suite</th><th>Test case</th><th style="width:48px">#</th><th style="width:72px">Status</th></tr>
            </thead>
            <tbody>${caseRows(file)}
            </tbody>
          </table>
        </div>`,
          )
          .join("")}
      </section>`;

const generated = new Date().toISOString().slice(0, 16).replace("T", " ");

// Served from /public, so Next never processes it — the design tokens are
// restated here as literals rather than imported.
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Farmart API — Testing Report</title>
    <style>
      :root {
        --brand: #fdbc1f; --brand-soft: #fff7e3; --ink: #1f2223; --mute: #7b8085;
        --hairline: #e7e9eb; --canvas: #ffffff; --canvas-soft: #f5f6f7;
        --sale: #e4443c; --pass: #2f7d3a; --pass-soft: #e8f3e9;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: var(--canvas); color: var(--ink);
        font-family: Geist, Inter, system-ui, -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .wrap { max-width: 1240px; margin: 0 auto; padding: 32px 16px; }
      header { border-bottom: 1px solid var(--hairline); }
      h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.7px; }
      .sub { margin-top: 8px; font-size: 13px; color: var(--mute); }
      .badges { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
      .badge {
        border-radius: 9999px; padding: 6px 12px; font-size: 12px; font-weight: 600;
        background: var(--canvas-soft); color: var(--mute);
      }
      .badge.ok { background: var(--pass-soft); color: var(--pass); }
      .badge.brand { background: var(--brand-soft); color: #8a6200; }
      h2 { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; margin: 32px 0 4px; }
      h2 .count { font-weight: 400; font-size: 13px; color: var(--mute); letter-spacing: 0; }
      h3 { font-size: 12px; font-weight: 600; color: var(--mute); margin: 20px 0 8px; }
      .blurb { font-size: 13px; color: var(--mute); margin-bottom: 8px; }
      .tiles { display: grid; gap: 20px; grid-template-columns: repeat(4, minmax(0, 1fr)); margin-top: 20px; }
      .tile { border: 1px solid var(--hairline); border-radius: 6px; padding: 20px; }
      .tile .value { font-size: 26px; font-weight: 800; letter-spacing: -0.65px; }
      .tile .label {
        margin-top: 6px; font-size: 11px; text-transform: uppercase;
        letter-spacing: 0.025em; color: var(--mute);
      }
      .tile.ok .value { color: var(--pass); }
      .tile.bad .value { color: ${totals.failed ? "var(--sale)" : "var(--mute)"}; }
      .panel { border: 1px solid var(--hairline); border-radius: 6px; overflow: hidden; margin-top: 12px; }
      .panel.flush { margin-top: 0; }
      table { width: 100%; border-collapse: collapse; text-align: left; }
      thead tr { background: var(--canvas-soft); }
      th {
        font-size: 11px; font-weight: 400; text-transform: uppercase;
        letter-spacing: 0.025em; color: var(--mute);
        padding: 10px 12px; border-bottom: 1px solid var(--hairline);
      }
      td { padding: 9px 12px; font-size: 12px; border-bottom: 1px solid var(--hairline); vertical-align: top; }
      tbody tr:last-child td { border-bottom: 0; }
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; }
      td.mono { color: var(--sale); }
      .num { text-align: right; font-variant-numeric: tabular-nums; }
      .suite { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; color: var(--mute); }
      .pill { border-radius: 4px; padding: 2px 6px; font-size: 10px; font-weight: 600; white-space: nowrap; }
      .pill.pass { background: var(--pass-soft); color: var(--pass); }
      .pill.fail { background: #fdeceb; color: var(--sale); }
      footer { border-top: 1px solid var(--hairline); margin-top: 40px; }
      footer p { font-size: 11px; color: var(--mute); }
      a { color: inherit; }
      @media (max-width: 860px) { .tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      @media print { .tiles { grid-template-columns: repeat(4, 1fr); } body { font-size: 11px; } }
    </style>
  </head>
  <body>
    <header>
      <div class="wrap">
        <h1>Farmart API — Testing Report</h1>
        <p class="sub">Unit &amp; integration tests · Generated ${generated}</p>
        <div class="badges">
          <span class="badge ${totals.failed ? "" : "ok"}">${
            totals.failed ? `✕ ${totals.failed} failed` : `✓ ${totals.passed} / ${totals.tests} passed`
          }</span>
          <span class="badge">${totals.files} test files</span>
          ${statementPct !== null ? `<span class="badge brand">${statementPct}% statement coverage</span>` : ""}
        </div>
      </div>
    </header>

    <main class="wrap">
      <h2>Overall summary</h2>
      <div class="tiles">
        <div class="tile ok"><div class="value">${totals.passed}</div><div class="label">Tests passed</div></div>
        <div class="tile bad"><div class="value">${totals.failed}</div><div class="label">Tests failed</div></div>
        <div class="tile"><div class="value">${totals.files}</div><div class="label">Test files</div></div>
        <div class="tile"><div class="value">${totals.duration}ms</div><div class="label">Total duration</div></div>
      </div>

      <div class="panel">
        <table>
          <thead>
            <tr><th>Test file</th><th style="width:96px">Type</th><th style="width:64px" class="num">Tests</th><th style="width:104px">Status</th><th style="width:88px" class="num">Duration</th></tr>
          </thead>
          <tbody>${files.map(fileRow).join("")}
          </tbody>
        </table>
      </div>
${section("Unit", "Module logic in isolation — the repository's SQL, the schema's constraints, the DESIGN.md parser and the request helpers.")}
${section("Integration", "Layers together — route handlers driven through Request/Response down to SQLite, and the spec checked against the route files on disk.")}
${
  coverage
    ? `
      <section>
        <h2>Coverage <span class="count">(app/lib and app/api)</span></h2>
        <p class="blurb">Full line-by-line report at <code>coverage/index.html</code>.</p>
        <div class="tiles">
          ${["statements", "branches", "functions", "lines"]
            .map(
              (key) => `<div class="tile"><div class="value">${coverage.total[key].pct}%</div><div class="label">${key} · ${coverage.total[key].covered}/${coverage.total[key].total}</div></div>`,
            )
            .join("")}
        </div>
      </section>`
    : ""
}
    </main>

    <footer>
      <div class="wrap">
        <p>
          Generated by <code>npm run test:report</code> from vitest's JSON output.
          Re-run it after changing tests — this file is not committed.
        </p>
      </div>
    </footer>
  </body>
</html>
`;

mkdirSync(path.join(root, "public"), { recursive: true });
writeFileSync(path.join(root, "public", "test-report.html"), html, "utf8");

console.log(
  `wrote public/test-report.html — ${totals.passed}/${totals.tests} passed across ` +
    `${totals.files} files (${countFor("Unit")} unit, ${countFor("Integration")} integration)` +
    (statementPct !== null ? `, ${statementPct}% statements` : ""),
);
