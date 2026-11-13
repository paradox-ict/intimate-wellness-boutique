import { queryOptions } from "@tanstack/react-query";
import { getStorefront } from "./store.functions";

export const storefrontQuery = queryOptions({
  queryKey: ["storefront"],
  queryFn: () => getStorefront(),
  staleTime: 30_000,
});
