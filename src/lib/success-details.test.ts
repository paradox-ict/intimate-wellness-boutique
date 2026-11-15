import { describe, expect, it } from "vitest";
import { trackedToSuccessDetails } from "./success-details";
import type { TrackedOrder } from "./store.functions";

function makeTracked(over: Partial<TrackedOrder>): TrackedOrder {
  return {
    order_number: "SK-329257",
    status: "pending",
    payment_status: "pending_verification",
    payment_method: "cod",
    bundle_name: "Trio",
    quantity: 1,
    total_pieces: 3,
    subtotal: 4850,
    delivery_fee: 0,
    total: 4850,
    advance_due: 400,
    balance_due: 4450,
    city: "Rawalpindi",
    tracking_number: null,
    created_at: "2026-11-15T12:00:00.000Z",
    events: [],
    ...over,
  };
}

describe("trackedToSuccessDetails (order-success fallback)", () => {
  it("maps a free-delivery Trio COD order: advance 400 off the pack price", () => {
    expect(trackedToSuccessDetails(makeTracked({}), "03187166226")).toEqual({
      total: 4850,
      paymentMethod: "cod",
      phone: "03187166226",
      advanceDue: 400,
      balanceDue: 4450,
      freeDelivery: true,
    });
  });

  it("maps a paid-delivery Single COD order: advance 400 is the delivery charge", () => {
    expect(
      trackedToSuccessDetails(
        makeTracked({
          bundle_name: "Single",
          total_pieces: 1,
          subtotal: 1950,
          delivery_fee: 400,
          total: 2350,
          balance_due: 1950,
        }),
        "03187166226",
      ),
    ).toEqual({
      total: 2350,
      paymentMethod: "cod",
      phone: "03187166226",
      advanceDue: 400,
      balanceDue: 1950,
      freeDelivery: false,
    });
  });

  it("maps an Easypaisa order: full total paid, no balance, no free-delivery flag", () => {
    expect(
      trackedToSuccessDetails(
        makeTracked({
          payment_method: "easypaisa",
          delivery_fee: 300,
          total: 5150,
          advance_due: 5150,
          balance_due: 0,
        }),
        "03187166226",
      ),
    ).toEqual({
      total: 5150,
      paymentMethod: "easypaisa",
      phone: "03187166226",
      advanceDue: 5150,
      balanceDue: 0,
      freeDelivery: false,
    });
  });
});
