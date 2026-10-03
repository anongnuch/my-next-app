import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { openApiDocument } from "@/app/lib/openapi";

const API_ROOT = path.join(process.cwd(), "app", "api");
const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

// "/collections/{slug}" -> app/api/collections/[slug]/route.ts
function routeFileFor(openApiPath: string) {
  const segments = openApiPath
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.replace(/^\{(.+)\}$/, "[$1]"));
  return path.join(API_ROOT, ...segments, "route.ts");
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name === "route.ts" ? [full] : [];
  });
}

function exportedMethods(file: string): string[] {
  const source = fs.readFileSync(file, "utf8");
  return HTTP_METHODS.filter((method) =>
    new RegExp(`export\\s+(async\\s+)?function\\s+${method}\\b`).test(source),
  );
}

const routeFiles = walk(API_ROOT);
const operations = Object.entries(openApiDocument.paths).flatMap(([route, methods]) =>
  Object.entries(methods as Record<string, { "x-status": string }>).map(([method, operation]) => ({
    route,
    method: method.toUpperCase(),
    status: operation["x-status"],
    file: routeFileFor(route),
  })),
);

describe("spec-contract", () => {
  it("has a route file for every live operation", () => {
    for (const op of operations.filter((o) => o.status === "live")) {
      expect(fs.existsSync(op.file), `${op.method} ${op.route} is live but ${op.file} is missing`).toBe(
        true,
      );
      expect(
        exportedMethods(op.file),
        `${op.file} does not export ${op.method}`,
      ).toContain(op.method);
    }
  });

  it("has no route file for a planned operation", () => {
    for (const op of operations.filter((o) => o.status === "planned")) {
      if (!fs.existsSync(op.file)) continue;
      expect(
        exportedMethods(op.file),
        `${op.file} implements ${op.method} ${op.route} but the spec marks it planned`,
      ).not.toContain(op.method);
    }
  });

  it("describes every route file on disk", () => {
    for (const file of routeFiles) {
      const methods = exportedMethods(file);
      for (const method of methods) {
        const match = operations.find(
          (op) => op.file === file && op.method === method && op.status === "live",
        );
        expect(
          match,
          `${file} exports ${method} but openapi.ts does not describe it as live`,
        ).toBeTruthy();
      }
    }
  });
});
