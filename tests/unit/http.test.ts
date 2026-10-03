import { describe, expect, it } from "vitest";
import { boolParam, intParam, jsonError } from "@/app/lib/http";

describe("jsonError", () => {
  it("builds a JSON response with the given status and body", async () => {
    const response = jsonError(404, "not_found", "No collection with that slug.", { slug: "x" });
    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      code: "not_found",
      message: "No collection with that slug.",
      details: { slug: "x" },
    });
  });

  it("defaults details to null when omitted", async () => {
    const response = jsonError(400, "invalid_sort", "sort must be one of ...");
    await expect(response.json()).resolves.toEqual({
      code: "invalid_sort",
      message: "sort must be one of ...",
      details: null,
    });
  });
});

describe("boolParam", () => {
  it.each([
    ["true", true],
    ["1", true],
    ["false", false],
    ["0", false],
    ["yes", false],
    [null, false],
  ])("boolParam(%j) === %j", (input, expected) => {
    expect(boolParam(input)).toBe(expected);
  });
});

describe("intParam", () => {
  it.each([
    ["5", 10, 5],
    [null, 10, 10],
    ["abc", 7, 7],
    ["3.9", 0, 3],
    ["-2", 0, -2],
  ])("intParam(%j, %j) === %j", (input, fallback, expected) => {
    expect(intParam(input, fallback)).toBe(expected);
  });
});
