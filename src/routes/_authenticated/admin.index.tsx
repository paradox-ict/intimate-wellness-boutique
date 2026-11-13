import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { format, isToday } from "date-fns";
import { AlertCircle, Boxes, Clock, Loader2, Search, Wallet } from "lucide-react";
import { adminSettingsQuery, ordersQuery, type Order } from "@/lib/admin-queries";
import { formatPKR } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { OrderStatusBadge, PaymentBadge } from "@/components/admin/StatusBadge";
import { OrderDetailSheet } from "@/components/admin/OrderDetailSheet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: OrdersPage,
});

const FILTERS = [
  { key: "all", label: "All" },
  { key: "verify", label: "Needs verification" },
  { key: "pending", label: "New" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Packing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
] as const;

function OrdersPage() {
  const { data: orders, isLoading, error } = useQuery(ordersQuery);
  const { data: settings } = useQuery(adminSettingsQuery);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  const stats = useMemo(() => {
    const list = orders ?? [];
    const active = list.filter((o) => o.status !== "cancelled");
    return {
      today: list.filter((o) => isToday(new Date(o.created_at))).length,
      verify: list.filter((o) => o.payment_status === "pending_verification").length,
      revenue: active.filter((o) => o.status === "delivered" || o.payment_status === "verified").reduce((s, o) => s + o.total, 0),
      open: active.filter((o) => o.status !== "delivered").length,
    };
  }, [orders]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders?.length ?? 0, verify: stats.verify };
    for (const o of orders ?? []) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders, stats.verify]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (orders ?? []).filter((o) => {
      if (filter === "verify" && o.payment_status !== "pending_verification") return false;
      if (filter !== "all" && filter !== "verify" && o.status !== filter) return false;
      if (!term) return true;
      return [o.order_number, o.customer_name, o.phone, o.city, o.easypaisa_txn_id ?? ""].some((v) => v.toLowerCase().includes(term));
    });
  }, [orders, filter, q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-light sm:text-4xl">Orders</h1>
          <p className="text-sm text-muted-foreground">Review payments, update delivery status and keep customers informed.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={Clock} label="Orders today" value={String(stats.today)} />
        <Stat icon={AlertCircle} label="Awaiting verification" value={String(stats.verify)} highlight={stats.verify > 0} onClick={() => setFilter("verify")} />
        <Stat icon={Wallet} label="Collected / verified" value={formatPKR(stats.revenue)} />
        <Stat icon={Boxes} label="Stock left" value={settings ? `${settings.stock_count} pc` : "—"} highlight={!!settings && settings.stock_count <= settings.low_stock_threshold} />
      </div>

      <div className="space-y-3 rounded-3xl border border-border bg-card p-3 shadow-card sm:p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order #, name, phone, city or TID" className="h-11 rounded-xl pl-10" />
        </div>
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {FILTERS.map((f) => (
            <button key={f.key} type="button" onClick={() => setFilter(f.key)} className={cn("shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all", filter === f.key ? "bg-ink text-ink-foreground" : "bg-muted text-muted-foreground hover:text-foreground")}>
              {f.label} <span className="ml-1 opacity-60">{counts[f.key] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid h-40 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : error ? (
        <p className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">Couldn't load orders.</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">No orders here yet.</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-3xl border border-border bg-card shadow-card md:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-5 py-3 font-semibold">Order</th><th className="px-5 py-3 font-semibold">Customer</th><th className="px-5 py-3 font-semibold">Pack</th><th className="px-5 py-3 font-semibold">Total</th><th className="px-5 py-3 font-semibold">Payment</th><th className="px-5 py-3 font-semibold">Status</th></tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} onClick={() => setSelected(o)} className="cursor-pointer border-t border-border transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4"><p className="font-semibold">{o.order_number}</p><p className="text-xs text-muted-foreground">{format(new Date(o.created_at), "d MMM, h:mm a")}</p></td>
                    <td className="px-5 py-4"><p className="font-medium">{o.customer_name}</p><p className="text-xs text-muted-foreground">{o.phone} · {o.city}</p></td>
                    <td className="px-5 py-4">{o.bundle_name} × {o.quantity}</td>
                    <td className="px-5 py-4 font-semibold tabular-nums">{formatPKR(o.total)}</td>
                    <td className="px-5 py-4"><PaymentBadge status={o.payment_status} method={o.payment_method} /></td>
                    <td className="px-5 py-4"><OrderStatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((o) => (
              <button key={o.id} type="button" onClick={() => setSelected(o)} className="w-full rounded-2xl border border-border bg-card p-4 text-left shadow-card transition-all active:scale-[0.99]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="font-semibold">{o.order_number}</p><p className="truncate text-sm">{o.customer_name} · {o.city}</p></div>
                  <p className="shrink-0 font-semibold tabular-nums">{formatPKR(o.total)}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5"><OrderStatusBadge status={o.status} /><PaymentBadge status={o.payment_status} method={o.payment_method} /></div>
                <p className="mt-2 text-xs text-muted-foreground">{format(new Date(o.created_at), "d MMM, h:mm a")} · {o.bundle_name} × {o.quantity}</p>
              </button>
            ))}
          </div>
        </>
      )}

      <OrderDetailSheet order={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function Stat({ icon: Icon, label, value, highlight, onClick }: { icon: typeof Clock; label: string; value: string; highlight?: boolean; onClick?: () => void }) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp type={onClick ? "button" : undefined} onClick={onClick} className={cn("rounded-3xl border bg-card p-4 text-left shadow-card transition-all sm:p-5", highlight ? "border-primary/40 ring-2 ring-primary/10" : "border-border", onClick && "hover:-translate-y-0.5")}>
      <Icon className={cn("h-5 w-5", highlight ? "text-primary" : "text-muted-foreground")} />
      <p className="mt-3 font-display text-2xl tabular-nums sm:text-3xl">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </Comp>
  );
}
