import { describe, expect, it } from "vitest";
import { computeTotals, normalizePkPhone } from "./format";

describe("Pakistani phone numbers", () => {
  it("accepts 03XX formats and +92 formats, normalising to 03XXXXXXXXX", () => {
    expect(normalizePkPhone("0300-1234567")).toBe("03001234567");
    expect(normalizePkPhone("+92 300 1234567")).toBe("03001234567");
    expect(normalizePkPhone("3001234567")).toBe("03001234567");
  });
  it("rejects non-mobile or short numbers", () => {
    expect(normalizePkPhone("042-1234567")).toBeNull();
    expect(normalizePkPhone("0300123")).toBeNull();
  });
});

describe("Order totals", () => {
  it("adds the delivery fee to bundles without free delivery", () => {
    expect(computeTotals({ price: 1499, pieces: 1, free_delivery: false }, 2, 200)).toEqual({
      subtotal: 2998, delivery: 200, total: 3198, pieces: 2,
    });
  });
  it("skips the delivery fee for free-delivery bundles", () => {
    expect(computeTotals({ price: 3999, pieces: 3, free_delivery: true }, 1, 200).total).toBe(3999);
  });
});
