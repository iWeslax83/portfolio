import { describe, expect, it } from "vitest";
import { filterFromSearch, searchForFilter } from "./catalog-filter";

describe("filterFromSearch", () => {
  it("reads the status param, any case, dashes for underscores", () => {
    expect(filterFromSearch("?status=shipped")).toBe("SHIPPED");
    expect(filterFromSearch("?status=in-progress")).toBe("IN_PROGRESS");
    expect(filterFromSearch("?status=ARCHIVED")).toBe("ARCHIVED");
  });

  it("falls back to ALL for a missing or unknown value", () => {
    expect(filterFromSearch("")).toBe("ALL");
    expect(filterFromSearch("?status=nope")).toBe("ALL");
    expect(filterFromSearch("?other=1")).toBe("ALL");
  });
});

describe("searchForFilter", () => {
  it("writes the status param and keeps other params", () => {
    expect(searchForFilter("", "IN_PROGRESS")).toBe("?status=in-progress");
    expect(searchForFilter("?a=1", "SHIPPED")).toBe("?a=1&status=shipped");
  });

  it("drops the param for ALL", () => {
    expect(searchForFilter("?status=shipped", "ALL")).toBe("");
    expect(searchForFilter("?a=1&status=shipped", "ALL")).toBe("?a=1");
  });
});
