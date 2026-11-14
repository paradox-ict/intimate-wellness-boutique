import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type Bundle = Database["public"]["Tables"]["bundles"]["Row"];
export type StoreSettings = Database["public"]["Tables"]["store_settings"]["Row"];

export const isAdminQuery = (userId: string) =>
  queryOptions({
    queryKey: ["is-admin", userId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
      if (error) throw error;
      return !!data;
    },
  });

export const ordersQuery = queryOptions({
  queryKey: ["admin", "orders"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw error;
    return data;
  },
  refetchInterval: 30_000,
});

export const orderEventsQuery = (orderId: string) =>
  queryOptions({
    queryKey: ["admin", "order-events", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_events")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

export const adminBundlesQuery = queryOptions({
  queryKey: ["admin", "bundles"],
  queryFn: async () => {
    const { data, error } = await supabase.from("bundles").select("*").order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const adminSettingsQuery = queryOptions({
  queryKey: ["admin", "settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("store_settings").select("*").eq("id", 1).single();
    if (error) throw error;
    return data;
  },
});
