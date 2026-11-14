import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CfC-VICC.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as adminSettingsQuery, t as adminBundlesQuery } from "./admin-queries-EJ0MfgsU.mjs";
import { n as cn, t as Button } from "./button-Ch79ysix.mjs";
import { g as Plus, k as LoaderCircle, o as Trash2 } from "../_libs/lucide-react.mjs";
import { i as formatPKR } from "./format-Cytqc9Qw.mjs";
import { n as Label, t as Input } from "./label-BB4ZlleZ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.packs-DKTz8pXZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function PacksPage() {
	const qc = useQueryClient();
	const { data: bundles, isLoading } = useQuery(adminBundlesQuery);
	const { data: settings } = useQuery(adminSettingsQuery);
	const [stock, setStock] = (0, import_react.useState)("");
	const [threshold, setThreshold] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (settings) {
			setStock(String(settings.stock_count));
			setThreshold(String(settings.low_stock_threshold));
		}
	}, [settings]);
	const refresh = () => Promise.all([qc.invalidateQueries({ queryKey: ["admin"] }), qc.invalidateQueries({ queryKey: ["storefront"] })]);
	const saveStock = async () => {
		const s = parseInt(stock, 10);
		const t = parseInt(threshold, 10);
		if (!Number.isFinite(s) || s < 0 || !Number.isFinite(t) || t < 0) {
			toast.error("Enter valid numbers");
			return;
		}
		setSaving(true);
		const { error } = await supabase.from("store_settings").update({
			stock_count: s,
			low_stock_threshold: t
		}).eq("id", 1);
		setSaving(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Stock updated");
		refresh();
	};
	const addBundle = async () => {
		const { error } = await supabase.from("bundles").insert({
			name: "New pack",
			pieces: 2,
			price: 2799,
			sort_order: (bundles?.length ?? 0) + 1,
			is_active: false
		});
		if (error) {
			toast.error(error.message);
			return;
		}
		refresh();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-light sm:text-4xl",
				children: "Packs & stock"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Stock is counted in individual applicators. Orders reduce it automatically; cancellations put it back."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-light",
					children: "Inventory"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Applicators in stock" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								value: stock,
								onChange: (e) => setStock(e.target.value),
								className: "h-11 rounded-xl"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Show \"low stock\" below" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								value: threshold,
								onChange: (e) => setThreshold(e.target.value),
								className: "h-11 rounded-xl"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ink",
							size: "lg",
							onClick: saveStock,
							disabled: saving,
							children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }), "Save stock"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-light",
						children: "Bundle pricing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "soft",
						size: "sm",
						onClick: addBundle,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Add pack"]
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-32 place-items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 lg:grid-cols-2",
					children: bundles?.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BundleEditor, {
						bundle: b,
						onSaved: refresh
					}, b.id))
				})]
			})
		]
	});
}
function BundleEditor({ bundle, onSaved }) {
	const [f, setF] = (0, import_react.useState)({
		name: bundle.name,
		tagline: bundle.tagline ?? "",
		pieces: String(bundle.pieces),
		price: String(bundle.price),
		compare_at_price: bundle.compare_at_price ? String(bundle.compare_at_price) : "",
		badge: bundle.badge ?? "",
		sort_order: String(bundle.sort_order),
		free_delivery: bundle.free_delivery,
		is_active: bundle.is_active
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const set = (k) => (e) => setF((p) => ({
		...p,
		[k]: e.target.value
	}));
	const save = async () => {
		const pieces = parseInt(f.pieces, 10);
		const price = parseInt(f.price, 10);
		const compare = f.compare_at_price ? parseInt(f.compare_at_price, 10) : null;
		if (!f.name.trim() || !(pieces > 0) || !(price >= 0)) {
			toast.error("Name, pieces and price are required");
			return;
		}
		setBusy(true);
		const { error } = await supabase.from("bundles").update({
			name: f.name.trim(),
			tagline: f.tagline.trim() || null,
			pieces,
			price,
			compare_at_price: compare,
			badge: f.badge.trim() || null,
			sort_order: parseInt(f.sort_order, 10) || 0,
			free_delivery: f.free_delivery,
			is_active: f.is_active
		}).eq("id", bundle.id);
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success(`${f.name} saved`);
		onSaved();
	};
	const remove = async () => {
		if (!confirm(`Delete the "${bundle.name}" pack? Past orders keep their details.`)) return;
		const { error } = await supabase.from("bundles").delete().eq("id", bundle.id);
		if (error) {
			toast.error(error.message);
			return;
		}
		onSaved();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 rounded-3xl border border-border bg-card p-5 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl",
					children: f.name || "Untitled"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-xs font-medium text-muted-foreground",
					children: [
						f.is_active ? "Visible" : "Hidden",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: f.is_active,
							onCheckedChange: (v) => setF((p) => ({
								...p,
								is_active: v
							}))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: f.name,
							onChange: set("name"),
							className: "rounded-xl"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Applicators" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 1,
							value: f.pieces,
							onChange: set("pieces"),
							className: "rounded-xl"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Price (Rs)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							value: f.price,
							onChange: set("price"),
							className: "rounded-xl"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Was price (Rs)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							value: f.compare_at_price,
							onChange: set("compare_at_price"),
							placeholder: "optional",
							className: "rounded-xl"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tagline" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: f.tagline,
							onChange: set("tagline"),
							className: "rounded-xl"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Badge" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: f.badge,
							onChange: set("badge"),
							placeholder: "e.g. Best value",
							className: "rounded-xl"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Display order" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: f.sort_order,
							onChange: set("sort_order"),
							className: "rounded-xl"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center justify-between rounded-xl bg-muted px-4 py-3 text-sm",
				children: [
					"Free delivery on this pack",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: f.free_delivery,
						onCheckedChange: (v) => setF((p) => ({
							...p,
							free_delivery: v
						}))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: parseInt(f.pieces) > 0 && parseInt(f.price) >= 0 ? `${formatPKR(parseInt(f.price) / parseInt(f.pieces))} per applicator` : ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: remove,
						"aria-label": "Delete pack",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ink",
						onClick: save,
						disabled: busy,
						children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }), "Save"]
					})]
				})]
			})
		]
	});
}
//#endregion
export { PacksPage as component };
