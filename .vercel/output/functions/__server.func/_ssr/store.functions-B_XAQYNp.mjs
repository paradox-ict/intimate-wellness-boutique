import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { a as normalizePkPhone } from "./format-Cytqc9Qw.mjs";
import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { a as objectType, i as numberType, n as enumType, o as stringType, r as literalType, s as ZodIssueCode, t as NEVER } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store.functions-B_XAQYNp.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function publicClient() {
	const url = process.env["SUPABASE_URL"];
	const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
	return createClient(url, key, {
		auth: {
			storage: void 0,
			persistSession: false,
			autoRefreshToken: false
		},
		global: { fetch: (input, init) => {
			const h = new Headers(init?.headers);
			if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
			h.set("apikey", key);
			return fetch(input, {
				...init,
				headers: h
			});
		} }
	});
}
var getStorefront_createServerFn_handler = createServerRpc({
	id: "b00975664162d400d9962a031192cdd63846017da2cad6471d01595f04949051",
	name: "getStorefront",
	filename: "src/lib/store.functions.ts"
}, (opts) => getStorefront.__executeServer(opts));
var getStorefront = createServerFn({ method: "GET" }).handler(getStorefront_createServerFn_handler, async () => {
	const sb = publicClient();
	const [{ data: bundles, error: bErr }, { data: s, error: sErr }] = await Promise.all([sb.from("bundles").select("id,name,tagline,pieces,price,compare_at_price,badge,free_delivery").eq("is_active", true).order("sort_order"), sb.from("store_settings").select("*").eq("id", 1).maybeSingle()]);
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
			support_whatsapp: s?.support_whatsapp ?? ""
		}
	};
});
var ALLOWED_PROOF_TYPES = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp"
};
var phoneSchema = stringType().trim().transform((v, ctx) => {
	const n = normalizePkPhone(v);
	if (!n) {
		ctx.addIssue({
			code: ZodIssueCode.custom,
			message: "Enter a valid mobile number (03XX XXXXXXX)"
		});
		return NEVER;
	}
	return n;
});
var placeOrderSchema = objectType({
	bundleId: stringType().uuid(),
	quantity: numberType().int().min(1).max(10),
	customerName: stringType().trim().min(2).max(80),
	phone: phoneSchema,
	email: stringType().trim().email().max(255).optional().or(literalType("")),
	city: stringType().trim().min(2).max(60),
	address: stringType().trim().min(8).max(400),
	notes: stringType().trim().max(400).optional().or(literalType("")),
	paymentMethod: enumType(["cod", "easypaisa"]),
	txnId: stringType().trim().max(40).optional().or(literalType("")),
	senderNumber: stringType().trim().max(20).optional().or(literalType("")),
	proof: objectType({
		base64: stringType().max(75e5),
		contentType: stringType()
	}).optional()
}).superRefine((v, ctx) => {
	if (v.paymentMethod === "easypaisa" && !v.txnId && !v.proof) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["txnId"],
		message: "Add your Easypaisa transaction ID or a receipt screenshot"
	});
	if (v.proof && !ALLOWED_PROOF_TYPES[v.proof.contentType]) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["proof"],
		message: "Receipt must be a JPG, PNG or WEBP image"
	});
});
var ERROR_MESSAGES = {
	OUT_OF_STOCK: "Sorry — we don't have enough stock for this order right now.",
	BUNDLE_UNAVAILABLE: "This pack is no longer available. Please choose another.",
	INVALID_QUANTITY: "Please choose between 1 and 10 packs."
};
var placeOrder_createServerFn_handler = createServerRpc({
	id: "90954bf6eb46204d3fcbe413f4732bb8c7d7db678553e104ffa92a324b365bba",
	name: "placeOrder",
	filename: "src/lib/store.functions.ts"
}, (opts) => placeOrder.__executeServer(opts));
var placeOrder = createServerFn({ method: "POST" }).validator((data) => placeOrderSchema.parse(data)).handler(placeOrder_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	let proofPath = null;
	if (data.paymentMethod === "easypaisa" && data.proof) {
		const bytes = Uint8Array.from(atob(data.proof.base64), (c) => c.charCodeAt(0));
		if (bytes.byteLength > 5242880) return {
			ok: false,
			error: "Receipt image is too large (max 5 MB)."
		};
		const ext = ALLOWED_PROOF_TYPES[data.proof.contentType];
		proofPath = `${(/* @__PURE__ */ new Date()).toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
		const { error: upErr } = await supabaseAdmin.storage.from("payment-proofs").upload(proofPath, bytes, {
			contentType: data.proof.contentType,
			upsert: false
		});
		if (upErr) {
			console.error("proof upload failed", upErr);
			return {
				ok: false,
				error: "We couldn't upload your receipt. Please try again."
			};
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
		_txn_id: data.paymentMethod === "easypaisa" ? data.txnId ?? "" : "",
		_sender_number: data.paymentMethod === "easypaisa" ? data.senderNumber ?? "" : "",
		_proof_path: proofPath ?? ""
	});
	if (error || !rows?.[0]) {
		if (proofPath) await supabaseAdmin.storage.from("payment-proofs").remove([proofPath]);
		const code = Object.keys(ERROR_MESSAGES).find((k) => error?.message?.includes(k));
		console.error("place_order failed", error);
		return {
			ok: false,
			error: code ? ERROR_MESSAGES[code] : "Something went wrong placing your order. Please try again."
		};
	}
	return {
		ok: true,
		orderNumber: rows[0].order_number,
		total: rows[0].total,
		paymentMethod: data.paymentMethod,
		phone: data.phone
	};
});
var trackSchema = objectType({
	orderNumber: stringType().trim().min(4).max(20).transform((v) => v.toUpperCase()),
	phone: phoneSchema
});
var trackOrder_createServerFn_handler = createServerRpc({
	id: "56631f4487419b942cc38fa9c978e420578bd8091f24d3e48875e88645997622",
	name: "trackOrder",
	filename: "src/lib/store.functions.ts"
}, (opts) => trackOrder.__executeServer(opts));
var trackOrder = createServerFn({ method: "POST" }).validator((data) => trackSchema.parse(data)).handler(trackOrder_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: order } = await supabaseAdmin.from("orders").select("id,order_number,status,payment_status,payment_method,bundle_name,quantity,total_pieces,total,city,tracking_number,created_at").eq("order_number", data.orderNumber).eq("phone", data.phone).maybeSingle();
	if (!order) return { order: null };
	const { data: events } = await supabaseAdmin.from("order_events").select("status,payment_status,note,created_at").eq("order_id", order.id).order("created_at");
	const { id: _id, ...rest } = order;
	return { order: {
		...rest,
		events: events ?? []
	} };
});
//#endregion
export { getStorefront_createServerFn_handler, placeOrder_createServerFn_handler, trackOrder_createServerFn_handler };
