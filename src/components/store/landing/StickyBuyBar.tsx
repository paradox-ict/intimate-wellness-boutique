import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { storefrontQuery } from "@/lib/storefront-query";
import { formatPKR } from "@/lib/format";
import { cn } from "@/lib/utils";

export function StickyBuyBar() {
  const { data } = useSuspenseQuery(storefrontQuery);
  const [show, setShow] = useState(false);
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
  const from = Math.min(...data.bundles.map((b) => b.price));
  return (
    <div className={cn("fixed inset-x-3 bottom-3 z-30 transition-all duration-500 md:hidden", show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0")}>
      <div className="flex items-center justify-between gap-3 rounded-full border border-border/60 bg-card/90 py-2 pl-5 pr-2 shadow-soft backdrop-blur-xl">
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">Herbal Tightening Gel</p>
          <p className="text-sm font-semibold">from {Number.isFinite(from) ? formatPKR(from) : "—"}</p>
        </div>
        <Button variant="hero" size="lg" asChild>
          <a href="#bundles">Order now</a>
        </Button>
      </div>
    </div>
  );
}
