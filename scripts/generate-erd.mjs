// Generates a Mermaid ER diagram by introspecting the live SQLite file, so the
// picture can never drift from the schema the app actually runs on.
//
//   node scripts/generate-erd.mjs      (or: npm run db:diagram)
//
// Writes:
//   docs/schema.mmd      — the Mermaid source on its own
//   public/mermaid.html  — a page that renders it, served at /mermaid.html

import Database from "better-sqlite3";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "data", "farmart.db");
const db = new Database(DB_PATH, { readonly: true, fileMustExist: true });

const tables = db
  .prepare(
    `SELECT name FROM sqlite_master
      WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name`,
  )
  .all()
  .map((row) => row.name);

const schema = tables.map((name) => {
  const columns = db.prepare(`PRAGMA table_info(${name})`).all();
  const foreignKeys = db.prepare(`PRAGMA foreign_key_list(${name})`).all();
  const { count } = db.prepare(`SELECT COUNT(*) AS count FROM ${name}`).get();
  const indexes = db
    .prepare(`PRAGMA index_list(${name})`)
    .all()
    .filter((index) => index.origin === "c");
  return { name, columns, foreignKeys, count, indexes };
});

// --- Mermaid source -------------------------------------------------------

const lines = ["erDiagram"];

for (const table of schema) {
  const fkColumns = new Set(table.foreignKeys.map((fk) => fk.from));
  const uniqueColumns = new Set(
    table.indexes.filter((index) => index.unique).flatMap((index) =>
      db.prepare(`PRAGMA index_info(${index.name})`).all().map((c) => c.name),
    ),
  );

  lines.push(`    ${table.name} {`);
  for (const column of table.columns) {
    const markers = [
      column.pk ? "PK" : null,
      fkColumns.has(column.name) ? "FK" : null,
      !column.pk && uniqueColumns.has(column.name) ? "UK" : null,
    ].filter(Boolean);

    // SQLite reports notnull = 0 for non-rowid PRIMARY KEY columns, but a
    // primary key can never be null — report it as required.
    const notes = [
      column.notnull || column.pk ? "required" : "nullable",
      column.dflt_value != null ? `default ${String(column.dflt_value).replace(/"/g, "'")}` : null,
    ].filter(Boolean);

    const type = (column.type || "ANY").toUpperCase();
    lines.push(
      `        ${type} ${column.name}${markers.length ? ` ${markers.join(",")}` : ""} "${notes.join(", ")}"`,
    );
  }
  lines.push("    }");
}

for (const table of schema) {
  for (const fk of table.foreignKeys) {
    const column = table.columns.find((c) => c.name === fk.from);
    // A required FK means the parent side is exactly one; a nullable one means
    // zero-or-one.
    const cardinality = column?.notnull ? "||--o{" : "|o--o{";
    lines.push(`    ${fk.table} ${cardinality} ${table.name} : "${fk.from} → ${fk.to}"`);
  }
}

const mermaid = lines.join("\n") + "\n";

mkdirSync(path.join(process.cwd(), "docs"), { recursive: true });
writeFileSync(path.join(process.cwd(), "docs", "schema.mmd"), mermaid, "utf8");

// --- Static page ----------------------------------------------------------

const totals = {
  tables: schema.length,
  columns: schema.reduce((sum, t) => sum + t.columns.length, 0),
  relationships: schema.reduce((sum, t) => sum + t.foreignKeys.length, 0),
  rows: schema.reduce((sum, t) => sum + t.count, 0),
};

const summaryRows = schema
  .map(
    (t) => `          <tr>
            <td>${t.name}</td>
            <td>${t.columns.length}</td>
            <td>${t.foreignKeys.length}</td>
            <td>${t.count}</td>
          </tr>`,
  )
  .join("\n");

// This file is served straight from /public, so Next never processes it and the
// design tokens are restated here as literals rather than imported.
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Farmart Database Schema</title>
    <style>
      :root {
        --brand: #fdbc1f;
        --ink: #1f2223;
        --mute: #7b8085;
        --hairline: #e7e9eb;
        --canvas: #ffffff;
        --canvas-soft: #f5f6f7;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: var(--canvas);
        color: var(--ink);
        font-family: Geist, Inter, system-ui, -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      header { border-bottom: 1px solid var(--hairline); }
      .wrap { max-width: 1240px; margin: 0 auto; padding: 32px 16px; }
      .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
      .mark {
        width: 40px; height: 40px; border-radius: 9999px; background: var(--brand);
        display: grid; place-items: center; font-size: 20px;
      }
      h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.55px; }
      .chip {
        background: var(--canvas-soft); color: var(--mute); border-radius: 4px;
        padding: 4px 8px; font: 500 11px ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      .actions { margin-left: auto; display: flex; gap: 8px; }
      a.btn, button.btn {
        height: 40px; display: inline-flex; align-items: center; gap: 6px;
        padding: 0 16px; border-radius: 4px; border: 1px solid var(--hairline);
        background: var(--canvas); color: var(--ink); font: 700 13px inherit;
        text-decoration: none; cursor: pointer;
      }
      a.btn.primary { background: var(--brand); border-color: var(--brand); }
      .note { margin-top: 12px; font-size: 11px; color: var(--mute); }
      .panel {
        border: 1px solid var(--hairline); border-radius: 6px; overflow: auto;
        padding: 24px; background: var(--canvas);
      }
      h2 { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; text-align: left; }
      thead tr { background: var(--canvas-soft); }
      th {
        font: 400 11px inherit; text-transform: uppercase; letter-spacing: 0.025em;
        color: var(--mute); padding: 10px 12px; border-bottom: 1px solid var(--hairline);
      }
      td { padding: 10px 12px; font-size: 12px; border-bottom: 1px solid var(--hairline); }
      tbody tr:last-child td { border-bottom: 0; }
      td:first-child { font-weight: 600; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
      pre.source {
        border: 1px solid var(--hairline); border-radius: 6px; background: var(--canvas-soft);
        padding: 16px; overflow: auto; font: 11px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      .fallback { color: var(--mute); font-size: 13px; }
    </style>
  </head>
  <body>
    <header>
      <div class="wrap">
        <div class="row">
          <span class="mark">🌿</span>
          <h1>Farmart Database Schema</h1>
          <span class="chip">SQLite · ${totals.tables} tables · ${totals.columns} columns · ${totals.relationships} relationships · ${totals.rows} rows</span>
          <div class="actions">
            <button class="btn" id="copy">Copy Mermaid</button>
            <a class="btn primary" href="/">Back to the storefront</a>
          </div>
        </div>
        <p class="note">
          Generated from <code>data/farmart.db</code> by introspection — run
          <code>npm run db:diagram</code> to refresh after a schema change.
        </p>
      </div>
    </header>

    <main class="wrap">
      <section class="panel">
        <pre class="mermaid" id="diagram">${mermaid.replace(/</g, "&lt;")}</pre>
        <p class="fallback" id="fallback" hidden>
          The Mermaid renderer could not be loaded from the CDN. The source above
          is still valid Mermaid — paste it into mermaid.live.
        </p>
      </section>

      <section style="margin-top: 32px">
        <h2>Tables</h2>
        <div class="panel" style="padding: 0">
          <table>
            <thead>
              <tr><th>Table</th><th>Columns</th><th>Foreign keys</th><th>Rows</th></tr>
            </thead>
            <tbody>
${summaryRows}
            </tbody>
          </table>
        </div>
      </section>

      <section style="margin-top: 32px">
        <h2>Mermaid source</h2>
        <pre class="source" id="source">${mermaid.replace(/</g, "&lt;")}</pre>
      </section>
    </main>

    <script type="module">
      const source = document.getElementById("source").textContent;

      document.getElementById("copy").addEventListener("click", async (event) => {
        await navigator.clipboard.writeText(source);
        event.target.textContent = "Copied";
        setTimeout(() => (event.target.textContent = "Copy Mermaid"), 1500);
      });

      try {
        const { default: mermaid } = await import(
          "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs"
        );
        mermaid.initialize({
          startOnLoad: true,
          theme: "base",
          themeVariables: {
            primaryColor: "#fff7e3",
            primaryBorderColor: "#fdbc1f",
            primaryTextColor: "#1f2223",
            lineColor: "#7b8085",
            fontFamily: "Geist, Inter, system-ui, sans-serif",
          },
        });
        await mermaid.run({ querySelector: "pre.mermaid" });
      } catch {
        document.getElementById("fallback").hidden = false;
      }
    </script>
  </body>
</html>
`;

mkdirSync(path.join(process.cwd(), "public"), { recursive: true });
writeFileSync(path.join(process.cwd(), "public", "mermaid.html"), html, "utf8");

console.log(
  `wrote docs/schema.mmd and public/mermaid.html — ${totals.tables} tables, ` +
    `${totals.columns} columns, ${totals.relationships} relationships, ${totals.rows} rows`,
);
db.close();
