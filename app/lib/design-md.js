import { readFile } from "node:fs/promises";
import path from "node:path";

// Reader for DESIGN.md, used by the /design preview so that page never holds a
// second copy of the token values.
//
// The front matter is the contract and is parsed strictly — a malformed block
// fails the build rather than rendering a wrong preview. Everything pulled out
// of the markdown body (role sentences, "Use" columns, guardrail bullets) is
// best-effort and degrades to empty, since prose is edited more freely.
//
// Supported YAML subset, which is all DESIGN.md uses: three levels of `key:`
// nesting at 0 / 2 / 4 spaces, scalar values only, optional double quotes.

export async function loadDesignMd() {
  const raw = await readFile(path.join(process.cwd(), "DESIGN.md"), "utf8");
  const lines = raw.split(/\r?\n/);

  if (lines[0] !== "---") {
    throw new Error("DESIGN.md: expected YAML front matter on line 1");
  }
  const close = lines.indexOf("---", 1);
  if (close === -1) {
    throw new Error("DESIGN.md: front matter is never closed");
  }

  const tokens = parseFrontMatter(lines.slice(1, close));
  for (const group of ["colors", "typography", "rounded", "spacing", "components"]) {
    if (!tokens[group]) {
      throw new Error(`DESIGN.md: front matter is missing the "${group}" block`);
    }
  }

  return { tokens, body: lines.slice(close + 1) };
}

function parseFrontMatter(lines) {
  const out = {};
  let group = null;
  let entry = null;

  lines.forEach((line, i) => {
    if (!line.trim() || line.trimStart().startsWith("#")) return;

    const match = line.match(/^( *)([\w-]+):\s*(.*)$/);
    if (!match) {
      throw new Error(`DESIGN.md front matter: cannot parse line ${i + 2}: ${line}`);
    }
    const [, indent, key, rawValue] = match;
    const value = unquote(rawValue);

    if (indent.length === 0) {
      group = key;
      entry = null;
      out[group] = value === "" ? {} : value;
      return;
    }
    if (typeof out[group] !== "object") {
      throw new Error(`DESIGN.md front matter: "${group}" has a value and children`);
    }
    if (indent.length === 2) {
      entry = key;
      out[group][entry] = value === "" ? {} : value;
      return;
    }
    if (indent.length === 4) {
      if (typeof out[group][entry] !== "object") {
        throw new Error(`DESIGN.md front matter: "${entry}" has a value and children`);
      }
      out[group][entry][key] = value;
      return;
    }
    throw new Error(`DESIGN.md front matter: unexpected indent on line ${i + 2}`);
  });

  return out;
}

function unquote(value) {
  const trimmed = value.trim();
  return trimmed.replace(/^"(.*)"$/, "$1");
}

// Returns the slice of body lines belonging to a heading, stopping at the next
// heading of the same or higher level.
function sectionLines(body, heading) {
  const start = body.findIndex((line) => line.trim() === heading);
  if (start === -1) return [];
  const level = heading.match(/^#+/)[0].length;
  const rest = body.slice(start + 1);
  const end = rest.findIndex((line) => {
    const hashes = line.match(/^(#+) /);
    return hashes && hashes[1].length <= level;
  });
  return end === -1 ? rest : rest.slice(0, end);
}

// Joins wrapped markdown bullets back into one string each.
function bulletsIn(lines) {
  const out = [];
  for (const line of lines) {
    if (/^[-*] /.test(line)) out.push(line.slice(2).trim());
    else if (out.length && /^ {2,}\S/.test(line)) out[out.length - 1] += ` ${line.trim()}`;
    else if (!line.trim()) continue;
    else if (out.length) break;
  }
  return out;
}

export function guardrails(body) {
  const scope = sectionLines(body, "## Do's and Don'ts");
  return {
    dos: bulletsIn(sectionLines(scope, "### Do")),
    donts: bulletsIn(sectionLines(scope, "### Don't")),
  };
}

// `- **Saffron** (`{colors.brand}` — `#fdbc1f`) — the single accent...`
// The value is any CSS colour, not just a hex, so the translucent scrim matches.
const COLOR_BULLET =
  /^\*\*(.+?)\*\*\s*\(`\{colors\.([\w-]+)\}`\s*—\s*`([^`]+)`\)\s*—\s*(.+)$/;

export function colorGroups(body) {
  const scope = sectionLines(body, "## Colors");
  return ["Brand & Accent", "Surface", "Text", "Semantic"]
    .map((name) => ({
      name,
      swatches: bulletsIn(sectionLines(scope, `### ${name}`))
        .map((bullet) => bullet.match(COLOR_BULLET))
        .filter(Boolean)
        .map(([, label, token, hex, role]) => ({ label, token, hex, role: stripMd(role) })),
    }))
    .filter((group) => group.swatches.length > 0);
}

// Returns the first markdown table under a heading as { headers, rows }.
export function tableUnder(body, heading) {
  const scope = sectionLines(body, heading);
  const start = scope.findIndex((line) => line.trimStart().startsWith("|"));
  if (start === -1) return { headers: [], rows: [] };

  const raw = [];
  for (const line of scope.slice(start)) {
    if (!line.trimStart().startsWith("|")) break;
    raw.push(line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));
  }
  const [headers, , ...rows] = raw;
  return { headers: headers ?? [], rows: rows.filter((row) => !/^-+$/.test(row[0] ?? "")) };
}

export function stripMd(text) {
  return text.replace(/`([^`]*)`/g, "$1").replace(/\*\*([^*]*)\*\*/g, "$1");
}
