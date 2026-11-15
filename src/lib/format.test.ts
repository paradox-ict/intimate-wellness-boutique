import { describe, expect, it } from "vitest";
import { computeTotals, formatPkPhoneDisplay, normalizePkPhone } from "./format";

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
  it("formats digits as the user types", () => {
    expect(formatPkPhoneDisplay("0300")).toBe("0300");
    expect(formatPkPhoneDisplay("03001234567")).toBe("0300 1234567");
    expect(formatPkPhoneDisplay("0300 1234 56789")).toBe("0300 1234567");
  });
});

describe("Order totals", () => {
  const fees = { cod: 400, easypaisa: 300 };

  it("COD Single: price + Rs 400 delivery, advance Rs 400, balance = product price", () => {
    expect(computeTotals({ price: 1950, pieces: 1, free_delivery: false }, 1, fees, "cod")).toEqual({
      subtotal: 1950,
      delivery: 400,
      total: 2350,
      pieces: 1,
      advanceDue: 400,
      balanceDue: 1950,
    });
  });
  it("Easypaisa Single: price + Rs 300 delivery, full total due now, nothing on delivery", () => {
    expect(
      computeTotals({ price: 1950, pieces: 1, free_delivery: false }, 1, fees, "easypaisa"),
    ).toEqual({
      subtotal: 1950,
      delivery: 300,
      total: 2250,
      pieces: 1,
      advanceDue: 2250,
      balanceDue: 0,
    });
  });
  it("COD Double x2: fee stays flat per order, not per pack", () => {
    expect(computeTotals({ price: 3450, pieces: 2, free_delivery: false }, 2, fees, "cod")).toEqual({
      subtotal: 6900,
      delivery: 400,
      total: 7300,
      pieces: 4,
      advanceDue: 400,
      balanceDue: 6900,
    });
  });
  it("Easypaisa Double: fee is Rs 300 even on a bigger pack", () => {
    expect(
      computeTotals({ price: 3450, pieces: 2, free_delivery: false }, 1, fees, "easypaisa"),
    ).toEqual({
      subtotal: 3450,
      delivery: 300,
      total: 3750,
      pieces: 2,
      advanceDue: 3750,
      balanceDue: 0,
    });
  });
  it("COD Trio (free delivery): total stays the pack price, Rs 400 advance comes off it", () => {
    expect(computeTotals({ price: 4850, pieces: 3, free_delivery: true }, 1, fees, "cod")).toEqual({
      subtotal: 4850,
      delivery: 0,
      total: 4850,
      pieces: 3,
      advanceDue: 400,
      balanceDue: 4450,
    });
  });
  it("Easypaisa Trio (free delivery): no delivery fee, full pack price due now", () => {
    expect(
      computeTotals({ price: 4850, pieces: 3, free_delivery: true }, 1, fees, "easypaisa"),
    ).toEqual({
      subtotal: 4850,
      delivery: 0,
      total: 4850,
      pieces: 3,
      advanceDue: 4850,
      balanceDue: 0,
    });
  });
  it("COD Trio x2 (free delivery): advance stays Rs 400 per order, balance = total − 400", () => {
    expect(computeTotals({ price: 4850, pieces: 3, free_delivery: true }, 2, fees, "cod")).toEqual({
      subtotal: 9700,
      delivery: 0,
      total: 9700,
      pieces: 6,
      advanceDue: 400,
      balanceDue: 9300,
    });
  });
});
