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

export type BundleForPricing = { price: number; pieces: number };

export type DeliveryFees = { cod: number; easypaisa: number };

export type PaymentMethod = "cod" | "easypaisa";

/**
 * Mirrors the server-side pricing in the place_order database function.
 * The delivery fee depends on how the customer pays, flat per order:
 * COD pays Rs 400 now via Easypaisa (that IS the delivery charge) and the
 * product price in cash on delivery; Easypaisa prepaid pays Rs 300 delivery
 * as part of the full total up front. Free delivery is retired — every pack
 * pays the fee for its payment method.
 */
export function computeTotals(
  bundle: BundleForPricing,
  quantity: number,
  fees: DeliveryFees,
  method: PaymentMethod,
) {
  const subtotal = bundle.price * quantity;
  const delivery = method === "cod" ? fees.cod : fees.easypaisa;
  const total = subtotal + delivery;
  return {
    subtotal,
    delivery,
    total,
    pieces: bundle.pieces * quantity,
    // Amount the customer must send via Easypaisa right now to confirm.
    advanceDue: method === "cod" ? delivery : total,
    // Amount left to pay in cash when the parcel arrives (COD only).
    balanceDue: method === "cod" ? subtotal : 0,
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
