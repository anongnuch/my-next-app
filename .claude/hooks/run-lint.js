// Lint gate in two parts, both handled here:
//   node run-lint.js snapshot  (UserPromptSubmit) records the state of the code
//                              files at the start of a turn.
//   node run-lint.js           (Stop) compares against that snapshot and runs
//                              `npm run lint` only if a code file changed this turn.
//   - Each lint run is appended to .claude/lint-log.txt (timestamp, status, output).
//   - The user sees a one-line summary via `systemMessage`.
//   - On failure it exits 2, which feeds the output back to Claude to fix.
// `stop_hook_active` is set when Claude is already continuing because of this
// hook; the lint still runs and is logged, but it no longer blocks, so a failing
// lint cannot trap Claude in a loop.
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const logFile = path.join(root, ".claude", "lint-log.txt");
const CODE = /\.(js|jsx|mjs|cjs|ts|tsx)$/;
const SKIP = /^(\.claude|\.next|node_modules|graphify-out|coverage|public)\//;

// path + mtime + size of every changed or untracked code file. Status text alone
// would miss a file that was already modified and is edited again.
function codeState() {
  const status = spawnSync("git status --porcelain -uall", {
    cwd: root,
    shell: true,
    encoding: "utf8",
  }).stdout;
  const entries = [];
  for (const line of (status || "").split("\n")) {
    const file = line.slice(3).replace(/^"|"$/g, "").split(" -> ").pop();
    if (!file || !CODE.test(file) || SKIP.test(file)) continue;
    try {
      const { mtimeMs, size } = fs.statSync(path.join(root, file));
      entries.push(`${file}:${mtimeMs}:${size}`);
    } catch {
      entries.push(`${file}:deleted`);
    }
  }
  return entries.sort().join("\n");
}

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let payload = {};
  try {
    payload = JSON.parse(input);
  } catch {}

  const id = String(payload.session_id || "default").replace(/[^\w-]/g, "");
  const snapshotFile = path.join(os.tmpdir(), `claude-lint-${id}.txt`);

  if (process.argv[2] === "snapshot") {
    fs.writeFileSync(snapshotFile, codeState());
    process.exit(0);
  }

  // No snapshot (hook added mid-session) or no code change this turn: skip.
  if (!fs.existsSync(snapshotFile)) process.exit(0);
  if (fs.readFileSync(snapshotFile, "utf8") === codeState()) process.exit(0);

  const result = spawnSync("npm run lint", {
    cwd: root,
    shell: true,
    encoding: "utf8",
    timeout: 110000,
  });
  const passed = result.status === 0;
  const output = `${result.stdout || ""}${result.stderr || ""}`.trim();
  const stamp = new Date().toISOString();

  const entry = `[${stamp}] ${passed ? "PASS" : "FAIL"} (exit ${result.status})\n${output}\n\n`;
  try {
    fs.appendFileSync(logFile, entry);
  } catch {}

  const summary = `eslint ${passed ? "passed" : "FAILED"} — logged to .claude/lint-log.txt`;
  if (passed || payload.stop_hook_active) {
    process.stdout.write(JSON.stringify({ systemMessage: summary }));
    process.exit(0);
  }

  process.stderr.write(`npm run lint failed:\n${output.slice(-4000)}\n`);
  process.exit(2);
});
