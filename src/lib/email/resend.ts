// Outgoing mail via the Resend HTTP API.
//
// SERVER-ONLY: reads RESEND_API_KEY from process.env. Import this module
// dynamically inside server-function handlers only (like supabaseAdmin) —
// never from client components, so the key can never end up in browser code.
//
// FAIL-SOFT by design: every function here returns a result object and never
// throws. A missing key, a network error or a Resend rejection is logged and
// swallowed — an order or an admin action must never fail because an email
// couldn't be sent.
import type { Database } from "@/integrations/supabase/types";
import {
  orderConfirmationEmail,
  orderStatusEmail,
  ownerNewOrderEmail,
  type EasypaisaDetails,
  type OrderEmailData,
  type StatusKind,
} from "./templates";

const RESEND_URL = "https://api.resend.com/emails";
const FROM = "RoseCare <orders@rosecare.store>";
const SEND_TIMEOUT_MS = 8000;

// Free-tier guard: Resend's free plan allows 100 emails/day. EVERY send
// attempt is logged with its outcome, and an in-memory counter tracks how
// many successful sends went out today (UTC) so a spike is visible in the
// Vercel function logs. Serverless instances are ephemeral, so the counter
// is approximate — the authoritative count is the Resend dashboard. No hard
// cap is enforced here: dropping a customer's receipt to protect the quota
// would be worse than the quota itself, and the owner can see the spike in
// the logs and raise the plan.
const FREE_TIER_DAILY_LIMIT = 100;
let dailyCount = 0;
let dailyDate = "";

function logSend(opts: {
  to: string;
  kind: string;
  ok: boolean;
  id?: string;
  error?: string;
}): void {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== dailyDate) {
    dailyDate = today;
    dailyCount = 0;
  }
  if (opts.ok) dailyCount += 1;
  console.log(
    `[email] to=${opts.to} kind=${opts.kind} ok=${opts.ok} id=${opts.id ?? "-"} error=${opts.error ?? "-"} daily=${dailyCount}/${FREE_TIER_DAILY_LIMIT}`,
  );
  if (dailyCount === 80) {
    console.warn("[email] 80/100 free-tier emails used today — check the Resend dashboard");
  }
  if (dailyCount >= FREE_TIER_DAILY_LIMIT) {
    console.warn("[email] 100/100 free-tier emails used today — further sends may be rejected by Resend");
  }
}

/** Test-only: reset the daily counter. */
export function resetEmailDailyCount(): void {
  dailyCount = 0;
  dailyDate = "";
}

export type SendEmailResult = { ok: true; id?: string } | { ok: false; error: string };

export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

/** Map a database order row to the shape the email templates need.
 *  codAdvance is the COD fee from store_settings (Rs 400) — passed by the
 *  caller when it has the settings row; it defaults to 400 so a missing
 *  settings read can never zero out the advance in an email. */
export function orderRowToEmailData(row: OrderRow, codAdvance = 400): OrderEmailData {
  return {
    order_number: row.order_number,
    customer_name: row.customer_name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    address: row.address,
    notes: row.notes,
    bundle_name: row.bundle_name,
    bundle_pieces: row.bundle_pieces,
    quantity: row.quantity,
    total_pieces: row.total_pieces,
    subtotal: row.subtotal,
    delivery_fee: row.delivery_fee,
    total: row.total,
    payment_method: row.payment_method,
    cod_advance: codAdvance,
    payment_status: row.payment_status,
    status: row.status,
    easypaisa_txn_id: row.easypaisa_txn_id,
    easypaisa_sender_number: row.easypaisa_sender_number,
    payment_proof_path: row.payment_proof_path,
    admin_note: row.admin_note,
    tracking_number: row.tracking_number,
    created_at: row.created_at,
  };
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  /** Label for the logs, e.g. "order-confirmation", "owner-alert", "status:shipped". */
  kind?: string;
  fetchImpl?: typeof fetch;
}): Promise<SendEmailResult> {
  const kind = opts.kind ?? "email";
  const key = process.env["RESEND_API_KEY"];
  if (!key) {
    logSend({ to: opts.to, kind, ok: false, error: "RESEND_API_KEY not configured" });
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }
  try {
    const res = await (opts.fetchImpl ?? fetch)(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        text: opts.text ?? "",
      }),
      // AbortSignal.timeout is missing in some runtimes — send without a
      // timeout there rather than crashing.
      signal:
        typeof AbortSignal.timeout === "function"
          ? AbortSignal.timeout(SEND_TIMEOUT_MS)
          : undefined,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      logSend({ to: opts.to, kind, ok: false, error: `Resend HTTP ${res.status}` });
      return { ok: false, error: `Resend HTTP ${res.status}` };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: unknown };
    const id = typeof data.id === "string" ? data.id : undefined;
    logSend({ to: opts.to, kind, ok: true, id });
    return { ok: true, id };
  } catch (err) {
    const error = err instanceof Error ? err.message : "send failed";
    logSend({ to: opts.to, kind, ok: false, error });
    return { ok: false, error };
  }
}

/**
 * Decide which status email (if any) a change deserves, from the order's
 * CURRENT state plus what it looked like before the admin saved. Pure.
 *
 * ONLY a status or payment_status change sends mail. Adding a courier
 * tracking number to an already-shipped order is NOT a status change, so it
 * sends nothing — the customer already got the "shipped" email.
 */
export function deriveStatusKind(
  order: { status: string; payment_status: string },
  prevStatus: string,
  prevPaymentStatus: string,
): StatusKind | null {
  const statusChanged = order.status !== prevStatus;
  const paymentChanged = order.payment_status !== prevPaymentStatus;
  // Reject sets payment rejected AND status cancelled at once — the payment
  // email (with the admin's reason) is the one the customer needs.
  if (order.payment_status === "rejected" && paymentChanged) return "rejected";
  if (order.status === "cancelled" && statusChanged) return "cancelled";
  if (order.status === "delivered" && statusChanged) return "delivered";
  if (order.status === "shipped" && statusChanged) return "shipped";
  // Approving verifies the payment; if the order was already past "pending"
  // this is still the "payment verified / order confirmed" email.
  if (order.payment_status === "verified" && paymentChanged) return "confirmed";
  if (order.status === "confirmed" && statusChanged) return "confirmed";
  if (order.status === "processing" && statusChanged) return "processing";
  return null;
}

/**
 * Send the status email a change deserves (or none). Used by the admin
 * notify server function after it has verified the caller and re-read the
 * order. Never throws; returns what (if anything) was sent.
 */
export async function sendStatusEmailForOrder(opts: {
  order: OrderEmailData;
  prevStatus: string;
  prevPaymentStatus: string;
  fetchImpl?: typeof fetch;
}): Promise<{ sent: boolean; kind: StatusKind | null }> {
  const kind = deriveStatusKind(opts.order, opts.prevStatus, opts.prevPaymentStatus);
  if (!kind || !opts.order.email) return { sent: false, kind };
  const email = orderStatusEmail(opts.order, kind);
  const res = await sendEmail({
    to: opts.order.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
    kind: `status:${kind}`,
    fetchImpl: opts.fetchImpl,
  });
  if (!res.ok) {
    console.error("[email] status email failed for", opts.order.order_number, res.error);
  }
  return { sent: res.ok, kind };
}

export async function sendOrderPlacedEmails(opts: {
  order: OrderEmailData;
  easypaisa: EasypaisaDetails;
  ownerEmail?: string;
  /** Set false when the order's confirmation was already claimed/sent, so a
   *  retried placeOrder never sends a duplicate receipt. Defaults true. */
  sendConfirmation?: boolean;
  fetchImpl?: typeof fetch;
}): Promise<{ confirmation: SendEmailResult | null; ownerAlert: SendEmailResult | null }> {
  const out: { confirmation: SendEmailResult | null; ownerAlert: SendEmailResult | null } = {
    confirmation: null,
    ownerAlert: null,
  };
  if (opts.order.email && opts.sendConfirmation !== false) {
    const email = orderConfirmationEmail(opts.order, opts.easypaisa);
    out.confirmation = await sendEmail({
      to: opts.order.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
      kind: "order-confirmation",
      fetchImpl: opts.fetchImpl,
    });
    if (!out.confirmation.ok) {
      console.error(
        "[email] order confirmation failed for",
        opts.order.order_number,
        out.confirmation.error,
      );
    }
  }
  const owner = opts.ownerEmail?.trim();
  if (owner) {
    const email = ownerNewOrderEmail(opts.order, opts.easypaisa);
    out.ownerAlert = await sendEmail({
      to: owner,
      subject: email.subject,
      html: email.html,
      text: email.text,
      kind: "owner-alert",
      fetchImpl: opts.fetchImpl,
    });
    if (!out.ownerAlert.ok) {
      console.error(
        "[email] owner new-order alert failed for",
        opts.order.order_number,
        out.ownerAlert.error,
      );
    }
  }
  return out;
}
