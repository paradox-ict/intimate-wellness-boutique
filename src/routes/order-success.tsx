import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Check, Copy, Lock, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { StoreShell } from "@/components/store/StoreShell";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/format";
import { copyText } from "@/lib/utils";

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
};

export const Route = createFileRoute("/order-success")({
  validateSearch: z.object({ order: z.string().max(20).optional() }),
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
  const [stored, setStored] = useState<LastOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setStored(JSON.parse(sessionStorage.getItem("sukoon-last-order") ?? "null"));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  // The order number lives in the URL (?order=SK-XXXXXX) so it survives a
  // refresh, a shared link, or a cleared tab — sessionStorage is only a
  // fallback for the total / payment method details.
  const orderNumber = search.order ?? stored?.orderNumber ?? null;
  const order: LastOrder | null =
    orderNumber && stored && stored.orderNumber === orderNumber
      ? stored
      : orderNumber
        ? { orderNumber, total: 0, paymentMethod: "cod", phone: "" }
        : null;
  const hasDetails = !!stored && stored.orderNumber === orderNumber;

  // Every Track link on the page — header, mobile menu, footer — must carry
  // the order number, not just the main Track button.
  useEffect(() => {
    if (!orderNumber) return;
    const href = `/track?order=${encodeURIComponent(orderNumber)}`;
    document
      .querySelectorAll('header a[href="/track"], footer a[href="/track"]')
      .forEach((a) => a.setAttribute("href", href));
  }, [orderNumber]);

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
                    : "Your Rs 400 advance via Easypaisa is being verified. Once confirmed, we'll pack and dispatch your order — please pay the remaining product price in cash when your parcel arrives."
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
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Advance (Easypaisa) — verifying
                          </span>
                          <span className="font-semibold">
                            {order.advanceDue !== undefined
                              ? formatPKR(order.advanceDue)
                              : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pay on delivery (cash)</span>
                          <span className="font-semibold">
                            {order.balanceDue !== undefined
                              ? formatPKR(order.balanceDue)
                              : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-2 font-semibold">
                          <span>Order total</span>
                          <span>{formatPKR(order.total)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid via Easypaisa</span>
                        <span className="font-semibold">{formatPKR(order.total)}</span>
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
              <Link to="/track" search={{ order: order?.orderNumber }}>
                <PackageSearch />
                Track order
              </Link>
            </Button>
            <Button variant="line" size="xl" asChild>
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </section>
    </StoreShell>
  );
}
