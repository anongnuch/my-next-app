import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll } from "vitest";

// Each test file is isolated by Vitest, so this module re-evaluates per file —
// giving every file its own throwaway SQLite database instead of the real one.
const dbPath = path.join(
  os.tmpdir(),
  `farmart-test-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}.db`,
);
process.env.FARMART_DB_PATH = dbPath;

afterAll(async () => {
  // Windows keeps the file locked until the connection closes, same as
  // `db:reset` against the real database — close it before unlinking.
  const { closeDb } = await import("@/app/lib/db");
  closeDb();

  for (const suffix of ["", "-wal", "-shm"]) {
    fs.rmSync(`${dbPath}${suffix}`, { force: true });
  }
});
