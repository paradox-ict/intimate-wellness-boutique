import { ArrowRight, Leaf, Lock, ShieldCheck, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-still-life.jpg";
import product from "@/assets/product-14.jpg.asset.json";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero grain">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-8 md:grid-cols-[1.05fr_1fr] md:px-8 md:pb-28 md:pt-14">
        <div className="relative z-10">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur">
            <Leaf className="h-3.5 w-3.5" /> Herbal intimate care
          </div>
          <h1 className="animate-fade-up mt-6 text-[2.75rem] font-light leading-[1.02] sm:text-6xl lg:text-7xl [animation-delay:120ms]">
            Feel confident,
            <br />
            <em className="text-brand font-normal">fresh & firm</em> —
            <br />
            quietly.
          </h1>
          <p className="animate-fade-up mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg [animation-delay:240ms]">
            A gentle, herbal tightening gel in a single-use applicator. Cleanses, moisturises and
            restores comfort — delivered in a plain box no one will question.
          </p>
          <div className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row [animation-delay:360ms]">
            <Button variant="hero" size="xl" asChild>
              <a href="#bundles">
                Shop now <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </a>
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

        <div className="relative">
          <div className="animate-fade-up relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-[14rem] rounded-b-[2.5rem] md:rounded-t-[18rem] shadow-soft [animation-delay:200ms] md:max-w-none">
            <img
              src={hero}
              alt="Herbal gel applicator resting on blush silk with a gerbera flower"
              width={1600}
              height={1104}
              className="h-full w-full scale-105 object-cover object-[65%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
          </div>

          <div className="animate-float absolute -left-2 bottom-10 w-40 rounded-3xl border border-border/60 bg-card/90 p-2.5 shadow-card backdrop-blur-md sm:-left-8 sm:w-48">
            <img
              src={product.url}
              alt="Gel pouches and applicator"
              className="aspect-square w-full rounded-2xl object-cover"
              loading="lazy"
            />
            <p className="mt-2 px-1 text-xs font-semibold">Single-use applicator</p>
            <p className="px-1 pb-1 text-[11px] text-muted-foreground">Pre-filled, hygienic</p>
          </div>

          <div className="animate-float absolute -right-1 top-8 rounded-2xl border border-border/60 bg-card/90 px-4 py-3 shadow-card backdrop-blur-md [animation-delay:-3s] sm:-right-4">
            <div className="flex gap-0.5 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <p className="mt-1 text-xs font-semibold">Loved by women</p>
            <p className="text-[11px] text-muted-foreground">across Pakistan</p>
          </div>
        </div>
      </div>
    </section>
  );
}
