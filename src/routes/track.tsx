import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader2, PackageSearch } from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";
import { OrderTimeline } from "@/components/store/OrderTimeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackOrder, type TrackedOrder } from "@/lib/store.functions";
import { normalizePkPhone } from "@/lib/format";

export const Route = createFileRoute("/track")({
  validateSearch: z.object({ order: z.string().max(20).optional() }),
  head: () => ({
    meta: [
      { title: "Track Your Order — Sukoon" },
      {
        name: "description",
        content: "Check the status of your Sukoon order with your order number and mobile number.",
      },
      { property: "og:title", content: "Track Your Order — Sukoon" },
      { property: "og:description", content: "Check your discreet order's delivery status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const search = Route.useSearch();
  const lookup = useServerFn(trackOrder);
  const [orderNumber, setOrderNumber] = useState(search.order ?? "");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const run = async (num: string, ph: string) => {
    setError(null);
    if (num.trim().length < 4) return setError("Enter your order number");
    if (!normalizePkPhone(ph)) return setError("Enter the mobile number used at checkout");
    setLoading(true);
    try {
      const res = await lookup({ data: { orderNumber: num, phone: ph } });
      if (!res.order) setError("We couldn't find an order with those details.");
      setOrder(res.order);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const last = JSON.parse(sessionStorage.getItem("sukoon-last-order") ?? "null");
      if (last?.orderNumber && (!search.order || last.orderNumber === search.order)) {
        setOrderNumber(last.orderNumber);
        setPhone(last.phone);
        run(last.orderNumber, last.phone);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StoreShell>
      <section className="bg-hero px-5 py-14 md:py-20">
        <div className="mx-auto max-w-xl">
          <div className="animate-fade-up text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-primary-foreground shadow-glow">
              <PackageSearch className="h-6 w-6" />
            </span>
            <h1 className="mt-5 text-4xl font-light sm:text-5xl">Track your order</h1>
            <p className="mt-3 text-muted-foreground">
              Enter your order number and the mobile number you used at checkout.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(orderNumber, phone);
            }}
            className="animate-fade-up mt-8 space-y-4 rounded-3xl border border-border/70 bg-card p-5 shadow-card sm:p-7 [animation-delay:120ms]"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ord">Order number</Label>
                <Input
                  id="ord"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="SK-XXXXXX"
                  className="h-12 rounded-xl uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ph">Mobile number</Label>
                <Input
                  id="ph"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03XX XXXXXXX"
                  className="h-12 rounded-xl"
                />
              </div>
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Checking…
                </>
              ) : (
                "Track order"
              )}
            </Button>
          </form>
          {order && (
            <div className="animate-fade-up mt-6 rounded-3xl border border-border/70 bg-card p-5 shadow-card sm:p-7">
              <OrderTimeline order={order} />
            </div>
          )}
        </div>
      </section>
    </StoreShell>
  );
}
