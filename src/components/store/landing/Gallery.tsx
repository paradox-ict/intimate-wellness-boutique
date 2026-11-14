import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import pack from "@/assets/product-pack.jpg";
import packM from "@/assets/product-pack-m.jpg";
import applicators from "@/assets/product-applicators.jpg";
import applicatorsM from "@/assets/product-applicators-m.jpg";
import diagram from "@/assets/product-diagram.jpg";
import diagramM from "@/assets/product-diagram-m.jpg";
import benefits from "@/assets/product-benefits.jpg";
import benefitsM from "@/assets/product-benefits-m.jpg";

const SHOTS = [
  {
    src: pack,
    srcM: packM,
    alt: "Three gel pouches with applicator and certification badges",
    label: "The pack",
  },
  { src: applicators, srcM: applicatorsM, alt: "Two pre-filled applicators", label: "Applicators" },
  { src: diagram, srcM: diagramM, alt: "Pouches and applicator", label: "Everyday care" },
  { src: benefits, srcM: benefitsM, alt: "Pouch and applicator close-up", label: "Sealed pouch" },
];

export function Gallery() {
  const [active, setActive] = useState(0);
  return (
    <section className="px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-secondary shadow-soft">
          {/* Only the active shot is mounted: the old 4-image crossfade made
              phones download all four full-res photos for one visible frame. */}
          <img
            key={SHOTS[active].src}
            src={SHOTS[active].src}
            srcSet={`${SHOTS[active].srcM} 720w, ${SHOTS[active].src} 1436w`}
            sizes="(max-width: 768px) 100vw, 640px"
            alt={SHOTS[active].alt}
            width={1436}
            height={1438}
            decoding="async"
            loading="lazy"
            className="aspect-[4/3.4] w-full animate-fade-in object-cover"
          />
        </Reveal>
        <div>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Inside the box
            </p>
            <h2 className="mt-4 text-4xl font-light leading-[1.08] sm:text-5xl">
              One pouch. <em className="text-brand">One applicator.</em> Pure comfort.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Each pouch holds a single pre-filled applicator, so every use is clean, measured and
              hygienic.
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-4 gap-3">
            {SHOTS.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${s.label}`}
                className={cn(
                  "overflow-hidden rounded-2xl border-2 transition-all duration-300",
                  i === active
                    ? "border-primary shadow-glow"
                    : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <img
                  src={s.srcM}
                  alt=""
                  width={720}
                  height={720}
                  decoding="async"
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
