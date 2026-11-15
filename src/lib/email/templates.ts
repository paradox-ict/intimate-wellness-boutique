// Branded RoseCare emails — pure functions, no I/O, safe to import anywhere.
// All HTML uses inline styles only (email clients strip <style> blocks).
// Every template returns a plain-text fallback too.
import { formatDisplayAddress, formatPKR } from "../format";
import { SITE_URL } from "../site";
import { WHATSAPP_URL } from "../whatsapp";

export type OrderEmailData = {
  order_number: string;
  customer_name: string;
  email: string | null;
  phone: string;
  city: string;
  address: string;
  notes: string | null;
  bundle_name: string;
  bundle_pieces: number;
  quantity: number;
  total_pieces: number;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: "cod" | "easypaisa";
  // The Rs 400 COD confirmation advance (the COD delivery fee from
  // settings). It is NOT the same as delivery_fee: on a free-delivery pack
  // delivery_fee is 0, but the advance is still Rs 400 — deducted from the
  // pack price instead of added as a charge. Templates must use this for
  // the advance and (total − cod_advance) for the COD balance.
  cod_advance: number;
  payment_status: string;
  status: string;
  easypaisa_txn_id: string | null;
  easypaisa_sender_number: string | null;
  payment_proof_path: string | null;
  admin_note: string | null;
  tracking_number: string | null;
  created_at: string;
};

export type EasypaisaDetails = { accountName: string; accountNumber: string };

export type BuiltEmail = { subject: string; html: string; text: string };

export type StatusKind =
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "rejected"
  | "cancelled";

/** Escape user-supplied text before it goes into HTML. */
export function esc(v: string | null | undefined): string {
  return (v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const LOGO_URL = `${SITE_URL}/images/rosecare-logo-email.png`;
const TRACK_URL = (orderNumber: string, phone: string) =>
  `${SITE_URL}/track?order=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`;

function orderDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" });
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

function paymentLabel(method: "cod" | "easypaisa"): string {
  return method === "cod" ? "Cash on Delivery" : "Easypaisa";
}

function layout(opts: { preheader: string; body: string }): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;padding:0;background-color:#f7efe8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#3d2b33;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7efe8;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background-color:#fffdf9;border:1px solid #ead9ce;border-radius:18px;overflow:hidden;">
<tr><td style="padding:28px 28px 8px;text-align:center;">
<img src="${LOGO_URL}" alt="RoseCare" width="140" style="display:block;margin:0 auto;">
<p style="margin:6px 0 0;font-size:12px;letter-spacing:3px;color:#9a8a93;">DISCREET INTIMATE CARE</p>
</td></tr>
<tr><td style="padding:12px 28px 8px;">${opts.body}</td></tr>
<tr><td style="padding:8px 28px 28px;">
<hr style="border:none;border-top:1px solid #ead9ce;margin:16px 0;">
<p style="margin:0 0 10px;text-align:center;font-size:14px;">
<a href="${WHATSAPP_URL}" style="color:#c2185b;text-decoration:none;font-weight:600;">Message us on WhatsApp</a>
&nbsp;·&nbsp;
<a href="${SITE_URL}" style="color:#c2185b;text-decoration:none;font-weight:600;">Visit RoseCare</a>
</p>
<p style="margin:0;text-align:center;font-size:12px;line-height:1.6;color:#9a8a93;">RoseCare — gentle herbal intimate care, delivered in plain packaging across Pakistan.<br>This email was sent about your RoseCare order. Please don&apos;t reply to this email — message us on WhatsApp instead.</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function button(url: string, label: string): string {
  return `<p style="text-align:center;margin:22px 0;"><a href="${url}" style="display:inline-block;background-color:#c2185b;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 30px;border-radius:999px;">${esc(label)}</a></p>`;
}

function itemsTable(o: OrderEmailData): string {
  const isCod = o.payment_method === "cod";
  // The delivery fee is 0 exactly when the pack ships free (place_order
  // charges 0 for free_delivery bundles). The COD advance is still
  // Rs 400 — it just comes off the pack price instead of being added.
  const free = o.delivery_fee === 0;
  const deliveryCell = free
    ? `<span style="font-weight:700;color:#3d7a5c;">Free</span>`
    : formatPKR(o.delivery_fee);
  const advanceLabel = free ? "Advance (deducted from pack price)" : "Advance paid now (Easypaisa)";
  const codBalance = o.total - o.cod_advance;
  // Full price breakdown — the customer always sees what is due now and
  // what (if anything) is still due on delivery.
  const splitRows = isCod
    ? `<tr><td style="padding:12px 16px;color:#7d6a72;">${advanceLabel}</td><td style="padding:12px 16px;text-align:right;white-space:nowrap;"><strong>${formatPKR(o.cod_advance)}</strong></td></tr>
<tr><td style="padding:12px 16px;color:#7d6a72;">Pay on delivery (cash)</td><td style="padding:12px 16px;text-align:right;white-space:nowrap;"><strong>${formatPKR(codBalance)}</strong></td></tr>`
    : `<tr><td style="padding:12px 16px;color:#7d6a72;">Paid now (Easypaisa)</td><td style="padding:12px 16px;text-align:right;white-space:nowrap;"><strong>${formatPKR(o.total)}</strong></td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ead9ce;border-radius:12px;overflow:hidden;font-size:15px;">
<tr><td style="padding:14px 16px;border-bottom:1px solid #ead9ce;"><strong>Herbal Tightening Gel</strong><br><span style="color:#7d6a72;font-size:13px;">${esc(o.bundle_name)} pack · ${o.bundle_pieces} applicator${o.bundle_pieces > 1 ? "s" : ""} × ${o.quantity}</span></td><td style="padding:14px 16px;border-bottom:1px solid #ead9ce;text-align:right;white-space:nowrap;">${formatPKR(o.subtotal)}</td></tr>
<tr><td style="padding:12px 16px;color:#7d6a72;">Delivery${isCod ? " (COD)" : " (Easypaisa)"}</td><td style="padding:12px 16px;text-align:right;white-space:nowrap;">${deliveryCell}</td></tr>
${splitRows}
<tr><td style="padding:14px 16px;border-top:1px solid #ead9ce;font-size:17px;"><strong>Total</strong></td><td style="padding:14px 16px;border-top:1px solid #ead9ce;text-align:right;font-size:17px;white-space:nowrap;"><strong>${formatPKR(o.total)}</strong></td></tr>
</table>`;
}

function itemsText(o: OrderEmailData): string {
  const free = o.delivery_fee === 0;
  const advanceLabel = free ? "Advance (deducted from pack price)" : "Advance paid now (Easypaisa)";
  const split =
    o.payment_method === "cod"
      ? [
          `${advanceLabel}: ${formatPKR(o.cod_advance)}`,
          `Pay on delivery (cash): ${formatPKR(o.total - o.cod_advance)}`,
        ]
      : [`Paid now (Easypaisa): ${formatPKR(o.total)}`];
  return [
    `Herbal Tightening Gel — ${o.bundle_name} pack (${o.bundle_pieces} applicators) x ${o.quantity}: ${formatPKR(o.subtotal)}`,
    `Delivery: ${free ? "Free" : formatPKR(o.delivery_fee)}`,
    ...split,
    `Total: ${formatPKR(o.total)}`,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// 1. Order confirmation (customer)
// ---------------------------------------------------------------------------

export function orderConfirmationEmail(
  o: OrderEmailData,
  easypaisa: EasypaisaDetails,
): BuiltEmail {
  const subject = `Your RoseCare order ${o.order_number} is confirmed`;
  const trackUrl = TRACK_URL(o.order_number, o.phone);
  const date = orderDate(o.created_at);

  const free = o.delivery_fee === 0;
  const codBalance = o.total - o.cod_advance;

  // Email version of the real Easypaisa lockup (white wordmark on a baked-in
  // dark-navy pill, transparent outside) — the dark-navy original is nearly
  // invisible in Gmail dark mode. Served from the site so it renders in
  // every mail client that loads remote images.
  const easypaisaLogo = `<img src="${SITE_URL}/images/easypaisa-logo-email.png" alt="Easypaisa" width="90" style="display:block;height:auto;margin:0 0 10px;" />`;

  const paymentHtml =
    o.payment_method === "cod"
      ? free
        ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf2f5;border:1px solid #f3c6d4;border-radius:12px;font-size:15px;"><tr><td style="padding:14px 16px;">
${easypaisaLogo}
<p style="margin:0 0 6px;"><strong>Payment:</strong> Cash on Delivery — first send the <strong>${formatPKR(o.cod_advance)} advance</strong> via Easypaisa to confirm your order. Delivery is <strong>free</strong> on this pack, so the advance comes off your pack price — it is not an extra charge:</p>
<p style="margin:0;font-size:17px;"><strong>${esc(easypaisa.accountNumber)}</strong> · ${esc(easypaisa.accountName)}</p>
${o.easypaisa_txn_id ? `<p style="margin:8px 0 0;color:#7d6a72;font-size:13px;">Transaction ID: ${esc(o.easypaisa_txn_id)}</p>` : ""}
<p style="margin:8px 0 0;color:#7d6a72;font-size:13px;">Then pay only <strong>${formatPKR(codBalance)}</strong> in cash when your parcel arrives. We&apos;re verifying your advance now — you&apos;ll get another email as soon as it&apos;s confirmed.</p>
</td></tr></table>`
        : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf2f5;border:1px solid #f3c6d4;border-radius:12px;font-size:15px;"><tr><td style="padding:14px 16px;">
${easypaisaLogo}
<p style="margin:0 0 6px;"><strong>Payment:</strong> Cash on Delivery — first send the <strong>${formatPKR(o.cod_advance)} delivery charge</strong> via Easypaisa to confirm your order:</p>
<p style="margin:0;font-size:17px;"><strong>${esc(easypaisa.accountNumber)}</strong> · ${esc(easypaisa.accountName)}</p>
${o.easypaisa_txn_id ? `<p style="margin:8px 0 0;color:#7d6a72;font-size:13px;">Transaction ID: ${esc(o.easypaisa_txn_id)}</p>` : ""}
<p style="margin:8px 0 0;color:#7d6a72;font-size:13px;">Then pay only <strong>${formatPKR(codBalance)}</strong> in cash when your parcel arrives. We&apos;re verifying your advance now — you&apos;ll get another email as soon as it&apos;s confirmed.</p>
</td></tr></table>`
      : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf2f5;border:1px solid #f3c6d4;border-radius:12px;font-size:15px;"><tr><td style="padding:14px 16px;">
${easypaisaLogo}
<p style="margin:0 0 6px;"><strong>Payment:</strong> Easypaisa — ${formatPKR(o.total)} to</p>
<p style="margin:0;font-size:17px;"><strong>${esc(easypaisa.accountNumber)}</strong> · ${esc(easypaisa.accountName)}</p>
${o.easypaisa_txn_id ? `<p style="margin:8px 0 0;color:#7d6a72;font-size:13px;">Transaction ID: ${esc(o.easypaisa_txn_id)}</p>` : ""}
<p style="margin:8px 0 0;color:#7d6a72;font-size:13px;">We&apos;re verifying your payment now — you&apos;ll get another email as soon as it&apos;s confirmed.</p>
</td></tr></table>`;

  const paymentText =
    o.payment_method === "cod"
      ? [
          free
            ? `Payment: Cash on Delivery — first send the ${formatPKR(o.cod_advance)} advance via Easypaisa to ${easypaisa.accountNumber} (${easypaisa.accountName}) to confirm your order. Delivery is free on this pack, so the advance comes off your pack price — it is not an extra charge.`
            : `Payment: Cash on Delivery — first send the ${formatPKR(o.cod_advance)} delivery charge via Easypaisa to ${easypaisa.accountNumber} (${easypaisa.accountName}) to confirm your order.`,
          o.easypaisa_txn_id ? `Transaction ID: ${o.easypaisa_txn_id}` : "",
          `Then pay only ${formatPKR(codBalance)} in cash when your parcel arrives. We're verifying your advance now — you'll get another email as soon as it's confirmed.`,
        ]
          .filter(Boolean)
          .join("\n")
      : [
          `Payment: Easypaisa — ${formatPKR(o.total)} to ${easypaisa.accountNumber} (${easypaisa.accountName}).`,
          o.easypaisa_txn_id ? `Transaction ID: ${o.easypaisa_txn_id}` : "",
          "We're verifying your payment now — you'll get another email as soon as it's confirmed.",
        ]
          .filter(Boolean)
          .join("\n");

  const body = `
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;margin:8px 0 4px;font-weight:600;">Thank you, ${esc(firstName(o.customer_name))}!</h1>
<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Your order is confirmed. Here is your receipt — keep it safe.</p>
<p style="text-align:center;margin:18px 0;"><a href="${trackUrl}" style="text-decoration:none;color:inherit;"><span style="display:inline-block;background-color:#f7efe8;border:1px dashed #c2185b;border-radius:12px;padding:12px 22px 10px;text-align:center;"><span style="display:block;font-family:Georgia,'Times New Roman',serif;font-size:24px;letter-spacing:1px;color:#3d2b33;"><strong>${esc(o.order_number)}</strong></span><span style="display:block;margin-top:6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:12px;font-weight:600;color:#c2185b;">Tap to open your order — the number copies automatically</span></span></a></p>
${date ? `<p style="text-align:center;font-size:13px;color:#7d6a72;margin:0 0 4px;">Placed on ${esc(date)}</p>` : ""}
${button(trackUrl, "Track your order")}
${itemsTable(o)}
<div style="margin-top:18px;">${paymentHtml}</div>
<h2 style="font-family:Georgia,'Times New Roman',serif;font-size:18px;margin:22px 0 8px;">Delivering to</h2>
<p style="font-size:15px;line-height:1.6;margin:0;">${esc(o.customer_name)}<br>${esc(formatDisplayAddress(o.address, o.city))}<br>${esc(o.phone)}</p>
<h2 style="font-family:Georgia,'Times New Roman',serif;font-size:18px;margin:22px 0 8px;">What happens next</h2>
<ol style="font-size:15px;line-height:1.8;margin:0;padding-left:20px;">
<li>${o.payment_method === "cod" ? `We verify your ${formatPKR(o.cod_advance)} Easypaisa advance and confirm your order, then pack it discreetly in a plain, unbranded box.` : "We confirm your order and pack it discreetly in a plain, unbranded box."}</li>
<li>Your parcel ships within 2–4 working days, anywhere in Pakistan.</li>
<li>Track it any time with your order number and mobile number.</li>
</ol>`;

  const text = [
    `Thank you, ${firstName(o.customer_name)}!`,
    ``,
    `Your RoseCare order ${o.order_number} is confirmed.${date ? ` Placed on ${date}.` : ""}`,
    ``,
    `Track your order: ${trackUrl}`,
    ``,
    itemsText(o),
    ``,
    paymentText,
    ``,
    `Delivering to:`,
    `${o.customer_name}`,
    `${formatDisplayAddress(o.address, o.city)}`,
    `${o.phone}`,
    ``,
    `What happens next:`,
    o.payment_method === "cod"
      ? `1. We verify your ${formatPKR(o.cod_advance)} Easypaisa advance and confirm your order, then pack it discreetly in a plain, unbranded box.`
      : `1. We confirm your order and pack it discreetly in a plain, unbranded box.`,
    `2. Your parcel ships within 2–4 working days, anywhere in Pakistan.`,
    `3. Track it any time with your order number and mobile number.`,
    ``,
    `Questions? Message us on WhatsApp: ${WHATSAPP_URL}`,
    `RoseCare — https://rosecare.store`,
  ].join("\n");

  return { subject, html: layout({ preheader: `Receipt + tracking for your order ${o.order_number}.`, body }), text };
}

// ---------------------------------------------------------------------------
// 2. Order status updates (customer)
// ---------------------------------------------------------------------------

const STATUS_COPY: Record<
  StatusKind,
  { subject: (o: OrderEmailData) => string; headline: string; message: (o: OrderEmailData) => string }
> = {
  confirmed: {
    subject: (o) => `Good news — your RoseCare order ${o.order_number} is confirmed`,
    headline: "Your order is confirmed",
    message: (o) =>
      o.payment_method === "cod"
        ? `Your ${formatPKR(o.cod_advance)} advance has been verified and your order is confirmed. We're packing it discreetly in a plain box, and it will be on its way soon. You'll pay ${formatPKR(o.total - o.cod_advance)} in cash when your parcel arrives.${o.delivery_fee === 0 ? " Delivery was free on this pack — the advance came off your pack price." : ""}`
        : "Your payment has been verified and your order is confirmed. We're packing it discreetly in a plain box, and it will be on its way soon.",
  },
  processing: {
    subject: (o) => `We're packing your RoseCare order ${o.order_number}`,
    headline: "Your order is being prepared",
    message: () =>
      "Your order is confirmed and we're packing it carefully in plain, unbranded packaging. It ships very soon.",
  },
  shipped: {
    subject: (o) => `Your RoseCare order ${o.order_number} is on its way`,
    headline: "Your order has shipped",
    message: () =>
      "Your parcel is on its way. Delivery usually takes 2–4 working days — you can follow it with the tracking details below.",
  },
  delivered: {
    subject: (o) => `Your RoseCare order ${o.order_number} has been delivered`,
    headline: "Delivered — enjoy!",
    message: () =>
      "Your order has been delivered. If anything is wrong with your parcel, message us on WhatsApp and we'll make it right.",
  },
  rejected: {
    subject: (o) => `There's an issue with your RoseCare payment (${o.order_number})`,
    headline: "We couldn't verify your payment",
    message: (o) =>
      o.payment_method === "cod"
        ? `We checked the ${formatPKR(o.cod_advance)} advance for your order, but we couldn't verify it, so the order was cancelled. Please check your transaction details and try again — or message us on WhatsApp and we'll help you sort it out.`
        : "We checked the payment for your order, but we couldn't verify it, so the order was cancelled. Please check your transaction details and try again — or message us on WhatsApp and we'll help you sort it out.",
  },
  cancelled: {
    subject: (o) => `Your RoseCare order ${o.order_number} has been cancelled`,
    headline: "Your order is cancelled",
    message: () =>
      "Your order has been cancelled. If this was a mistake, message us on WhatsApp and we'll help you place a fresh order.",
  },
};

export function orderStatusEmail(o: OrderEmailData, kind: StatusKind): BuiltEmail {
  const copy = STATUS_COPY[kind];
  const subject = copy.subject(o);
  const trackUrl = TRACK_URL(o.order_number, o.phone);

  const extraHtml =
    kind === "shipped" && o.tracking_number
      ? `<div style="margin-top:16px;text-align:center;"><p style="font-size:14px;color:#7d6a72;margin:0 0 6px;">Courier tracking number</p><p style="margin:0;"><a href="${trackUrl}" style="text-decoration:none;color:inherit;"><span style="display:inline-block;background-color:#f7efe8;border:1px dashed #c2185b;border-radius:12px;padding:12px 22px 10px;text-align:center;"><span style="display:block;font-size:20px;letter-spacing:1px;color:#3d2b33;"><strong>${esc(o.tracking_number)}</strong></span><span style="display:block;margin-top:6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:12px;font-weight:600;color:#c2185b;">Tap to open your order — copy the number there</span></span></a></p></div>`
      : kind === "rejected" && o.admin_note
        ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf2f5;border:1px solid #f3c6d4;border-radius:12px;font-size:15px;margin-top:16px;"><tr><td style="padding:14px 16px;"><strong>Reason:</strong> ${esc(o.admin_note)}</td></tr></table>`
        : "";

  const extraText =
    kind === "shipped" && o.tracking_number
      ? `\nCourier tracking number: ${o.tracking_number}`
      : kind === "rejected" && o.admin_note
        ? `\nReason: ${o.admin_note}`
        : "";

  const body = `
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;margin:8px 0 4px;font-weight:600;">${esc(copy.headline)}</h1>
<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Hi ${esc(firstName(o.customer_name))},</p>
<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">${esc(copy.message(o))}</p>
<p style="font-size:15px;margin:0;">Order <strong>${esc(o.order_number)}</strong> · ${esc(o.bundle_name)} pack × ${o.quantity} · ${formatPKR(o.total)}${o.payment_method === "cod" ? ` · Pay on delivery ${formatPKR(o.total - o.cod_advance)}` : ""}</p>
${extraHtml}
${button(trackUrl, "Track your order")}`;

  const text = [
    `${copy.headline}`,
    ``,
    `Hi ${firstName(o.customer_name)},`,
    ``,
    copy.message(o),
    extraText,
    ``,
    `Order ${o.order_number} · ${o.bundle_name} pack x ${o.quantity} · ${formatPKR(o.total)}${o.payment_method === "cod" ? ` · Pay on delivery ${formatPKR(o.total - o.cod_advance)}` : ""}`,
    ``,
    `Track your order: ${trackUrl}`,
    ``,
    `Questions? Message us on WhatsApp: ${WHATSAPP_URL}`,
    `RoseCare — https://rosecare.store`,
  ].join("\n");

  return { subject, html: layout({ preheader: `${copy.headline} — order ${o.order_number}.`, body }), text };
}

// ---------------------------------------------------------------------------
// 3. New-order alert (owner)
// ---------------------------------------------------------------------------

export function ownerNewOrderEmail(
  o: OrderEmailData,
  easypaisa: EasypaisaDetails,
): BuiltEmail {
  const subject = `New RoseCare order ${o.order_number} — ${formatPKR(o.total)} · ${paymentLabel(o.payment_method)}`;
  const adminUrl = `${SITE_URL}/admin`;
  const date = orderDate(o.created_at);

  const paymentHtml =
    o.payment_method === "cod"
      ? `<p style="font-size:15px;line-height:1.6;margin:0 0 6px;"><strong>Cash on Delivery</strong> — ${formatPKR(o.cod_advance)} advance via Easypaisa (verify it below)${o.delivery_fee === 0 ? " — delivery is free on this pack, so the advance comes off the pack price" : ""}, then collect ${formatPKR(o.total - o.cod_advance)} in cash when the parcel arrives.</p>
<p style="font-size:15px;line-height:1.6;margin:0;">Transaction ID: <strong>${esc(o.easypaisa_txn_id ?? "—")}</strong><br>Sent from: ${esc(o.easypaisa_sender_number ?? "—")}</p>
<p style="font-size:15px;line-height:1.6;margin:10px 0 0;">${o.payment_proof_path ? "Receipt screenshot uploaded — view it in the admin panel." : "No receipt screenshot — verify with the transaction ID."}</p>`
      : `<p style="font-size:15px;line-height:1.6;margin:0 0 6px;"><strong>Easypaisa</strong> — ${formatPKR(o.total)} to ${esc(easypaisa.accountNumber)} (${esc(easypaisa.accountName)}).</p>
<p style="font-size:15px;line-height:1.6;margin:0;">Transaction ID: <strong>${esc(o.easypaisa_txn_id ?? "—")}</strong><br>Sent from: ${esc(o.easypaisa_sender_number ?? "—")}</p>
<p style="font-size:15px;line-height:1.6;margin:10px 0 0;">${o.payment_proof_path ? "Receipt screenshot uploaded — view it in the admin panel." : "No receipt screenshot — verify with the transaction ID."}</p>`;

  const paymentText =
    o.payment_method === "cod"
      ? [
          `Cash on Delivery — ${formatPKR(o.cod_advance)} advance via Easypaisa (verify it below)${o.delivery_fee === 0 ? " — delivery is free on this pack, so the advance comes off the pack price" : ""}, then collect ${formatPKR(o.total - o.cod_advance)} in cash when the parcel arrives.`,
          `Transaction ID: ${o.easypaisa_txn_id ?? "—"}`,
          `Sent from: ${o.easypaisa_sender_number ?? "—"}`,
          o.payment_proof_path
            ? "Receipt screenshot uploaded — view it in the admin panel."
            : "No receipt screenshot — verify with the transaction ID.",
        ].join("\n")
      : [
          `Easypaisa — ${formatPKR(o.total)} to ${easypaisa.accountNumber} (${easypaisa.accountName}).`,
          `Transaction ID: ${o.easypaisa_txn_id ?? "—"}`,
          `Sent from: ${o.easypaisa_sender_number ?? "—"}`,
          o.payment_proof_path
            ? "Receipt screenshot uploaded — view it in the admin panel."
            : "No receipt screenshot — verify with the transaction ID.",
        ].join("\n");

  const body = `
<h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;margin:8px 0 4px;font-weight:600;">New order ${esc(o.order_number)}</h1>
<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">A customer just placed an order on RoseCare.${date ? ` Placed on ${esc(date)}.` : ""}</p>
<h2 style="font-family:Georgia,'Times New Roman',serif;font-size:18px;margin:18px 0 8px;">Customer</h2>
<p style="font-size:15px;line-height:1.7;margin:0;"><strong>${esc(o.customer_name)}</strong><br>Phone: <a href="tel:${esc(o.phone)}" style="color:#c2185b;">${esc(o.phone)}</a><br>Email: <a href="mailto:${esc(o.email ?? "")}" style="color:#c2185b;">${esc(o.email ?? "—")}</a><br>${esc(formatDisplayAddress(o.address, o.city))}</p>
${o.notes ? `<p style="font-size:15px;line-height:1.6;margin:10px 0 0;background-color:#f7efe8;border-radius:10px;padding:10px 14px;">&ldquo;${esc(o.notes)}&rdquo;</p>` : ""}
<h2 style="font-family:Georgia,'Times New Roman',serif;font-size:18px;margin:22px 0 8px;">Order</h2>
${itemsTable(o)}
<h2 style="font-family:Georgia,'Times New Roman',serif;font-size:18px;margin:22px 0 8px;">Payment</h2>
${paymentHtml}
${button(adminUrl, "View order in admin")}`;

  const text = [
    `New RoseCare order ${o.order_number}${date ? ` — placed on ${date}` : ""}`,
    ``,
    `Customer: ${o.customer_name}`,
    `Phone: ${o.phone}`,
    `Email: ${o.email ?? "—"}`,
    `Address: ${formatDisplayAddress(o.address, o.city)}`,
    o.notes ? `Note: "${o.notes}"` : "",
    ``,
    itemsText(o),
    ``,
    paymentText,
    ``,
    `View order in admin: ${adminUrl}`,
  ]
    .filter((l) => l !== "")
    .join("\n");

  return { subject, html: layout({ preheader: `New order ${o.order_number} — ${formatPKR(o.total)}.`, body }), text };
}
