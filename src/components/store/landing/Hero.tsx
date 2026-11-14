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
          <div className="animate-fade-up relative mx-auto aspect-[9/14] w-full max-w-md overflow-hidden rounded-[2.5rem] shadow-soft [animation-delay:200ms] sm:aspect-[9/13] md:aspect-[4/5] md:max-w-none">
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
              <source src="/videos/hero-video-m.webm" type="video/webm" media="(max-width: 860px)" />
              <source src="/videos/hero-video-m.mp4" type="video/mp4" media="(max-width: 860px)" />
              <source src="/videos/hero-video.webm" type="video/webm" />
              <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>
            {/* Light bottom gradient only — the video stays bright and crisp. */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(46,20,40,0.08)_76%,rgba(46,20,40,0.40)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-4 pt-10 text-center md:pb-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.65)]">
                Sukoon · Intimate care
              </p>
              <p className="mt-1 font-display text-2xl leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.65),0_0_18px_rgba(0,0,0,0.35)] sm:text-[1.7rem]">
                Feel fresh, confident &amp; cared for
              </p>
              <Button variant="hero" size="lg" className="mt-3 shadow-glow" asChild>
                <Link to="/product" hash="buy">
                  Shop Now — {Number.isFinite(from) ? formatPKR(from) : "Rs 4,999"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
