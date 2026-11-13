import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { CartDrawer } from "./CartDrawer";

export function StoreShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-ink py-2 text-center text-[11px] font-medium tracking-[0.16em] text-ink-foreground/85 uppercase">
        Discreet delivery<span className="hidden sm:inline"> across Pakistan</span> · Cash on Delivery
      </div>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CartDrawer />
    </div>
  );
}
