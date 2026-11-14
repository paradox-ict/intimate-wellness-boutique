import { _ as createFileRoute, g as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track-ClGgYe4N.js
var $$splitComponentImporter = () => import("./track-D9GQRNFD.mjs");
var Route = createFileRoute("/track")({
	validateSearch: objectType({ order: stringType().max(20).optional() }),
	head: () => ({ meta: [
		{ title: "Track Your Order — Sukoon" },
		{
			name: "description",
			content: "Check the status of your Sukoon order with your order number and mobile number."
		},
		{
			property: "og:title",
			content: "Track Your Order — Sukoon"
		},
		{
			property: "og:description",
			content: "Check your discreet order's delivery status."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
