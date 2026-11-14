import { _ as createFileRoute, g as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DzcPqPW_.js
var $$splitComponentImporter = () => import("./admin-DooH5vPS.mjs");
var Route = createFileRoute("/_authenticated/admin")({
	head: () => ({ meta: [
		{ title: "Admin — Sukoon" },
		{
			name: "description",
			content: "Sukoon store administration."
		},
		{
			property: "og:title",
			content: "Admin — Sukoon"
		},
		{
			property: "og:description",
			content: "Store administration."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
