import { useEffect, useRef } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Lock, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storefrontQuery } from "@/lib/storefront-query";
import { formatPKR } from "@/lib/format";

export function Hero() {
  const { data } = useSuspenseQuery(storefrontQuery);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const from = Math.min(...data.bundles.map((b) => b.price));

  // Autoplay can be slow to start in headless / low-power browsers — keep
  // nudging play() for a few seconds, and resume when the tab becomes visible.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let tries = 0;
    const nudge = () => {
      if (v.paused && tries < 6) {
        tries += 1;
        void v.play().catch(() => undefined);
      }
    };
    const id = window.setInterval(nudge, 1200);
    const onVis = () => {
      if (!document.hidden) nudge();
    };
    document.addEventListener("visibilitychange", onVis);
    nudge();
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-hero grain">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-8 md:grid-cols-[1.05fr_1fr] md:px-8 md:pb-28 md:pt-14">
        <div className="relative z-10 order-2 md:order-1">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur">
            <Leaf className="h-3.5 w-3.5" /> Herbal intimate care
          </div>
          <h1 className="animate-fade-up mt-6 text-[2.75rem] font-light leading-[1.02] sm:text-6xl lg:text-7xl [animation-delay:120ms]">
            Calm care for
            <br />
            <em className="text-brand font-normal">everyday confidence</em> —
            <br />
            quietly.
          </h1>
          <p className="animate-fade-up mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg [animation-delay:240ms]">
            A gentle, herbal tightening gel in a single-use applicator. Cleanses, moisturises and
            restores comfort — delivered in a plain box no one will question.
          </p>
          <div className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row [animation-delay:360ms]">
            <Button variant="hero" size="xl" asChild>
              <Link to="/product" hash="buy">
                Shop now <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="line" size="xl" asChild>
              <a href="#how-to-use">How it works</a>
            </Button>
          </div>
          <div className="animate-fade-up mt-10 grid max-w-lg grid-cols-3 gap-3 [animation-delay:480ms]">
            {[
              { icon: Lock, label: "Discreet packaging" },
              { icon: Truck, label: "Cash on Delivery" },
              { icon: ShieldCheck, label: "CE · ISO 9001" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-start gap-2 rounded-2xl border border-border/70 bg-card/60 p-3 backdrop-blur"
              >
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative order-1 md:order-2">
          {/* Hero frame sized to match BloomHer's hero: 9/14 on phones (498px at
              360px wide) and 9/13 on desktop, capped at 492px wide so the
              desktop frame is 711px tall — exactly BloomHer's frame size.
              The narrower desktop frame also keeps the video's own benefit
              chips (which end ~80% down the frame) clear of the overlay. */}
          <div className="animate-fade-up relative mx-auto aspect-[9/14] w-full max-w-md overflow-hidden rounded-[2.5rem] shadow-soft [animation-delay:200ms] md:aspect-[9/13] md:max-w-[492px]">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/videos/hero-video-poster.jpg"
              aria-label="Sukoon herbal tightening gel — product film"
            >
              <source
                src="/videos/hero-video-m.webm"
                type="video/webm"
                media="(max-width: 860px)"
              />
              <source src="/videos/hero-video-m.mp4" type="video/mp4" media="(max-width: 860px)" />
              <source src="/videos/hero-video.webm" type="video/webm" />
              <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>
            {/* Light scrim behind the overlay band — the video stays bright
                and crisp; readability comes from the scrim + text-shadow. */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(46,20,40,0.08)_64%,rgba(46,20,40,0.30)_86%,rgba(46,20,40,0.42)_100%)]" />
            {/* Overlay + Buy Now, back ON the hero — geometry mirrors
                BloomHer's proven overlay (measured live): eyebrow just below
                the video's own benefit chips (chips end ~78% mobile / ~80%
                desktop), one-line two-tone headline, rose pill CTA with the
                gold price chip, 12px (mobile) / 16px (desktop) off the frame
                bottom. The headline is one line at both sizes so the whole
                stack clears the chips. */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-3 text-center md:px-5 md:pb-4">
              <p className="animate-fade-up flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.7)] [animation-delay:150ms]">
                <span aria-hidden className="h-px w-6 bg-gold/90" />
                Sukoon · Intimate care
                <span aria-hidden className="h-px w-6 bg-gold/90" />
              </p>
              <p className="animate-fade-up mt-2 font-display text-[1.18rem] leading-[1.15] text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.6),0_0_20px_rgba(0,0,0,0.3)] [animation-delay:280ms] md:text-[1.4rem]">
                Feel fresh, <span className="text-gold-shine">confident</span> &amp; cared for
              </p>
              <div className="animate-fade-up mt-2.5 [animation-delay:420ms]">
                <Button variant="hero" size="lg" className="min-h-11 px-6 shadow-glow md:min-h-12" asChild>
                  <Link to="/product" hash="buy">
                    Shop Now
                    <span className="rounded-full bg-gold px-2.5 py-0.5 text-sm font-extrabold text-primary">
                      {Number.isFinite(from) ? formatPKR(from) : "Rs 4,999"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
