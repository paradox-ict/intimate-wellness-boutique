import { t as supabase } from "./client-CfC-VICC.mjs";
import { t as queryOptions } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-queries-EJ0MfgsU.js
var isAdminQuery = (userId) => queryOptions({
	queryKey: ["is-admin", userId],
	queryFn: async () => {
		const { data, error } = await supabase.rpc("has_role", {
			_user_id: userId,
			_role: "admin"
		});
		if (error) throw error;
		return !!data;
	}
});
var ordersQuery = queryOptions({
	queryKey: ["admin", "orders"],
	queryFn: async () => {
		const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(1e3);
		if (error) throw error;
		return data;
	},
	refetchInterval: 3e4
});
var orderEventsQuery = (orderId) => queryOptions({
	queryKey: [
		"admin",
		"order-events",
		orderId
	],
	queryFn: async () => {
		const { data, error } = await supabase.from("order_events").select("*").eq("order_id", orderId).order("created_at");
		if (error) throw error;
		return data;
	}
});
var adminBundlesQuery = queryOptions({
	queryKey: ["admin", "bundles"],
	queryFn: async () => {
		const { data, error } = await supabase.from("bundles").select("*").order("sort_order");
		if (error) throw error;
		return data;
	}
});
var adminSettingsQuery = queryOptions({
	queryKey: ["admin", "settings"],
	queryFn: async () => {
		const { data, error } = await supabase.from("store_settings").select("*").eq("id", 1).single();
		if (error) throw error;
		return data;
	}
});
//#endregion
export { ordersQuery as a, orderEventsQuery as i, adminSettingsQuery as n, isAdminQuery as r, adminBundlesQuery as t };
