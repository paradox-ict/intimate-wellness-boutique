import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { normalizePkPhone } from "./format";
import { hitRateLimit } from "./rate-limit";

// Rate limits live in ./rate-limit (in-memory fixed windows). Serverless
// instances are ephemeral, so they are defense-in-depth, not a hard
// guarantee — a Vercel WAF rate-limit rule is the durable layer. Limits are
// generous so real customers never hit them; if the IP can't be determined,
// don't throttle.
function clientIp(): string {
  try {
    const fwd = getRequest().headers.get("x-forwarded-for") ?? "";
    return fwd.split(",")[0]?.trim() ?? "";
  } catch {
    return "";
  }
}

// Identify an image by its magic bytes — the client-supplied contentType is
// attacker-controlled, so never trust it alone.
function sniffImageType(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return "image/jpeg";
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  )
    return "image/png";
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  )
    return "image/webp";
  return null;
}

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type StoreBundle = {
  id: string;
  name: string;
  tagline: string | null;
  pieces: number;
  price: number;
  compare_at_price: number | null;
  badge: string | null;
  free_delivery: boolean;
};

export type Storefront = {
  bundles: StoreBundle[];
  settings: {
    in_stock: boolean;
    low_stock: boolean;
    stock_count: number;
    // Delivery fee by payment method, flat per order. COD customers pay the
    // COD fee now via Easypaisa to confirm; Easypaisa-prepaid customers pay
    // the Easypaisa fee as part of their full total up front.
    cod_delivery_fee: number;
    easypaisa_delivery_fee: number;
    easypaisa_account_name: string;
    easypaisa_number: string;
    support_whatsapp: string;
  };
};

export const getStorefront = createServerFn({ method: "GET" }).handler(
  async (): Promise<Storefront> => {
    const sb = publicClient();
    const [{ data: bundles, error: bErr }, { data: s, error: sErr }] = await Promise.all([
      sb
        .from("bundles")
        .select("id,name,tagline,pieces,price,compare_at_price,badge,free_delivery")
        .eq("is_active", true)
        .order("sort_order"),
      sb.from("store_settings").select("*").eq("id", 1).maybeSingle(),
    ]);
    if (bErr || sErr) console.error("storefront load failed", bErr ?? sErr);
    const stock = s?.stock_count ?? 0;
    return {
      bundles: bundles ?? [],
      settings: {
        in_stock: stock > 0,
        low_stock: stock > 0 && stock <= (s?.low_stock_threshold ?? 20),
        stock_count: stock,
        cod_delivery_fee: s?.cod_delivery_fee ?? 400,
        easypaisa_delivery_fee: s?.easypaisa_delivery_fee ?? 300,
        easypaisa_account_name: s?.easypaisa_account_name ?? "",
        easypaisa_number: s?.easypaisa_number ?? "",
        support_whatsapp: s?.support_whatsapp ?? "",
      },
    };
  },
);

const ALLOWED_PROOF_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const phoneSchema = z
  .string()
  .trim()
  .transform((v, ctx) => {
    const n = normalizePkPhone(v);
    if (!n) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid mobile number (03XX XXXXXXX)",
      });
      return z.NEVER;
    }
    return n;
  });

export const placeOrderSchema = z
  .object({
    bundleId: z.string().uuid(),
    quantity: z.number().int().min(1).max(10),
    customerName: z.string().trim().min(2).max(80),
    phone: phoneSchema,
    email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
    city: z.string().trim().min(2).max(60),
    address: z.string().trim().min(8).max(400),
    notes: z.string().trim().max(400).optional().or(z.literal("")),
    paymentMethod: z.enum(["cod", "easypaisa"]),
    txnId: z.string().trim().max(40).optional().or(z.literal("")),
    senderNumber: z.string().trim().max(20).optional().or(z.literal("")),
    proof: z
      .object({
        base64: z.string().max(7_500_000),
        contentType: z.string(),
      })
      .optional(),
  })
  .superRefine((v, ctx) => {
    // BOTH payment methods send money via Easypaisa up front — COD sends the
    // Rs 400 confirmation advance, Easypaisa sends the full total — so both
    // need a transaction ID or a receipt screenshot to prove it.
    if (!v.txnId && !v.proof) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["txnId"],
        message:
          v.paymentMethod === "cod"
            ? "Add your Easypaisa transaction ID or a receipt screenshot for the Rs 400 advance"
            : "Add your Easypaisa transaction ID or a receipt screenshot",
      });
    }
    if (v.proof && !ALLOWED_PROOF_TYPES[v.proof.contentType]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["proof"],
        message: "Receipt must be a JPG, PNG or WEBP image",
      });
    }
  });

export type PlaceOrderInput = z.input<typeof placeOrderSchema>;

const ERROR_MESSAGES: Record<string, string> = {
  OUT_OF_STOCK: "Sorry — we don't have enough stock for this order right now.",
  BUNDLE_UNAVAILABLE: "This pack is no longer available. Please choose another.",
  INVALID_QUANTITY: "Please choose between 1 and 10 packs.",
};

export const placeOrder = createServerFn({ method: "POST" })
  .validator((data: PlaceOrderInput) => placeOrderSchema.parse(data))
  .handler(async ({ data }) => {
    if (hitRateLimit(`order:${clientIp()}`, 10, 10 * 60 * 1000)) {
      return {
        ok: false as const,
        error: "Too many orders from this device. Please try again in a few minutes.",
      };
    }
    // Anti-spam: one phone or email may place at most 3 orders/hour. Without
    // this, anyone could use the store to flood a victim's inbox with order
    // confirmations. Same generic message as the IP limit — never reveal
    // which limit fired. data.phone is already normalised by the schema.
    if (
      hitRateLimit(`order-phone:${data.phone}`, 3, 60 * 60 * 1000) ||
      hitRateLimit(`order-email:${data.email.toLowerCase()}`, 3, 60 * 60 * 1000)
    ) {
      return {
        ok: false as const,
        error: "Too many orders from this device. Please try again in a few minutes.",
      };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let proofPath: string | null = null;
    if (data.proof) {
      const bytes = Uint8Array.from(atob(data.proof.base64), (c) => c.charCodeAt(0));
      if (bytes.byteLength > 5 * 1024 * 1024) {
        return { ok: false as const, error: "Receipt image is too large (max 5 MB)." };
      }
      // Reject files whose real bytes aren't the image type they claim to be.
      if (sniffImageType(bytes) !== data.proof.contentType) {
        return { ok: false as const, error: "Receipt must be a JPG, PNG or WEBP image." };
      }
      const ext = ALLOWED_PROOF_TYPES[data.proof.contentType];
      const month = new Date().toISOString().slice(0, 7);
      proofPath = `${month}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabaseAdmin.storage
        .from("payment-proofs")
        .upload(proofPath, bytes, { contentType: data.proof.contentType, upsert: false });
      if (upErr) {
        console.error("proof upload failed", upErr);
        return { ok: false as const, error: "We couldn't upload your receipt. Please try again." };
      }
    }

    const { data: rows, error } = await supabaseAdmin.rpc("place_order", {
      _bundle_id: data.bundleId,
      _quantity: data.quantity,
      _customer_name: data.customerName,
      _phone: data.phone,
      _email: data.email ?? "",
      _city: data.city,
      _address: data.address,
      _notes: data.notes ?? "",
      _payment_method: data.paymentMethod,
      _txn_id: data.txnId ?? "",
      _sender_number: data.senderNumber ?? "",
      _proof_path: proofPath ?? "",
    });

    if (error || !rows?.[0]) {
      if (proofPath) await supabaseAdmin.storage.from("payment-proofs").remove([proofPath]);
      const code = Object.keys(ERROR_MESSAGES).find((k) => error?.message?.includes(k));
      console.error("place_order failed", error);
      return {
        ok: false as const,
        error: code
          ? ERROR_MESSAGES[code]
          : "Something went wrong placing your order. Please try again.",
      };
    }

    // Order placed — email the customer their receipt + tracking link and
    // alert the owner. FAIL-SOFT: email problems are logged and never fail
    // the order; the customer still gets their order number below.
    try {
      const { data: full } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("order_number", rows[0].order_number)
        .maybeSingle();
      const { data: settings } = await supabaseAdmin
        .from("store_settings")
        .select("easypaisa_account_name, easypaisa_number, cod_delivery_fee")
        .eq("id", 1)
        .maybeSingle();
      if (full) {
        // Idempotency: claim each email exactly once BEFORE sending. The
        // UPDATE only touches the row while its sent-flag is still NULL, so
        // a retried placeOrder (or two serverless instances racing) can
        // never send a duplicate confirmation or owner alert. At-most-once
        // by design: if the send then fails, the flag stays set and the
        // failure is visible in the logs — a duplicate receipt is worse
        // than a missed one. If the flag columns don't exist yet (SQL not
        // run), the claim errors and we send anyway — fail-open, so a
        // missing column can never swallow a customer's receipt.
        type OrdersUpdate = Database["public"]["Tables"]["orders"]["Update"];
        const claim = async (
          column: "confirmation_email_sent_at" | "owner_alert_sent_at",
        ): Promise<boolean> => {
          const stamp = { [column]: new Date().toISOString() } as unknown as OrdersUpdate;
          const { data: claimed, error: claimErr } = await supabaseAdmin
            .from("orders")
            .update(stamp)
            .eq("id", full.id)
            .is(column, null)
            .select("id")
            .maybeSingle();
          if (claimErr) {
            console.error("[email] claim failed (sending anyway)", column, claimErr.message);
            return true;
          }
          return !!claimed;
        };
        const sendConfirmation = full.email ? await claim("confirmation_email_sent_at") : false;
        const sendOwnerAlert = process.env["ADMIN_EMAIL"]
          ? await claim("owner_alert_sent_at")
          : false;
        const { orderRowToEmailData, sendOrderPlacedEmails } = await import(
          "@/lib/email/resend"
        );
        await sendOrderPlacedEmails({
          order: orderRowToEmailData(full, settings?.cod_delivery_fee ?? 400),
          easypaisa: {
            accountName: settings?.easypaisa_account_name ?? "",
            accountNumber: settings?.easypaisa_number ?? "",
          },
          ownerEmail: sendOwnerAlert ? process.env["ADMIN_EMAIL"] : undefined,
          sendConfirmation,
        });
      }
    } catch (err) {
      console.error("[email] order-placed emails failed", err);
    }

    return {
      ok: true as const,
      orderNumber: rows[0].order_number,
      total: rows[0].total,
      paymentMethod: data.paymentMethod,
      phone: data.phone,
    };
  });

const trackSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .min(4)
    .max(20)
    .transform((v) => v.toUpperCase()),
  phone: phoneSchema,
});

export type TrackedOrder = {
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  bundle_name: string;
  quantity: number;
  total_pieces: number;
  subtotal: number;
  delivery_fee: number;
  total: number;
  // Server-computed split, so the timeline never guesses: COD advance is
  // always the COD fee (Rs 400) — on a free-delivery pack it comes off the
  // pack price, so delivery_fee is 0 but the advance is still Rs 400 and
  // the balance is total − 400. Easypaisa pays the full total up front.
  advance_due: number;
  balance_due: number;
  city: string;
  tracking_number: string | null;
  created_at: string;
  events: { status: string; payment_status: string; note: string | null; created_at: string }[];
};

export const trackOrder = createServerFn({ method: "POST" })
  .validator((data: { orderNumber: string; phone: string }) => trackSchema.parse(data))
  .handler(async ({ data }): Promise<{ order: TrackedOrder | null }> => {
    // Throttled lookups answer exactly like a miss, so a brute-force prober
    // can't tell throttling apart from a wrong order number / phone.
    if (hitRateLimit(`track:${clientIp()}`, 30, 10 * 60 * 1000)) return { order: null };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select(
        "id,order_number,status,payment_status,payment_method,bundle_name,quantity,total_pieces,subtotal,delivery_fee,total,city,tracking_number,created_at",
      )
      .eq("order_number", data.orderNumber)
      .eq("phone", data.phone)
      .maybeSingle();
    if (!order) return { order: null };
    const { data: settings } = await supabaseAdmin
      .from("store_settings")
      .select("cod_delivery_fee")
      .eq("id", 1)
      .maybeSingle();
    const codFee = settings?.cod_delivery_fee ?? 400;
    const advance_due = order.payment_method === "cod" ? codFee : order.total;
    const balance_due = order.payment_method === "cod" ? order.total - codFee : 0;
    const { data: events } = await supabaseAdmin
      .from("order_events")
      .select("status,payment_status,note,created_at")
      .eq("order_id", order.id)
      .order("created_at");
    const { id: _id, ...rest } = order;
    return { order: { ...rest, advance_due, balance_due, events: events ?? [] } };
  });

// ---------------------------------------------------------------------------
// Order-status emails (admin-triggered)
// ---------------------------------------------------------------------------

const notifyOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  accessToken: z.string().min(10).max(5000),
  prevStatus: z.string().max(30),
  prevPaymentStatus: z.string().max(30),
});

/**
 * Send the customer their status email after an admin status change. Called
 * by the admin UI right after a successful order update, with the order's
 * previous state so only real changes send mail.
 *
 * Authenticated: the caller must be a signed-in admin (access token verified
 * with the service-role client + has_role check). Without that, anyone who
 * knew an order id could spam customers with status emails. Returns
 * ok:false (without saying why) for bad auth, throttling, missing orders
 * and missing customer emails — the admin action itself already succeeded,
 * so nothing here may ever fail it.
 *
 * Anti-spam, three layers: (1) deriveStatusKind sends ONLY on a real
 * status/payment_status change; (2) the (status, payment, kind) triple is
 * atomically claimed on the order row before sending, so a repeated notify
 * for the same transition sends nothing — one email per transition; (3) one
 * customer inbox gets at most 5 status emails/hour even from a stuck or
 * compromised admin session.
 */
export const notifyOrderStatus = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof notifyOrderStatusSchema>) =>
    notifyOrderStatusSchema.parse(data),
  )
  .handler(async ({ data }) => {
    if (hitRateLimit(`notify:${clientIp()}`, 20, 10 * 60 * 1000)) return { ok: false as const };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const {
      data: { user },
      error: authErr,
    } = await supabaseAdmin.auth.getUser(data.accessToken);
    if (authErr || !user) return { ok: false as const };
    const { data: isAdmin } = await supabaseAdmin.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) return { ok: false as const };
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", data.orderId)
      .maybeSingle();
    if (!order || !order.email) return { ok: false as const };
    const { data: settings } = await supabaseAdmin
      .from("store_settings")
      .select("cod_delivery_fee")
      .eq("id", 1)
      .maybeSingle();
    const { deriveStatusKind, orderRowToEmailData, sendStatusEmailForOrder } = await import(
      "@/lib/email/resend"
    );
    const emailData = orderRowToEmailData(order, settings?.cod_delivery_fee ?? 400);
    const kind = deriveStatusKind(emailData, data.prevStatus, data.prevPaymentStatus);
    if (!kind) return { ok: true as const, sent: false as const, kind: null };
    if (hitRateLimit(`notify-email:${emailData.email.toLowerCase()}`, 5, 60 * 60 * 1000)) {
      console.warn("[email] status email throttled for", order.order_number);
      return { ok: true as const, sent: false as const, kind };
    }
    // Atomically claim this exact (status, payment, kind) triple on the
    // order row. The UPDATE matches only while at least one stored value is
    // NULL or different, so a repeated notify for the same transition
    // matches zero rows and sends nothing. Columns come from
    // rosecare-email-setup.sql (cast: the generated types don't know them
    // until they're regenerated); if the claim errors we send anyway —
    // fail-open, so a missing column can never swallow a status email.
    type OrdersUpdate = Database["public"]["Tables"]["orders"]["Update"];
    const stamp = {
      last_status_email_status: order.status,
      last_status_email_payment: order.payment_status,
      last_status_email_kind: kind,
      last_status_email_at: new Date().toISOString(),
    } as unknown as OrdersUpdate;
    const { data: claimed, error: claimErr } = await supabaseAdmin
      .from("orders")
      .update(stamp)
      .eq("id", order.id)
      .or(
        `last_status_email_status.is.null,last_status_email_status.neq.${order.status},` +
          `last_status_email_payment.is.null,last_status_email_payment.neq.${order.payment_status},` +
          `last_status_email_kind.is.null,last_status_email_kind.neq.${kind}`,
      )
      .select("id")
      .maybeSingle();
    if (claimErr) {
      console.error("[email] status claim failed (sending anyway)", claimErr.message);
    } else if (!claimed) {
      return { ok: true as const, sent: false as const, kind, duplicate: true };
    }
    try {
      const { sent } = await sendStatusEmailForOrder({
        order: emailData,
        prevStatus: data.prevStatus,
        prevPaymentStatus: data.prevPaymentStatus,
      });
      if (!sent) {
        // Send failed — roll the claim back so a later retry can send.
        await supabaseAdmin
          .from("orders")
          .update({
            last_status_email_status: null,
            last_status_email_payment: null,
            last_status_email_kind: null,
            last_status_email_at: null,
          } as unknown as OrdersUpdate)
          .eq("id", order.id)
          .eq("last_status_email_status", order.status)
          .eq("last_status_email_payment", order.payment_status)
          .eq("last_status_email_kind", kind);
      }
      return { ok: true as const, sent, kind };
    } catch (err) {
      console.error("[email] status email failed", err);
      return { ok: true as const, sent: false as const };
    }
  });
