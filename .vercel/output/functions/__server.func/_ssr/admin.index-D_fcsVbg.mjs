import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CfC-VICC.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as ordersQuery, i as orderEventsQuery, n as adminSettingsQuery } from "./admin-queries-EJ0MfgsU.mjs";
import { n as cn, t as Button } from "./button-Ch79ysix.mjs";
import { B as Clock, E as MapPin, G as ChevronDown, H as CircleCheck, I as ExternalLink, K as Check, U as CircleAlert, V as CircleX, W as ChevronUp, _ as Phone, h as Search, i as Wallet, k as LoaderCircle, q as Boxes, z as Copy } from "../_libs/lucide-react.mjs";
import { i as formatPKR, n as PAYMENT_STATUS_LABEL, t as ORDER_STATUS_LABEL } from "./format-Cytqc9Qw.mjs";
import { n as Label, t as Input } from "./label-BB4ZlleZ.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, r as SheetDescription, t as Sheet } from "./sheet-BYLwPLEY.mjs";
import { t as Textarea } from "./textarea-ChBRLk8q.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as format, t as isToday } from "../_libs/date-fns.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-D_fcsVbg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ORDER_TONE = {
	pending: "bg-warning/25 text-warning-foreground",
	confirmed: "bg-secondary text-secondary-foreground",
	processing: "bg-secondary text-secondary-foreground",
	shipped: "bg-accent text-accent-foreground",
	delivered: "bg-success text-success-foreground",
	cancelled: "bg-destructive/10 text-destructive"
};
var PAY_TONE = {
	not_required: "bg-muted text-muted-foreground",
	pending_verification: "bg-warning/25 text-warning-foreground",
	verified: "bg-success text-success-foreground",
	rejected: "bg-destructive/10 text-destructive"
};
function OrderStatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold", ORDER_TONE[status]),
		children: ORDER_STATUS_LABEL[status]
	});
}
function PaymentBadge({ status, method }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold", PAY_TONE[status]),
		children: method === "cod" ? "COD" : `Easypaisa · ${PAYMENT_STATUS_LABEL[status]}`
	});
}
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var STATUSES = [
	"pending",
	"confirmed",
	"processing",
	"shipped",
	"delivered",
	"cancelled"
];
function OrderDetailSheet({ order, onClose }) {
	const qc = useQueryClient();
	const [proofUrl, setProofUrl] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)("pending");
	const [tracking, setTracking] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(null);
	const events = useQuery({
		...orderEventsQuery(order?.id ?? ""),
		enabled: !!order
	});
	(0, import_react.useEffect)(() => {
		if (!order) return;
		setStatus(order.status);
		setTracking(order.tracking_number ?? "");
		setNote(order.admin_note ?? "");
		setProofUrl(null);
		if (order.payment_proof_path) supabase.storage.from("payment-proofs").createSignedUrl(order.payment_proof_path, 600).then(({ data }) => setProofUrl(data?.signedUrl ?? null));
	}, [order]);
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, { open: false });
	const update = async (patch, kind, msg) => {
		setSaving(kind);
		const { error } = await supabase.from("orders").update(patch).eq("id", order.id);
		setSaving(null);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success(msg);
		await Promise.all([
			qc.invalidateQueries({ queryKey: ["admin", "orders"] }),
			qc.invalidateQueries({ queryKey: [
				"admin",
				"order-events",
				order.id
			] }),
			qc.invalidateQueries({ queryKey: ["admin", "settings"] })
		]);
		onClose();
	};
	const approve = () => update({
		payment_status: "verified",
		status: order.status === "pending" ? "confirmed" : order.status,
		admin_note: note || null
	}, "approve", "Payment approved — order confirmed");
	const reject = () => {
		if (!note.trim()) {
			toast.error("Add a short reason in the note so the customer knows why");
			return;
		}
		update({
			payment_status: "rejected",
			status: "cancelled",
			admin_note: note
		}, "reject", "Payment rejected — order cancelled");
	};
	const save = () => update({
		status,
		tracking_number: tracking || null,
		admin_note: note || null
	}, "save", "Order updated");
	const copy = (v) => {
		navigator.clipboard?.writeText(v);
		toast.success("Copied");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: !!order,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			side: "right",
			className: "w-full overflow-y-auto bg-background p-0 sm:max-w-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
				className: "sticky top-0 z-10 border-b border-border bg-background/95 px-6 py-5 text-left backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
					className: "font-display text-2xl font-normal",
					children: order.order_number
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderStatusBadge, { status: order.status }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentBadge, {
								status: order.payment_status,
								method: order.payment_method
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs",
								children: format(new Date(order.created_at), "d MMM yyyy, h:mm a")
							})
						]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 px-6 py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground",
								children: "Customer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-lg font-semibold",
								children: order.customer_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-muted-foreground" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: `tel:${order.phone}`,
												className: "hover:text-primary",
												children: order.phone
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => copy(order.phone),
												"aria-label": "Copy phone",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5 text-muted-foreground" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: `https://wa.me/92${order.phone.slice(1)}`,
												target: "_blank",
												rel: "noreferrer",
												className: "text-xs text-primary hover:underline",
												children: "WhatsApp"
											})
										]
									}),
									order.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: order.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											order.address,
											", ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: order.city
											})
										] })]
									}),
									order.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "rounded-xl bg-muted p-3 text-muted-foreground",
										children: [
											"“",
											order.notes,
											"”"
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground",
								children: "Items"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									order.bundle_name,
									" pack (",
									order.bundle_pieces,
									" pc) × ",
									order.quantity
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPKR(order.subtotal) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex justify-between text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Delivery" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: order.delivery_fee ? formatPKR(order.delivery_fee) : "Free" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex justify-between border-t border-border pt-3 font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Total · ",
									order.total_pieces,
									" applicators"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPKR(order.total) })]
							})
						]
					}),
					order.payment_method === "easypaisa" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl border-2 border-primary/20 bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground",
								children: "Easypaisa payment"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-3 grid grid-cols-2 gap-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Transaction ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-mono font-semibold",
										children: order.easypaisa_txn_id ?? "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Sent from"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-medium",
										children: order.easypaisa_sender_number ?? "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Expected amount"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-semibold text-primary",
										children: formatPKR(order.total)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: PAYMENT_STATUS_LABEL[order.payment_status] })] })
								]
							}),
							order.payment_proof_path && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4",
								children: proofUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: proofUrl,
									target: "_blank",
									rel: "noreferrer",
									className: "group block overflow-hidden rounded-xl border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: proofUrl,
										alt: "Payment receipt",
										className: "max-h-96 w-full bg-muted object-contain transition-transform group-hover:scale-[1.02]"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center justify-center gap-1 py-2 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" }), "Open full size"]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-40 place-items-center rounded-xl bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" })
								})
							}),
							!order.payment_proof_path && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 rounded-xl bg-muted p-3 text-xs text-muted-foreground",
								children: "No receipt screenshot — verify using the transaction ID."
							}),
							order.payment_status === "pending_verification" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "hero",
									size: "lg",
									onClick: approve,
									disabled: !!saving,
									children: [saving === "approve" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {}), "Approve"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "destructive",
									size: "lg",
									className: "rounded-full",
									onClick: reject,
									disabled: !!saving,
									children: [saving === "reject" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, {}), "Reject"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-4 rounded-2xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground",
								children: "Fulfilment"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Order status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: status,
										onValueChange: (v) => setStatus(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-11 rounded-xl",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: s,
											children: ORDER_STATUS_LABEL[s]
										}, s)) })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Courier tracking #" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: tracking,
										onChange: (e) => setTracking(e.target.value),
										placeholder: "e.g. TCS / Leopards ID",
										className: "h-11 rounded-xl"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Note to customer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: note,
									onChange: (e) => setNote(e.target.value),
									placeholder: "Shown on the customer's tracking page (e.g. reason for rejection)",
									className: "rounded-xl"
								})]
							}),
							status === "cancelled" && order.status !== "cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Cancelling returns ",
									order.total_pieces,
									" pieces to stock."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ink",
								size: "lg",
								className: "w-full",
								onClick: save,
								disabled: !!saving,
								children: [saving === "save" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }), "Save changes"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground",
						children: "History"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-3 space-y-3 border-l border-border pl-4",
						children: (events.data ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "relative text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-medium",
									children: [
										ORDER_STATUS_LABEL[e.status],
										" ·",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-normal text-muted-foreground",
											children: PAYMENT_STATUS_LABEL[e.payment_status]
										})
									]
								}),
								e.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: e.note
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: format(new Date(e.created_at), "d MMM, h:mm a")
								})
							]
						}, e.id))
					})] })
				]
			})]
		})
	});
}
var FILTERS = [
	{
		key: "all",
		label: "All"
	},
	{
		key: "verify",
		label: "Needs verification"
	},
	{
		key: "pending",
		label: "New"
	},
	{
		key: "confirmed",
		label: "Confirmed"
	},
	{
		key: "processing",
		label: "Packing"
	},
	{
		key: "shipped",
		label: "Shipped"
	},
	{
		key: "delivered",
		label: "Delivered"
	},
	{
		key: "cancelled",
		label: "Cancelled"
	}
];
function OrdersPage() {
	const { data: orders, isLoading, error } = useQuery(ordersQuery);
	const { data: settings } = useQuery(adminSettingsQuery);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const stats = (0, import_react.useMemo)(() => {
		const list = orders ?? [];
		const active = list.filter((o) => o.status !== "cancelled");
		return {
			today: list.filter((o) => isToday(new Date(o.created_at))).length,
			verify: list.filter((o) => o.payment_status === "pending_verification").length,
			revenue: active.filter((o) => o.status === "delivered" || o.payment_status === "verified").reduce((s, o) => s + o.total, 0),
			open: active.filter((o) => o.status !== "delivered").length
		};
	}, [orders]);
	const counts = (0, import_react.useMemo)(() => {
		const c = {
			all: orders?.length ?? 0,
			verify: stats.verify
		};
		for (const o of orders ?? []) c[o.status] = (c[o.status] ?? 0) + 1;
		return c;
	}, [orders, stats.verify]);
	const filtered = (0, import_react.useMemo)(() => {
		const term = q.trim().toLowerCase();
		return (orders ?? []).filter((o) => {
			if (filter === "verify" && o.payment_status !== "pending_verification") return false;
			if (filter !== "all" && filter !== "verify" && o.status !== filter) return false;
			if (!term) return true;
			return [
				o.order_number,
				o.customer_name,
				o.phone,
				o.city,
				o.easypaisa_txn_id ?? ""
			].some((v) => v.toLowerCase().includes(term));
		});
	}, [
		orders,
		filter,
		q
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-light sm:text-4xl",
					children: "Orders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Review payments, update delivery status and keep customers informed."
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Clock,
						label: "Orders today",
						value: String(stats.today)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: CircleAlert,
						label: "Awaiting verification",
						value: String(stats.verify),
						highlight: stats.verify > 0,
						onClick: () => setFilter("verify")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Wallet,
						label: "Collected / verified",
						value: formatPKR(stats.revenue)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Boxes,
						label: "Stock left",
						value: settings ? `${settings.stock_count} pc` : "—",
						highlight: !!settings && settings.stock_count <= settings.low_stock_threshold
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 rounded-3xl border border-border bg-card p-3 shadow-card sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search order #, name, phone, city or TID",
						className: "h-11 rounded-xl pl-10"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1",
					children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setFilter(f.key),
						className: cn("shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all", filter === f.key ? "bg-ink text-ink-foreground" : "bg-muted text-muted-foreground hover:text-foreground"),
						children: [
							f.label,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 opacity-60",
								children: counts[f.key] ?? 0
							})
						]
					}, f.key))
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-40 place-items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" })
			}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl bg-destructive/10 p-4 text-sm text-destructive",
				children: "Couldn't load orders."
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground",
				children: "No orders here yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden overflow-hidden rounded-3xl border border-border bg-card shadow-card md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-semibold",
								children: "Order"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-semibold",
								children: "Customer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-semibold",
								children: "Pack"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-semibold",
								children: "Total"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-semibold",
								children: "Payment"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-semibold",
								children: "Status"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						onClick: () => setSelected(o),
						className: "cursor-pointer border-t border-border transition-colors hover:bg-secondary/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-5 py-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: o.order_number
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: format(new Date(o.created_at), "d MMM, h:mm a")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-5 py-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: o.customer_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										o.phone,
										" · ",
										o.city
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-5 py-4",
								children: [
									o.bundle_name,
									" × ",
									o.quantity
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-4 font-semibold tabular-nums",
								children: formatPKR(o.total)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentBadge, {
									status: o.payment_status,
									method: o.payment_method
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderStatusBadge, { status: o.status })
							})
						]
					}, o.id)) })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3 md:hidden",
				children: filtered.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSelected(o),
					className: "w-full rounded-2xl border border-border bg-card p-4 text-left shadow-card transition-all active:scale-[0.99]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: o.order_number
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-sm",
									children: [
										o.customer_name,
										" · ",
										o.city
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "shrink-0 font-semibold tabular-nums",
								children: formatPKR(o.total)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderStatusBadge, { status: o.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentBadge, {
								status: o.payment_status,
								method: o.payment_method
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [
								format(new Date(o.created_at), "d MMM, h:mm a"),
								" · ",
								o.bundle_name,
								" × ",
								o.quantity
							]
						})
					]
				}, o.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderDetailSheet, {
				order: selected,
				onClose: () => setSelected(null)
			})
		]
	});
}
function Stat({ icon: Icon, label, value, highlight, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(onClick ? "button" : "div", {
		type: onClick ? "button" : void 0,
		onClick,
		className: cn("rounded-3xl border bg-card p-4 text-left shadow-card transition-all sm:p-5", highlight ? "border-primary/40 ring-2 ring-primary/10" : "border-border", onClick && "hover:-translate-y-0.5"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-5 w-5", highlight ? "text-primary" : "text-muted-foreground") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-display text-2xl tabular-nums sm:text-3xl",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: label
			})
		]
	});
}
//#endregion
export { OrdersPage as component };
