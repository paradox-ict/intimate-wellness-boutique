import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Copy, Lock, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { StoreShell } from "@/components/store/StoreShell";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/format";

type LastOrder = {
  orderNumber: string;
  total: number;
  paymentMethod: "cod" | "easypaisa";
  phone: string;
};

export const Route = createFileRoute("/order-success")({
  head: () => ({
    meta: [
      { title: "Thank You — Your Order Is Placed | Sukoon" },
      {
        name: "description",
        content: "Your Sukoon order has been received and will be delivered in plain packaging.",
      },
      { property: "og:title", content: "Order placed — Sukoon" },
      { property: "og:description", content: "Your discreet order has been received." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      setOrder(JSON.parse(sessionStorage.getItem("sukoon-last-order") ?? "null"));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

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
            <p className="mt-4 text-muted-foreground">
              Your order was placed. Use the Track order page to see its status.
            </p>
          )}
          {order && (
            <div className="animate-fade-up [animation-delay:250ms]">
              <p className="mt-4 text-muted-foreground">
                {order.paymentMethod === "easypaisa"
                  ? "We've received your order and Easypaisa details. We'll verify your payment and confirm shortly."
                  : "Your order is confirmed for Cash on Delivery. We'll call to confirm before dispatch."}
              </p>
              <div className="mt-8 rounded-3xl border border-border/70 bg-card p-6 text-left shadow-card">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Your order number
                </p>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(order.orderNumber);
                    toast.success("Copied");
                  }}
                  className="mt-1 flex items-center gap-2 font-display text-3xl hover:text-primary"
                >
                  {order.orderNumber} <Copy className="h-5 w-5" />
                </button>
                <p className="mt-1 text-sm text-muted-foreground">Save it to track your order.</p>
                <div className="mt-5 flex justify-between border-t border-border pt-4 text-sm">
                  <span className="text-muted-foreground">
                    {order.paymentMethod === "cod" ? "Pay on delivery" : "Paid via Easypaisa"}
                  </span>
                  <span className="font-semibold">{formatPKR(order.total)}</span>
                </div>
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
