import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Ch79ysix.mjs";
import { K as Check, O as Lock, b as PackageSearch, z as Copy } from "../_libs/lucide-react.mjs";
import { i as formatPKR } from "./format-Cytqc9Qw.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as StoreShell } from "./StoreShell-CI5L34ZR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order-success-gwHdoQsa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuccessPage() {
	const [order, setOrder] = (0, import_react.useState)(null);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			setOrder(JSON.parse(sessionStorage.getItem("sukoon-last-order") ?? "null"));
		} catch {}
		setLoaded(true);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-hero px-5 py-16 md:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "animate-pop mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand text-primary-foreground shadow-glow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
						className: "h-9 w-9",
						strokeWidth: 2.5
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "animate-fade-up mt-8 text-4xl font-light sm:text-5xl [animation-delay:150ms]",
					children: ["Thank you", order ? "" : "!"]
				}),
				loaded && !order && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-muted-foreground",
					children: "Your order was placed. Use the Track order page to see its status."
				}),
				order && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-fade-up [animation-delay:250ms]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted-foreground",
						children: order.paymentMethod === "easypaisa" ? "We've received your order and Easypaisa details. We'll verify your payment and confirm shortly." : "Your order is confirmed for Cash on Delivery. We'll call to confirm before dispatch."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 rounded-3xl border border-border/70 bg-card p-6 text-left shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
								children: "Your order number"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									navigator.clipboard?.writeText(order.orderNumber);
									toast.success("Copied");
								},
								className: "mt-1 flex items-center gap-2 font-display text-3xl hover:text-primary",
								children: [
									order.orderNumber,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-5 w-5" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Save it to track your order."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex justify-between border-t border-border pt-4 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: order.paymentMethod === "cod" ? "Pay on delivery" : "Paid via Easypaisa"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: formatPKR(order.total)
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }), "Arriving in a plain, unbranded box."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col justify-center gap-3 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "hero",
						size: "xl",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/track",
							search: { order: order?.orderNumber },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageSearch, {}), "Track order"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "line",
						size: "xl",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: "Back to home"
						})
					})]
				})
			]
		})
	}) });
}
//#endregion
export { SuccessPage as component };
