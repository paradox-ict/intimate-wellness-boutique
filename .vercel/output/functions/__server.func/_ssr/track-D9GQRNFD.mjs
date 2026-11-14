import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-Ch79ysix.mjs";
import { K as Check, b as PackageSearch, k as LoaderCircle, t as X } from "../_libs/lucide-react.mjs";
import { a as normalizePkPhone, i as formatPKR, n as PAYMENT_STATUS_LABEL, t as ORDER_STATUS_LABEL } from "./format-Cytqc9Qw.mjs";
import { n as Label, t as Input } from "./label-BB4ZlleZ.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { i as trackOrder } from "./storefront-query-Ccmd-5MA.mjs";
import { n as StoreShell } from "./StoreShell-CI5L34ZR.mjs";
import { t as Route } from "./track-ClGgYe4N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track-D9GQRNFD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FLOW = [
	"pending",
	"confirmed",
	"processing",
	"shipped",
	"delivered"
];
function OrderTimeline({ order }) {
	const cancelled = order.status === "cancelled";
	const idx = FLOW.indexOf(order.status);
	const reached = (s) => order.events.find((e) => e.status === s)?.created_at;
	const lastNote = [...order.events].reverse().find((e) => e.note && e.note !== "Order placed")?.note;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
					children: "Order"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl",
					children: order.order_number
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("rounded-full px-3 py-1.5 text-xs font-semibold", cancelled ? "bg-destructive/10 text-destructive" : order.status === "delivered" ? "bg-success text-success-foreground" : "bg-secondary text-secondary-foreground"),
					children: ORDER_STATUS_LABEL[order.status]
				})]
			}),
			order.payment_method === "easypaisa" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("rounded-2xl p-4 text-sm", order.payment_status === "verified" ? "bg-accent text-accent-foreground" : order.payment_status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-warning/25 text-warning-foreground"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: "Easypaisa: "
					}),
					PAYMENT_STATUS_LABEL[order.payment_status],
					order.payment_status === "pending_verification" && " — we usually confirm within a few hours."
				]
			}),
			lastNote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "rounded-2xl bg-muted p-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold",
					children: "Message from us: "
				}), lastNote]
			}),
			cancelled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-2xl border border-destructive/30 p-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5 text-destructive" }), " This order was cancelled. Contact us if you think this is a mistake."]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "relative space-y-0",
				children: FLOW.map((s, i) => {
					const done = i <= idx;
					const at = reached(s);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "relative flex gap-4 pb-7 last:pb-0",
						children: [
							i < FLOW.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 transition-colors duration-700", i < idx ? "bg-primary" : "bg-border") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition-all duration-500", done ? "border-primary bg-brand text-primary-foreground" : "border-border bg-card", i === idx && "shadow-glow"),
								children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-border" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: cn("font-medium", !done && "text-muted-foreground"),
										children: ORDER_STATUS_LABEL[s]
									}),
									at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: format(new Date(at), "d MMM, h:mm a")
									}),
									s === "shipped" && done && order.tracking_number && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs",
										children: [
											"Courier tracking:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold",
												children: order.tracking_number
											})
										]
									})
								]
							})
						]
					}, s);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-3 rounded-2xl bg-muted p-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted-foreground",
						children: "Pack"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "font-medium",
						children: [
							order.bundle_name,
							" × ",
							order.quantity
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted-foreground",
						children: "Total"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-medium",
						children: formatPKR(order.total)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted-foreground",
						children: "Payment"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-medium",
						children: order.payment_method === "cod" ? "Cash on Delivery" : "Easypaisa"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted-foreground",
						children: "City"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-medium",
						children: order.city
					})] })
				]
			})
		]
	});
}
function TrackPage() {
	const search = Route.useSearch();
	const lookup = useServerFn(trackOrder);
	const [orderNumber, setOrderNumber] = (0, import_react.useState)(search.order ?? "");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [order, setOrder] = (0, import_react.useState)(null);
	const run = async (num, ph) => {
		setError(null);
		if (num.trim().length < 4) return setError("Enter your order number");
		if (!normalizePkPhone(ph)) return setError("Enter the mobile number used at checkout");
		setLoading(true);
		try {
			const res = await lookup({ data: {
				orderNumber: num,
				phone: ph
			} });
			if (!res.order) setError("We couldn't find an order with those details.");
			setOrder(res.order);
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		try {
			const last = JSON.parse(sessionStorage.getItem("sukoon-last-order") ?? "null");
			if (last?.orderNumber && (!search.order || last.orderNumber === search.order)) {
				setOrderNumber(last.orderNumber);
				setPhone(last.phone);
				run(last.orderNumber, last.phone);
			}
		} catch {}
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-hero px-5 py-14 md:py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-fade-up text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-primary-foreground shadow-glow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageSearch, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-5 text-4xl font-light sm:text-5xl",
							children: "Track your order"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-muted-foreground",
							children: "Enter your order number and the mobile number you used at checkout."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						run(orderNumber, phone);
					},
					className: "animate-fade-up mt-8 space-y-4 rounded-3xl border border-border/70 bg-card p-5 shadow-card sm:p-7 [animation-delay:120ms]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ord",
									children: "Order number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ord",
									value: orderNumber,
									onChange: (e) => setOrderNumber(e.target.value),
									placeholder: "SK-XXXXXX",
									className: "h-12 rounded-xl uppercase"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ph",
									children: "Mobile number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ph",
									type: "tel",
									inputMode: "tel",
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									placeholder: "03XX XXXXXXX",
									className: "h-12 rounded-xl"
								})]
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-destructive",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "hero",
							size: "xl",
							className: "w-full",
							disabled: loading,
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }), "Checking…"] }) : "Track order"
						})
					]
				}),
				order && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "animate-fade-up mt-6 rounded-3xl border border-border/70 bg-card p-5 shadow-card sm:p-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderTimeline, { order })
				})
			]
		})
	}) });
}
//#endregion
export { TrackPage as component };
