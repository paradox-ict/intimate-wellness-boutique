import { Link } from "@tanstack/react-router";
import { Lock, PackageCheck, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground grain">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo invert />
            <p className="mt-5 text-sm leading-relaxed text-ink-foreground/70">
              Herbal intimate care, delivered quietly. Every order ships in plain, unbranded
              packaging across Pakistan.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-ink-foreground/80">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-foreground/15 px-3 py-1.5">
                <Lock className="h-3.5 w-3.5" />
                Confidential
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-foreground/15 px-3 py-1.5">
                <PackageCheck className="h-3.5 w-3.5" />
                Plain box
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-foreground/15 px-3 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                CE · ISO 9001
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Shop
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-foreground/75">
              <li>
                <a href="/#bundles" className="hover:text-ink-foreground">
                  Bundles
                </a>
              </li>
              <li>
                <a href="/#how-to-use" className="hover:text-ink-foreground">
                  How to use
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-ink-foreground">
                  FAQ
                </a>
              </li>
              <li>
                <Link to="/faq" className="hover:text-ink-foreground">
                  All questions
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-ink-foreground">
                  About RoseCare
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Orders
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-foreground/75">
              <li>
                <Link to="/track" className="hover:text-ink-foreground">
                  Track your order
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-ink-foreground">
                  Checkout
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-ink-foreground">
                  Contact us
                </Link>
              </li>
              <li>Cash on Delivery · Easypaisa</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-ink-foreground/10 pt-6 text-xs text-ink-foreground/50 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} RoseCare Wellness. Read the leaflet before use. Not a
            substitute for medical advice.
          </p>
          <p>Bank statements and parcels never show the product name.</p>
        </div>
      </div>
    </footer>
  );
}
