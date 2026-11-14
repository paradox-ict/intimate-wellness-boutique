import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Check, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart";
import { storefrontQuery } from "@/lib/storefront-query";
import { formatPKR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

export function Bundles() {
  const { data } = useSuspenseQuery(storefrontQuery);
  const { add } = useCart();
  const featured = data.bundles.find((b) => b.badge)?.id ?? data.bundles[0]?.id;
  const [selected, setSelected] = useState<string | undefined>(featured);
  const { settings } = data;

  return (
    <section id="bundles" className="scroll-mt-24 bg-blush px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Choose your pack"
          title={
            <>
              Save more with a <em className="text-brand">full cycle</em>
            </>
          }
          intro="Every pack ships in plain, unbranded packaging. Pay on delivery or via Easypaisa."
        />

        {settings.low_stock && (
          <p className="mx-auto mt-6 w-fit rounded-full bg-warning px-4 py-1.5 text-xs font-semibold text-warning-foreground">
            Only {settings.stock_count} pieces left in stock
          </p>
        )}

        <div role="radiogroup" aria-label="Pack size" className="mt-12 grid gap-4 md:grid-cols-3">
          {data.bundles.map((b, i) => {
            const isSel = b.id === selected;
            const perPiece = Math.round(b.price / b.pieces);
            const save = b.compare_at_price ? b.compare_at_price - b.price : 0;
            return (
              <Reveal key={b.id} delay={i * 100}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSel}
                  onClick={() => setSelected(b.id)}
                  className={cn(
                    "group relative flex h-full w-full flex-col rounded-[2rem] border-2 bg-card p-6 text-left transition-all duration-500 sm:p-7",
                    isSel
                      ? "border-primary shadow-soft md:-translate-y-2"
                      : "border-transparent shadow-card hover:border-primary/30",
                  )}
                >
                  {b.badge && (
                    <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-glow">
                      <Sparkles className="h-3 w-3" /> {b.badge}
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-3xl">{b.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{b.tagline}</p>
                    </div>
                    <span
                      className={cn(
                        "grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all",
                        isSel
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border",
                      )}
                    >
                      {isSel && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </div>

                  <div className="mt-6 flex items-end gap-1.5" aria-hidden="true">
                    {Array.from({ length: b.pieces }).map((_, k) => (
                      <span
                        key={k}
                        className={cn(
                          "w-3 rounded-full transition-all duration-500",
                          isSel ? "bg-brand" : "bg-secondary",
                        )}
                        style={{ height: `${28 + (k % 2) * 8}px`, transitionDelay: `${k * 60}ms` }}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-muted-foreground">
                      {b.pieces} applicator{b.pieces > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-4xl tabular-nums">{formatPKR(b.price)}</span>
                    {b.compare_at_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPKR(b.compare_at_price)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatPKR(perPiece)} per applicator
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
                    {save > 0 && (
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                        Save {formatPKR(save)}
                      </span>
                    )}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1",
                        b.free_delivery
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Truck className="h-3 w-3" />{" "}
                      {b.free_delivery
                        ? "Free delivery"
                        : `Delivery ${formatPKR(settings.delivery_fee)}`}
                    </span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 flex flex-col items-center gap-3">
          <Button
            variant="hero"
            size="xl"
            className="w-full max-w-sm"
            disabled={!selected || !settings.in_stock}
            onClick={() => selected && add(selected)}
          >
            {settings.in_stock ? "Add to bag" : "Out of stock"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Cash on Delivery · Easypaisa · 2–4 working days nationwide
          </p>
          <Link to="/product" className="text-sm font-medium text-primary hover:underline">
            See full product details →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
