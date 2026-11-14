import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { a as normalizePkPhone } from "./format-Cytqc9Qw.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-CwVGhkCG.mjs";
import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { a as objectType, i as numberType, n as enumType, o as stringType, r as literalType, s as ZodIssueCode, t as NEVER } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/storefront-query-Ccmd-5MA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)(null);
var KEY = "sukoon-cart-v1";
function CartProvider({ children }) {
	const [line, setLine] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(KEY);
			if (raw) setLine(JSON.parse(raw));
		} catch {}
	}, []);
	const persist = (0, import_react.useCallback)((l) => {
		setLine(l);
		try {
			if (l) localStorage.setItem(KEY, JSON.stringify(l));
			else localStorage.removeItem(KEY);
		} catch {}
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		line,
		open,
		setOpen,
		add: (bundleId, quantity = 1) => {
			persist({
				bundleId,
				quantity: Math.min(10, Math.max(1, quantity))
			});
			setOpen(true);
		},
		setQuantity: (q) => line && persist({
			...line,
			quantity: Math.min(10, Math.max(1, q))
		}),
		setBundle: (bundleId) => persist({
			bundleId,
			quantity: line?.quantity ?? 1
		}),
		clear: () => persist(null),
		count: line?.quantity ?? 0
	}), [
		line,
		open,
		persist
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value,
		children
	});
}
function useCart() {
	const c = (0, import_react.useContext)(Ctx);
	if (!c) throw new Error("useCart must be used inside CartProvider");
	return c;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getStorefront = createServerFn({ method: "GET" }).handler(createSsrRpc("b00975664162d400d9962a031192cdd63846017da2cad6471d01595f04949051"));
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
var placeOrder = createServerFn({ method: "POST" }).validator((data) => placeOrderSchema.parse(data)).handler(createSsrRpc("90954bf6eb46204d3fcbe413f4732bb8c7d7db678553e104ffa92a324b365bba"));
var trackSchema = objectType({
	orderNumber: stringType().trim().min(4).max(20).transform((v) => v.toUpperCase()),
	phone: phoneSchema
});
var trackOrder = createServerFn({ method: "POST" }).validator((data) => trackSchema.parse(data)).handler(createSsrRpc("56631f4487419b942cc38fa9c978e420578bd8091f24d3e48875e88645997622"));
var storefrontQuery = queryOptions({
	queryKey: ["storefront"],
	queryFn: () => getStorefront(),
	staleTime: 3e4
});
//#endregion
export { useCart as a, trackOrder as i, placeOrder as n, storefrontQuery as r, CartProvider as t };
