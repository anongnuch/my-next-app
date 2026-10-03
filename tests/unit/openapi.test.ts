import { describe, expect, it } from "vitest";
import { openApiDocument } from "@/app/lib/openapi";
import { SORT_OPTIONS } from "@/app/lib/repository";

type AnyRecord = Record<string, unknown>;

function collectRefs(node: unknown, refs: Set<string>) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((item) => collectRefs(item, refs));
    return;
  }
  const record = node as AnyRecord;
  if (typeof record.$ref === "string") refs.add(record.$ref);
  for (const value of Object.values(record)) collectRefs(value, refs);
}

describe("openApiDocument", () => {
  it("declares the 3.1 version", () => {
    expect(openApiDocument.openapi).toBe("3.1.0");
  });

  it("marks every operation with a known x-status", () => {
    for (const [route, methods] of Object.entries(openApiDocument.paths)) {
      for (const [method, operation] of Object.entries(methods as AnyRecord)) {
        expect(
          ["live", "planned"],
          `${method.toUpperCase()} ${route} has an unknown x-status`,
        ).toContain((operation as AnyRecord)["x-status"]);
      }
    }
  });

  it("resolves every $ref to a declared schema", () => {
    const refs = new Set<string>();
    collectRefs(openApiDocument.paths, refs);
    collectRefs(openApiDocument.components.schemas, refs);

    const declared = new Set(Object.keys(openApiDocument.components.schemas));
    for (const ref of refs) {
      const name = ref.replace("#/components/schemas/", "");
      expect(declared, `${ref} has no matching schema`).toContain(name);
    }
  });

  it("gives every response a JSON schema", () => {
    for (const [route, methods] of Object.entries(openApiDocument.paths)) {
      for (const [method, operation] of Object.entries(methods as AnyRecord)) {
        for (const [status, response] of Object.entries(
          (operation as AnyRecord).responses as AnyRecord,
        )) {
          const content = (response as AnyRecord).content as AnyRecord | undefined;
          expect(content, `${method.toUpperCase()} ${route} ${status} has no content`).toBeTruthy();
          expect(content).toHaveProperty("application/json");
        }
      }
    }
  });

  it("keeps the documented sort enum in sync with the repository", () => {
    const parameters = openApiDocument.paths["/products"].get.parameters as unknown as AnyRecord[];
    const sortParam = (parameters.find((p) => p.name === "sort") as AnyRecord).schema as AnyRecord;
    expect(sortParam.enum).toEqual(SORT_OPTIONS);
  });

  it("flags implemented endpoints as live", () => {
    expect(openApiDocument.paths["/products"].get["x-status"]).toBe("live");
    expect(openApiDocument.paths["/hello"].get["x-status"]).toBe("live");
  });

  it("flags cart and wishlist endpoints as planned", () => {
    expect(openApiDocument.paths["/cart"].get["x-status"]).toBe("planned");
    expect(openApiDocument.paths["/wishlist"].get["x-status"]).toBe("planned");
  });
});
