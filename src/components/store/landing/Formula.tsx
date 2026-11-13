import { Check, Leaf } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import flatlay from "@/assets/herbal-flatlay.jpg";

const POINTS = ["Herbal & natural plant extracts", "100% original, sealed pouches", "Gentle, non-sticky gel texture", "Single-use, pre-filled applicator"];

export function Formula() {
  return (
    <section className="bg-blush px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-20">
        <Reveal className="relative">
          <div className="overflow-hidden rounded-[2.5rem] shadow-soft">
            <img src={flatlay} alt="Aloe vera, chamomile, rose and sage around a dish of herbal gel" width={1200} height={1200} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-[2s] hover:scale-105" />
          </div>
          <div className="absolute -bottom-6 right-4 flex gap-3 sm:right-8">
            {[
              { k: "CE", v: "Certified" },
              { k: "ISO", v: "9001" },
            ].map((c) => (
              <div key={c.k} className="grid h-24 w-24 place-items-center rounded-full border-4 border-background bg-ink text-center text-ink-foreground shadow-card">
                <div>
                  <p className="font-display text-2xl leading-none">{c.k}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-gold">{c.v}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-sage"><Leaf className="h-3.5 w-3.5" /> The formula</p>
            <h2 className="mt-4 text-4xl font-light leading-[1.08] sm:text-5xl">Rooted in botanicals, <em className="text-brand">made with care</em></h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Our gel blends traditional herbal ingredients into a soft, fast-absorbing formula. Manufactured under CE and ISO 9001 quality standards, every applicator is sealed for hygiene and freshness.
            </p>
          </Reveal>
          <ul className="mt-8 space-y-3">
            {POINTS.map((p, i) => (
              <Reveal as="li" key={p} delay={i * 90} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/80 px-4 py-3.5 backdrop-blur">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sage text-sage-foreground"><Check className="h-4 w-4" /></span>
                <span className="text-sm font-medium">{p}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
