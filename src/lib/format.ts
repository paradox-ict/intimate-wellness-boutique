export function formatPKR(amount: number) {
  return `Rs ${Math.round(amount).toLocaleString("en-PK")}`;
}

/** Formats digits as the user types: 0300 1234567. Keeps at most 11 digits. */
export function formatPkPhoneDisplay(input: string): string {
  const d = input.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 4) return d;
  return `${d.slice(0, 4)} ${d.slice(4)}`;
}

/** Normalises Pakistani mobile numbers to 03XXXXXXXXX. Returns null when invalid. */
export function normalizePkPhone(input: string): string | null {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("0092")) d = d.slice(4);
  if (d.startsWith("92") && d.length === 12) d = d.slice(2);
  if (d.length === 10 && d.startsWith("3")) d = "0" + d;
  return /^03\d{9}$/.test(d) ? d : null;
}

export type BundleForPricing = { price: number; pieces: number; free_delivery: boolean };

export type DeliveryFees = { cod: number; easypaisa: number };

export type PaymentMethod = "cod" | "easypaisa";

/**
 * Mirrors the server-side pricing in the place_order database function.
 * The delivery fee depends on how the customer pays, flat per order — and
 * on the bundle's free_delivery flag:
 * - Free-delivery pack (Trio): no delivery fee at all. COD still needs the
 *   Rs 400 Easypaisa advance to confirm, but it is DEDUCTED FROM THE PACK
 *   PRICE — the total stays the pack price, balance = total − 400.
 * - Other packs: COD total = price + Rs 400 (the Rs 400 IS the delivery
 *   charge, paid now via Easypaisa; balance = product price in cash on
 *   delivery); Easypaisa prepaid total = price + Rs 300, all due now.
 * Unified: COD advanceDue is always the COD fee (Rs 400), balanceDue =
 * total − advanceDue; Easypaisa advanceDue is the full total, balance 0.
 */
export function computeTotals(
  bundle: BundleForPricing,
  quantity: number,
  fees: DeliveryFees,
  method: PaymentMethod,
) {
  const subtotal = bundle.price * quantity;
  const delivery = bundle.free_delivery ? 0 : method === "cod" ? fees.cod : fees.easypaisa;
  const total = subtotal + delivery;
  return {
    subtotal,
    delivery,
    total,
    pieces: bundle.pieces * quantity,
    // Amount the customer must send via Easypaisa right now to confirm.
    advanceDue: method === "cod" ? fees.cod : total,
    // Amount left to pay in cash when the parcel arrives (COD only).
    balanceDue: method === "cod" ? total - fees.cod : 0,
  };
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Order received",
  confirmed: "Confirmed",
  processing: "Packing discreetly",
  shipped: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  not_required: "Pay on delivery",
  pending_verification: "Verifying payment",
  verified: "Payment verified",
  rejected: "Payment rejected",
};
