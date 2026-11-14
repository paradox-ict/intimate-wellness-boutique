import { useEffect, useRef, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Phone, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { storefrontQuery } from "@/lib/storefront-query";
import { computeTotals, formatPKR } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Sticky buy bar — DELIBERATELY scroll-triggered, not always stuck.
 * It stays hidden at the top of the page and slides in only once the
 * visitor has scrolled (and hides again over the bundles section, where
 * the pack buttons already do the job). The owner likes this behaviour,
 * so keep it: never make this bar permanently fixed.
 */
export function StickyBuyBar() {
  const { data } = useSuspenseQuery(storefrontQuery);
  const { line, setOpen } = useCart();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const bundles = document.getElementById("bundles");
      const r = bundles?.getBoundingClientRect();
      const inBundles = r ? r.top < window.innerHeight && r.bottom > 0 : false;
      setShow(window.scrollY > 600 && !inBundles);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body clearance measured from the bar's real height, so the bar never
  // covers page content when it slides in.
  useEffect(() => {
    const h = barRef.current?.offsetHeight ?? 64;
    document.body.style.paddingBottom = show ? `${h + 16}px` : "";
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [show]);

  const bundle = data.bundles.find((b) => b.id === line?.bundleId) ?? null;
  const totals = bundle && line ? computeTotals(bundle, line.quantity, data.settings.delivery_fee) : null;
  const callNumber = (data.settings.support_whatsapp || "03115778995").replace(/\s/g, "");

  const goCheckout = () => {
    if (!line) {
      toast.error("Your bag is empty — choose a pack first.");
      setOpen(true);
      return;
    }
    void navigate({ to: "/checkout" });
  };

  return (
    <div
      ref={barRef}
      className={cn(
        "fixed inset-x-3 bottom-3 z-30 transition-all duration-500 md:hidden",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0",
      )}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/90 p-2 shadow-soft backdrop-blur-xl">
        <a
          href={`tel:${callNumber}`}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3.5 py-2.5 text-sm font-semibold text-secondary-foreground"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-brand px-3 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <ShoppingBag className="h-4 w-4 shrink-0" />
          <span className="truncate">{totals ? `Bag · ${formatPKR(totals.total)}` : "View Bag"}</span>
        </button>
        <button
          type="button"
          onClick={goCheckout}
          className="shrink-0 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-ink-foreground"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
