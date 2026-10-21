import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { closeSync, openSync, readFileSync, readSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const pdf = join(root, "public", "resume.pdf");
const tex = join(root, "resume.tex");
const sidecar = join(root, "src", "data", "resume-source.sha256");

describe("public/resume.pdf", () => {
  it("exists and is a PDF", () => {
    const fd = openSync(pdf, "r");
    const buf = Buffer.alloc(5);
    readSync(fd, buf, 0, 5, 0);
    closeSync(fd);
    expect(buf.toString("latin1")).toBe("%PDF-");
  });

  it("was built from the current resume.tex", () => {
    const current = createHash("sha256")
      .update(readFileSync(tex))
      .digest("hex");
    const built = readFileSync(sidecar, "utf8").trim();
    expect(built, "resume.tex changed: run npm run resume").toBe(current);
  });
});
