import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CfC-VICC.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as adminSettingsQuery } from "./admin-queries-EJ0MfgsU.mjs";
import { t as Button } from "./button-Ch79ysix.mjs";
import { k as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as Label, t as Input } from "./label-BB4ZlleZ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-Dd0cMwDx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const qc = useQueryClient();
	const { data } = useQuery(adminSettingsQuery);
	const [f, setF] = (0, import_react.useState)({
		easypaisa_account_name: "",
		easypaisa_number: "",
		delivery_fee: "",
		support_whatsapp: ""
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (data) setF({
			easypaisa_account_name: data.easypaisa_account_name,
			easypaisa_number: data.easypaisa_number,
			delivery_fee: String(data.delivery_fee),
			support_whatsapp: data.support_whatsapp
		});
	}, [data]);
	const set = (k) => (e) => setF((p) => ({
		...p,
		[k]: e.target.value
	}));
	const save = async () => {
		const fee = parseInt(f.delivery_fee, 10);
		if (!f.easypaisa_number.trim() || !f.easypaisa_account_name.trim() || !(fee >= 0)) {
			toast.error("Fill in all fields");
			return;
		}
		setBusy(true);
		const { error } = await supabase.from("store_settings").update({
			easypaisa_account_name: f.easypaisa_account_name.trim(),
			easypaisa_number: f.easypaisa_number.trim(),
			delivery_fee: fee,
			support_whatsapp: f.support_whatsapp.trim()
		}).eq("id", 1);
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Settings saved");
		qc.invalidateQueries({ queryKey: ["admin"] });
		qc.invalidateQueries({ queryKey: ["storefront"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-2xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-light sm:text-4xl",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "These details appear at checkout."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-light",
					children: "Easypaisa account"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Account number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: f.easypaisa_number,
							onChange: set("easypaisa_number"),
							placeholder: "03XX XXXXXXX",
							className: "h-11 rounded-xl"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Account title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: f.easypaisa_account_name,
							onChange: set("easypaisa_account_name"),
							className: "h-11 rounded-xl"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-light",
					children: "Delivery & support"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Delivery fee (Rs)" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								value: f.delivery_fee,
								onChange: set("delivery_fee"),
								className: "h-11 rounded-xl"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Charged on packs without free delivery."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Support WhatsApp" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: f.support_whatsapp,
							onChange: set("support_whatsapp"),
							className: "h-11 rounded-xl"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "hero",
				size: "xl",
				onClick: save,
				disabled: busy,
				children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }), "Save settings"]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
