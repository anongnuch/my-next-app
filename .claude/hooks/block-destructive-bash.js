// PreToolUse hook (matcher: Bash|PowerShell) — blocks `rm -rf`, `Remove-Item -Recurse -Force`
// and `git push --force`/-f.
let data = "";
process.stdin.on("data", (chunk) => (data += chunk));
process.stdin.on("end", () => {
  let command = "";
  try {
    command = JSON.parse(data).tool_input?.command ?? "";
  } catch {
    // malformed input, nothing to check
  }

  const rmRf =
    /\brm\s+(-[a-zA-Z]+\s+)*-[a-zA-Z]*r[a-zA-Z]*f[a-zA-Z]*\b/i.test(command) ||
    /\brm\s+(-[a-zA-Z]+\s+)*-[a-zA-Z]*f[a-zA-Z]*r[a-zA-Z]*\b/i.test(command);
  // PowerShell equivalent: a delete cmdlet/alias used with both -Recurse and -Force.
  const psRemove =
    /\b(remove-item|ri|rd|rmdir|del|erase|rm)\b/i.test(command) &&
    /\s-recurse\b/i.test(command) &&
    /\s-force\b/i.test(command);
  const forcePush = /\bgit\s+push\b[^;&|\n]*(--force\b|--force-with-lease\b|\s-f\b)/i.test(command);

  if (rmRf || psRemove || forcePush) {
    const reason = rmRf || psRemove
      ? "Blocked by policy: recursive force delete (rm -rf / Remove-Item -Recurse -Force) is not allowed."
      : "Blocked by policy: git push --force / -f is not allowed.";
    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: reason,
        },
      })
    );
  }
});
