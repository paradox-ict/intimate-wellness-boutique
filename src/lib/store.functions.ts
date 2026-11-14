import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { normalizePkPhone } from "./format";

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
    delivery_fee: number;
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
        delivery_fee: s?.delivery_fee ?? 200,
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

const placeOrderSchema = z
  .object({
    bundleId: z.string().uuid(),
    quantity: z.number().int().min(1).max(10),
    customerName: z.string().trim().min(2).max(80),
    phone: phoneSchema,
    email: z.string().trim().email().max(255).optional().or(z.literal("")),
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
    if (v.paymentMethod === "easypaisa" && !v.txnId && !v.proof) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["txnId"],
        message: "Add your Easypaisa transaction ID or a receipt screenshot",
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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let proofPath: string | null = null;
    if (data.paymentMethod === "easypaisa" && data.proof) {
      const bytes = Uint8Array.from(atob(data.proof.base64), (c) => c.charCodeAt(0));
      if (bytes.byteLength > 5 * 1024 * 1024) {
        return { ok: false as const, error: "Receipt image is too large (max 5 MB)." };
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
      _txn_id: data.paymentMethod === "easypaisa" ? (data.txnId ?? "") : "",
      _sender_number: data.paymentMethod === "easypaisa" ? (data.senderNumber ?? "") : "",
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
  total: number;
  city: string;
  tracking_number: string | null;
  created_at: string;
  events: { status: string; payment_status: string; note: string | null; created_at: string }[];
};

export const trackOrder = createServerFn({ method: "POST" })
  .validator((data: { orderNumber: string; phone: string }) => trackSchema.parse(data))
  .handler(async ({ data }): Promise<{ order: TrackedOrder | null }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select(
        "id,order_number,status,payment_status,payment_method,bundle_name,quantity,total_pieces,total,city,tracking_number,created_at",
      )
      .eq("order_number", data.orderNumber)
      .eq("phone", data.phone)
      .maybeSingle();
    if (!order) return { order: null };
    const { data: events } = await supabaseAdmin
      .from("order_events")
      .select("status,payment_status,note,created_at")
      .eq("order_id", order.id)
      .order("created_at");
    const { id: _id, ...rest } = order;
    return { order: { ...rest, events: events ?? [] } };
  });
