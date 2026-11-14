import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, PackageSearch, ShoppingBag, X } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#benefits", label: "Benefits" },
  { href: "/#how-to-use", label: "How to use" },
  { href: "/#bundles", label: "Shop" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!count) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 450);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-500",
        scrolled ? "border-b border-border/60 bg-background/80 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 md:h-20 md:grid-cols-[auto_1fr_auto] md:px-8">
        <Logo />
        <nav className="hidden justify-center gap-8 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="group relative text-sm font-medium text-foreground/75 transition-colors hover:text-foreground"
            >
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <Link
            to="/track"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground/75 transition-colors hover:text-foreground sm:inline-flex"
          >
            Track order
          </Link>
          {/* Compact Track pill for phones, where the text link is hidden. */}
          <Link
            to="/track"
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-card/70 px-3 py-2 text-xs font-semibold backdrop-blur transition-colors hover:border-primary/40 hover:text-primary sm:hidden"
            aria-label="Track order"
          >
            <PackageSearch className="h-4 w-4" />
            Track
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-foreground/10 bg-card/70 backdrop-blur transition-all hover:border-primary/40 hover:text-primary"
            aria-label={`Open bag${count ? `, ${count} item` : ""}`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span
                className={cn(
                  "absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-primary-foreground",
                  bump && "animate-pop",
                )}
              >
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div
        className={cn(
          "grid overflow-hidden border-border/60 bg-background/95 backdrop-blur-xl transition-all duration-500 md:hidden",
          mobileOpen ? "grid-rows-[1fr] border-b" : "grid-rows-[0fr]",
        )}
      >
        <nav className="min-h-0 px-5" aria-label="Mobile">
          <div className="flex flex-col gap-1 py-4">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-3 font-display text-xl"
              >
                {n.label}
              </a>
            ))}
            <Link
              to="/track"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-3 font-display text-xl"
            >
              Track order
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
