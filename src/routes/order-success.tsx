import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Check, Copy, Lock, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { StoreShell } from "@/components/store/StoreShell";
import { WhatsAppIcon } from "@/components/store/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { formatPKR, normalizePkPhone } from "@/lib/format";
import { trackOrder } from "@/lib/store.functions";
import { trackedToSuccessDetails } from "@/lib/success-details";
import { copyText } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/whatsapp";

type LastOrder = {
  orderNumber: string;
  total: number;
  paymentMethod: "cod" | "easypaisa";
  phone: string;
  // Present when the order was placed from this tab — the amounts shown on
  // the success page. Absent for shared links / cleared storage, where the
  // page shows neutral copy instead of guessing amounts.
  advanceDue?: number;
  balanceDue?: number;
  // True when the pack ships free — the advance came off the pack price
  // instead of being the delivery charge.
  freeDelivery?: boolean;
};

export const Route = createFileRoute("/order-success")({
  // The phone rides in the URL too (same pattern as the track deep-link)
  // so a fresh load can fetch the full breakdown when sessionStorage is
  // empty — a reload, a new tab, or a shared link.
  validateSearch: z.object({
    order: z.string().max(20).optional(),
    phone: z.string().max(15).optional(),
  }),
  head: () => ({
    meta: [
      { title: "Thank You — Your Order Is Placed | RoseCare" },
      {
        name: "description",
        content: "Your RoseCare order has been received and will be delivered in plain packaging.",
      },
      { property: "og:title", content: "Order placed — RoseCare" },
      { property: "og:description", content: "Your discreet order has been received." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const search = Route.useSearch();
  const lookup = useServerFn(trackOrder);
  const [stored, setStored] = useState<LastOrder | null>(null);
  // Fetched via trackOrder when sessionStorage has nothing for this order
  // (reload / new tab / shared link) — the full breakdown, from the server.
  const [fetched, setFetched] = useState<LastOrder | null>(null);
  const [fetching, setFetching] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let storedOrder: LastOrder | null = null;
    try {
      storedOrder = JSON.parse(sessionStorage.getItem("sukoon-last-order") ?? "null");
    } catch {
      /* ignore */
    }
    setStored(storedOrder);
    setLoaded(true);
    // sessionStorage is the fast path. On a miss, fetch the order with the
    // order number + phone from the URL — the same lookup the track page
    // uses. Without a phone there is nothing to look up, so the page keeps
    // the neutral copy as before.
    const phone = search.phone ? normalizePkPhone(search.phone) : null;
    if (search.order && phone && storedOrder?.orderNumber !== search.order) {
      setFetching(true);
      lookup({ data: { orderNumber: search.order, phone } })
        .then((res) => {
          if (cancelled || !res.order) return;
          setFetched({
            orderNumber: res.order.order_number,
            ...trackedToSuccessDetails(res.order, phone),
          });
        })
        .catch(() => {
          /* lookup failed — the neutral copy stays, no breakdown is guessed */
        })
        .finally(() => {
          if (!cancelled) setFetching(false);
        });
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The order number lives in the URL (?order=SK-XXXXXX) so it survives a
  // refresh, a shared link, or a cleared tab — sessionStorage is the fast
  // path for the breakdown, the trackOrder fetch is the fallback, and the
  // bare order number is the last resort (neutral copy, no amounts).
  const orderNumber = search.order ?? stored?.orderNumber ?? null;
  const storedMatch = stored && stored.orderNumber === orderNumber ? stored : null;
  const order: LastOrder | null =
    storedMatch ??
    fetched ??
    (orderNumber ? { orderNumber, total: 0, paymentMethod: "cod", phone: "" } : null);
  const hasDetails = !!(storedMatch ?? fetched);

  // Every Track link on the page — header, mobile menu, footer — must carry
  // the order number, not just the main Track button. The phone rides along
  // when we know it, so the lookup auto-runs on the track page.
  useEffect(() => {
    if (!orderNumber) return;
    const params = new URLSearchParams({ order: orderNumber });
    if (order?.phone) params.set("phone", order.phone);
    const href = `/track?${params.toString()}`;
    document
      .querySelectorAll('header a[href="/track"], footer a[href="/track"]')
      .forEach((a) => a.setAttribute("href", href));
  }, [orderNumber, order?.phone]);

  return (
    <StoreShell>
      <section className="bg-hero px-5 py-16 md:py-24">
        <div className="mx-auto max-w-lg text-center">
          <span className="animate-pop mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand text-primary-foreground shadow-glow">
            <Check className="h-9 w-9" strokeWidth={2.5} />
          </span>
          <h1 className="animate-fade-up mt-8 text-4xl font-light sm:text-5xl [animation-delay:150ms]">
            Thank you{order ? "" : "!"}
          </h1>
          {loaded && !order && (
            <div className="mt-6 rounded-3xl border border-border/70 bg-card p-6 text-left shadow-card">
              <p className="font-medium">We couldn&apos;t find your order number on this page.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                If you just placed an order, your order number is in your confirmation — or open the
                Track order page and enter it there with your mobile number.
              </p>
            </div>
          )}
          {order && (
            <div className="animate-fade-up [animation-delay:250ms]">
              <p className="mt-4 text-muted-foreground">
                {hasDetails
                  ? order.paymentMethod === "easypaisa"
                    ? "We've received your order and Easypaisa details. We'll verify your payment and confirm shortly."
                    : order.freeDelivery
                      ? "Your Rs 400 advance via Easypaisa is being verified. It comes off your pack price — delivery is free on this pack — so please pay the remaining balance in cash when your parcel arrives."
                      : "Your Rs 400 advance via Easypaisa is being verified. Once confirmed, we'll pack and dispatch your order — please pay the remaining product price in cash when your parcel arrives."
                  : fetching
                    ? "Loading your order details…"
                    : "Your order is placed. Your receipt was emailed to you — it has your order number and the amount to pay."}
              </p>
              <div className="mt-8 rounded-3xl border border-border/70 bg-card p-6 text-left shadow-card">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Your order number
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await copyText(order.orderNumber);
                    toast.success(
                      ok ? "✓ Copied — save it to track your order." : "Couldn't copy — long-press to copy it manually",
                    );
                  }}
                  className="mt-1 flex items-center gap-2 font-display text-3xl hover:text-primary"
                >
                  {order.orderNumber} <Copy className="h-5 w-5" />
                </button>
                <p className="mt-1 text-sm text-muted-foreground">Save it to track your order.</p>
                {hasDetails && (
                  <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                    {order.paymentMethod === "cod" ? (
                      <>
                        <div className="flex justify-between gap-3">
                          <span className="min-w-0 text-muted-foreground">
                            {order.freeDelivery ? (
                              "Advance (deducted from pack price) — verifying"
                            ) : (
                              <>
                                Advance paid now (
                                <img
                                  src="/images/easypaisa-mark.png"
                                  alt=""
                                  className="inline-block h-4 w-4 align-[-2px]"
                                />{" "}
                                Easypaisa) — verifying
                              </>
                            )}
                          </span>
                          <span className="shrink-0 whitespace-nowrap font-semibold">
                            {order.advanceDue !== undefined ? formatPKR(order.advanceDue) : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="min-w-0 text-muted-foreground">
                            Pay on delivery (cash)
                          </span>
                          <span className="shrink-0 whitespace-nowrap font-semibold">
                            {order.balanceDue !== undefined ? formatPKR(order.balanceDue) : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between gap-3 border-t border-border pt-2 font-semibold">
                          <span className="min-w-0">Order total</span>
                          <span className="shrink-0 whitespace-nowrap">
                            {formatPKR(order.total)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between gap-3">
                        <span className="min-w-0 text-muted-foreground">
                          Paid via{" "}
                          <img
                            src="/images/easypaisa-mark.png"
                            alt=""
                            className="inline-block h-4 w-4 align-[-2px]"
                          />{" "}
                          Easypaisa
                        </span>
                        <span className="shrink-0 whitespace-nowrap font-semibold">
                          {formatPKR(order.total)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            Arriving in a plain, unbranded box.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="hero" size="xl" asChild>
              <Link
                to="/track"
                search={{
                  order: order?.orderNumber,
                  phone: order?.phone ? order.phone : undefined,
                }}
              >
                <PackageSearch />
                Track order
              </Link>
            </Button>
            <Button variant="line" size="xl" asChild>
              <Link to="/">Back to home</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Questions about your order?{" "}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Message us on WhatsApp
            </a>
          </p>
        </div>
      </section>
    </StoreShell>
  );
}
