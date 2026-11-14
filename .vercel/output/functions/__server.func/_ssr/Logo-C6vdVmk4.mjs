import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn } from "./button-Ch79ysix.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Logo-C6vdVmk4.js
var import_jsx_runtime = require_jsx_runtime();
function Logo({ className, invert = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: cn("group inline-flex items-center gap-2", className),
		"aria-label": "Sukoon home",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand shadow-glow transition-transform duration-500 group-hover:rotate-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 24 24",
				className: "h-5 w-5 text-primary-foreground",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.6",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 21c-4-3-6-6.5-6-10a6 6 0 0 1 12 0c0 3.5-2 7-6 10Z" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 21V9" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 13c-1.6-.4-2.8-1.6-3-3.2M12 11c1.6-.4 2.8-1.6 3-3.2" })
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("font-display text-2xl font-medium italic leading-none", invert ? "text-ink-foreground" : "text-foreground"),
			children: "Sukoon"
		})]
	});
}
//#endregion
export { Logo as t };
