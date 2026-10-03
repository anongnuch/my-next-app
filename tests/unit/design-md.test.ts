import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { colorGroups, guardrails, loadDesignMd, stripMd, tableUnder } from "@/app/lib/design-md";

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(path.join(os.tmpdir(), "design-md-"));
  vi.spyOn(process, "cwd").mockReturnValue(dir);
});

afterEach(() => {
  vi.restoreAllMocks();
  rmSync(dir, { recursive: true, force: true });
});

function write(contents: string) {
  writeFileSync(path.join(dir, "DESIGN.md"), contents, "utf8");
}

const MINIMAL_FRONT_MATTER = [
  "---",
  "colors:",
  "  brand: \"#fdbc1f\"",
  "typography:",
  "  display-lg:",
  "    fontSize: 34px",
  "rounded:",
  "  md: 6px",
  "spacing:",
  "  sm: 8px",
  "components:",
  "  button: Primary action",
  "---",
  "",
  "## Do's and Don'ts",
  "",
  "### Do",
  "- Use the brand colour sparingly.",
  "",
  "### Don't",
  "- Introduce a second accent colour.",
  "",
  "## Colors",
  "",
  "### Brand & Accent",
  "- **Saffron** (`{colors.brand}` — `#fdbc1f`) — the single accent used for calls to action.",
].join("\n");

describe("loadDesignMd", () => {
  it("parses a well-formed document", async () => {
    write(MINIMAL_FRONT_MATTER);
    const { tokens, body } = await loadDesignMd();
    expect(tokens.colors.brand).toBe("#fdbc1f");
    expect(tokens.typography["display-lg"].fontSize).toBe("34px");
    expect(Array.isArray(body)).toBe(true);
  });

  it("throws when the file does not open with front matter", async () => {
    write("# Not front matter\n");
    await expect(loadDesignMd()).rejects.toThrow(/expected YAML front matter on line 1/);
  });

  it("throws when the front matter is never closed", async () => {
    write(["---", "colors:", "  brand: \"#fdbc1f\""].join("\n"));
    await expect(loadDesignMd()).rejects.toThrow(/front matter is never closed/);
  });

  it("throws when a required token group is missing", async () => {
    write(["---", "colors:", "  brand: \"#fdbc1f\"", "---"].join("\n"));
    await expect(loadDesignMd()).rejects.toThrow(/missing the "typography" block/);
  });

  it("throws on a line that is not a key: value pair", async () => {
    write(["---", "colors:", "  not a valid line", "---"].join("\n"));
    await expect(loadDesignMd()).rejects.toThrow(/cannot parse line/);
  });

  it("throws on an indent deeper than three levels", async () => {
    write(["---", "colors:", "  brand:", "    hex: \"#fdbc1f\"", "      extra: nope", "---"].join("\n"));
    await expect(loadDesignMd()).rejects.toThrow(/unexpected indent/);
  });

  it("throws when a group has both a scalar value and nested children", async () => {
    write(["---", "colors: flat-value", "  brand: \"#fdbc1f\"", "---"].join("\n"));
    await expect(loadDesignMd()).rejects.toThrow(/has a value and children/);
  });
});

describe("guardrails", () => {
  it("collects Do and Don't bullets", async () => {
    write(MINIMAL_FRONT_MATTER);
    const { body } = await loadDesignMd();
    const { dos, donts } = guardrails(body);
    expect(dos).toEqual(["Use the brand colour sparingly."]);
    expect(donts).toEqual(["Introduce a second accent colour."]);
  });
});

describe("colorGroups", () => {
  it("parses swatch bullets into structured entries", async () => {
    write(MINIMAL_FRONT_MATTER);
    const { body } = await loadDesignMd();
    const [group] = colorGroups(body);
    expect(group.name).toBe("Brand & Accent");
    expect(group.swatches[0]).toEqual({
      label: "Saffron",
      token: "brand",
      hex: "#fdbc1f",
      role: "the single accent used for calls to action.",
    });
  });
});

describe("tableUnder", () => {
  it("returns an empty table when the heading has none", async () => {
    write(MINIMAL_FRONT_MATTER);
    const { body } = await loadDesignMd();
    expect(tableUnder(body, "## No Such Heading")).toEqual({ headers: [], rows: [] });
  });
});

describe("stripMd", () => {
  it("removes backticks and bold markers", () => {
    expect(stripMd("the `{colors.brand}` token is **bold**")).toBe(
      "the {colors.brand} token is bold",
    );
  });
});
