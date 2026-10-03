// Deletes the SQLite file so the next request re-creates and re-seeds it.
//
//   npm run db:reset
//
// On Windows the file stays locked while `next dev` holds it open, which
// surfaces as EBUSY/EPERM. That is a normal situation with an obvious fix, so
// it is reported as a message rather than a stack trace.

import { rmSync, existsSync } from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "data");

if (!existsSync(dir)) {
  console.log("No data/ directory — nothing to remove. It is created on the next request.");
  process.exit(0);
}

try {
  rmSync(dir, { recursive: true, force: true });
  console.log("Database removed. It will be re-created and re-seeded on the next request.");
} catch (error) {
  if (error.code === "EBUSY" || error.code === "EPERM") {
    console.error(
      "Could not delete data/ — the database file is still open.\n" +
        "Stop the dev server (and anything else holding it) and run this again.\n" +
        "To change a value without resetting, run an UPDATE against the open database instead.",
    );
    process.exit(1);
  }
  throw error;
}
