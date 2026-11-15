import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, PackageSearch } from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";
import { OrderTimeline } from "@/components/store/OrderTimeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackOrder, type TrackedOrder } from "@/lib/store.functions";
import { resolveTrackStart } from "@/lib/track-start";
import { formatPkPhoneDisplay, normalizePkPhone } from "@/lib/format";
import { copyText } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/track")({
  validateSearch: z.object({
    order: z.string().max(20).optional(),
    // Email links use ?id= — accept it as an alias for ?order=.
    id: z.string().max(20).optional(),
    // Email "Track your order" links also carry ?phone= so the lookup can
    // auto-run with no typing.
    phone: z.string().max(15).optional(),
  }),
  head: () => ({
    meta: [
      { title: "Track Your Order — RoseCare" },
      {
        name: "description",
        content: "Check the status of your RoseCare order with your order number and mobile number.",
      },
      { property: "og:title", content: "Track Your Order — RoseCare" },
      { property: "og:description", content: "Check your discreet order's delivery status." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/track` },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/track` }],
  }),
  component: TrackPage,
});

function TrackPage() {
  const search = Route.useSearch();
  const searched = search.order ?? search.id;
  const lookup = useServerFn(trackOrder);
  const [orderNumber, setOrderNumber] = useState(searched ?? "");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const reset = () => {
    setOrder(null);
    setOrderNumber("");
    setPhone("");
    setError(null);
  };

  const run = async (num: string, ph: string, autoCopy = false) => {
    setError(null);
    if (num.trim().length < 4) return setError("Enter your order number");
    if (!normalizePkPhone(ph)) return setError("Enter the mobile number used at checkout");
    // A lookup in flight must never show the previous order — clear it so
    // the loading state is what the customer sees, not a stale timeline.
    setOrder(null);
    setLoading(true);
    try {
      const res = await lookup({ data: { orderNumber: num, phone: ph } });
      if (!res.order) setError("We couldn't find an order with those details.");
      setOrder(res.order);
      if (res.order && autoCopy) {
        // Email-link flow: the customer tapped Track in their email, so
        // copy the order number for them — no tap, no long-press. If the
        // browser blocks it (some need a tap first), fail silently; the
        // copy button on the order is the fallback.
        try {
          const ok = await copyText(num.trim().toUpperCase());
          if (ok) toast.success("Order number copied to clipboard");
        } catch {
          /* blocked — the on-page copy button is the fallback */
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // What to start with: URL params win (order + phone auto-runs the
    // lookup, order alone just pre-fills it); the last order in this tab
    // is only the fallback when the URL carries nothing. While the lookup
    // runs, run() clears any stale order and shows the loading state.
    let last: { orderNumber?: string; phone?: string } | null = null;
    try {
      last = JSON.parse(sessionStorage.getItem("sukoon-last-order") ?? "null");
    } catch {
      /* ignore */
    }
    const start = resolveTrackStart(search, last);
    setOrderNumber(start.orderNumber);
    setPhone(start.phone);
    // Auto-copy only for the email-link flow (URL params): the customer
    // tapped Track in their email. The stored-order fallback doesn't copy
    // — the customer just saw the number on the success page.
    if (start.autoRun) run(start.orderNumber, start.phone, !!(search.order ?? search.id));
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
                  onChange={(e) => setPhone(formatPkPhoneDisplay(e.target.value))}
                  onBlur={() => {
                    if (phone && !normalizePkPhone(phone))
                      setError("Enter a valid mobile number (03XX XXXXXXX)");
                  }}
                  placeholder="03XX XXXXXXX"
                  className="h-12 rounded-xl"
                />
              </div>
            </div>
            {error && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
                <p className="font-medium text-destructive">We couldn&apos;t find that order.</p>
                <p className="mt-1 text-muted-foreground">
                  Double-check your order number and the mobile number you used at checkout, then
                  try again — or message us on WhatsApp and we&apos;ll look it up for you.
                </p>
              </div>
            )}
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
          {loading && (
            <div className="mt-6 grid place-items-center gap-3 rounded-3xl border border-border/70 bg-card p-10 shadow-card">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Looking up your order…</p>
            </div>
          )}
          {order && (
            <div className="animate-fade-up mt-6 rounded-3xl border border-border/70 bg-card p-5 shadow-card sm:p-7">
              <OrderTimeline order={order} />
              <div className="mt-6 flex justify-center">
                <Button variant="line" onClick={reset}>
                  Track another order
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </StoreShell>
  );
}
