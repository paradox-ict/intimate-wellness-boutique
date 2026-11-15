import type { TrackedOrder } from "./store.functions";

/** The payment breakdown the success page shows, from a fetched order. */
export type SuccessDetails = {
  total: number;
  paymentMethod: "cod" | "easypaisa";
  phone: string;
  advanceDue: number;
  balanceDue: number;
  /** True when the Rs 400 COD advance came off the pack price (free-delivery pack). */
  freeDelivery: boolean;
};

/**
 * Map a trackOrder result to the success page's breakdown, for the
 * sessionStorage-miss fallback (reload / new tab / shared link). The
 * advance / balance come from the server (trackOrder), never re-derived
 * here. delivery_fee is 0 exactly on a free-delivery pack — the same
 * derivation OrderTimeline uses — so a COD order with delivery_fee 0 is
 * a free-delivery pack.
 */
export function trackedToSuccessDetails(order: TrackedOrder, phone: string): SuccessDetails {
  return {
    total: order.total,
    paymentMethod: order.payment_method === "easypaisa" ? "easypaisa" : "cod",
    phone,
    advanceDue: order.advance_due,
    balanceDue: order.balance_due,
    freeDelivery: order.payment_method === "cod" && order.delivery_fee === 0,
  };
}
