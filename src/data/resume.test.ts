import { describe, expect, it } from "vitest";
import { closeSync, openSync, readSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const pdf = join(root, "public", "resume.pdf");
const tex = join(root, "resume.tex");

describe("public/resume.pdf", () => {
  it("exists and is a PDF", () => {
    const fd = openSync(pdf, "r");
    const buf = Buffer.alloc(5);
    readSync(fd, buf, 0, 5, 0);
    closeSync(fd);
    expect(buf.toString("latin1")).toBe("%PDF-");
  });

  it("is not older than resume.tex (run npm run resume)", () => {
    expect(statSync(pdf).mtimeMs).toBeGreaterThanOrEqual(statSync(tex).mtimeMs);
  });
});
