import { describe, expect, it } from "vitest";
import { resolveTrackStart } from "./track-start";

describe("resolveTrackStart", () => {
  it("URL order + phone auto-runs the lookup with both fields filled", () => {
    expect(
      resolveTrackStart(
        { order: "SK-329257", phone: "03187166226" },
        null,
      ),
    ).toEqual({ orderNumber: "SK-329257", phone: "0318 7166226", autoRun: true });
  });

  it("?id= works as an alias for ?order=", () => {
    expect(resolveTrackStart({ id: "SK-329257", phone: "03187166226" }, null)).toEqual({
      orderNumber: "SK-329257",
      phone: "0318 7166226",
      autoRun: true,
    });
  });

  it("URL order without a phone only pre-fills the order, no auto-run", () => {
    expect(resolveTrackStart({ order: "SK-329257" }, null)).toEqual({
      orderNumber: "SK-329257",
      phone: "",
      autoRun: false,
    });
  });

  it("an invalid phone in the URL never auto-runs", () => {
    expect(resolveTrackStart({ order: "SK-329257", phone: "123" }, null)).toEqual({
      orderNumber: "SK-329257",
      phone: "123",
      autoRun: false,
    });
  });

  it("a +92 phone in the URL normalises to 03XX and auto-runs", () => {
    expect(resolveTrackStart({ order: "SK-329257", phone: "+923187166226" }, null)).toEqual({
      orderNumber: "SK-329257",
      phone: "0318 7166226",
      autoRun: true,
    });
  });

  it("with no URL params, falls back to the last order in this tab", () => {
    expect(
      resolveTrackStart({}, { orderNumber: "SK-ABC123", phone: "03001234567" }),
    ).toEqual({ orderNumber: "SK-ABC123", phone: "03001234567", autoRun: true });
  });

  it("URL params win over the stored last order", () => {
    expect(
      resolveTrackStart(
        { order: "SK-329257", phone: "03187166226" },
        { orderNumber: "SK-OLD111", phone: "03001234567" },
      ),
    ).toEqual({ orderNumber: "SK-329257", phone: "0318 7166226", autoRun: true });
  });

  it("nothing stored and no params starts empty with no auto-run", () => {
    expect(resolveTrackStart({}, null)).toEqual({ orderNumber: "", phone: "", autoRun: false });
  });
});
