import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Lock, ShoppingBag, Trash2, Truck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { storefrontQuery } from "@/lib/storefront-query";
import { computeTotals, formatPKR } from "@/lib/format";
import { QuantityStepper } from "./QuantityStepper";
import { cn } from "@/lib/utils";
import productImg from "@/assets/product-pack-m.jpg";

export function CartDrawer() {
  const { open, setOpen, line, setQuantity, setBundle, clear } = useCart();
  const { data } = useQuery(storefrontQuery);
  const bundle = data?.bundles.find((b) => b.id === line?.bundleId);
  const totals =
    bundle && line ? computeTotals(bundle, line.quantity, data!.settings.delivery_fee) : null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l-border bg-background p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border px-6 py-5 text-left">
          <SheetTitle className="font-display text-2xl font-normal">Your bag</SheetTitle>
          <SheetDescription className="flex items-center gap-1.5 text-xs">
            <Lock className="h-3.5 w-3.5" /> Ships in a plain, unbranded box
          </SheetDescription>
        </SheetHeader>

        {!bundle || !line ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="h-8 w-8 text-secondary-foreground" />
            </div>
            <p className="font-display text-xl">Your bag is empty</p>
            <Button variant="hero" size="lg" asChild onClick={() => setOpen(false)}>
              <a href="/#bundles">Choose a pack</a>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              <div className="flex gap-4">
                <img
                  src={productImg}
                  alt=""
                  width={720}
                  height={720}
                  decoding="async"
                  className="h-24 w-24 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg leading-tight">Herbal Tightening Gel</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {bundle.name} · {bundle.pieces} applicator{bundle.pieces > 1 ? "s" : ""}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <QuantityStepper value={line.quantity} onChange={setQuantity} />
                    <button
                      type="button"
                      onClick={clear}
                      className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Switch pack
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {data!.bundles.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBundle(b.id)}
                      className={cn(
                        "rounded-2xl border p-3 text-left transition-all",
                        b.id === bundle.id
                          ? "border-primary bg-secondary/60 shadow-soft"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <span className="block text-sm font-semibold">{b.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {b.pieces} pc · {formatPKR(b.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-border bg-card px-6 py-5">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{formatPKR(totals!.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <Truck className="h-3.5 w-3.5" />
                    Delivery
                  </dt>
                  <dd className="tabular-nums">
                    {totals!.delivery === 0 ? (
                      <span className="font-semibold text-sage">Free</span>
                    ) : (
                      formatPKR(totals!.delivery)
                    )}
                  </dd>
                </div>
                <div className="flex justify-between pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatPKR(totals!.total)}</dd>
                </div>
              </dl>
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link to="/checkout">Checkout securely</Link>
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Cash on Delivery or Easypaisa
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
