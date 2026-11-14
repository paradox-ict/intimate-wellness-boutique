import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import pack from "@/assets/product-pack.jpg";
import applicators from "@/assets/product-applicators.jpg";
import diagram from "@/assets/product-diagram.jpg";
import benefits from "@/assets/product-benefits.jpg";

const SHOTS = [
  {
    src: pack,
    alt: "Three gel pouches with applicator and certification badges",
    label: "The pack",
  },
  { src: applicators, alt: "Two pre-filled applicators", label: "Applicators" },
  { src: diagram, alt: "Pouches and applicator", label: "Everyday care" },
  { src: benefits, alt: "Pouch and applicator close-up", label: "Sealed pouch" },
];

export function Gallery() {
  const [active, setActive] = useState(0);
  return (
    <section className="px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-secondary shadow-soft">
          {SHOTS.map((s, i) => (
            <img
              key={s.src}
              src={s.src}
              alt={s.alt}
              loading="lazy"
              className={cn(
                "aspect-[4/3.4] w-full object-cover transition-all duration-700",
                i === active
                  ? "relative opacity-100 scale-100"
                  : "absolute inset-0 opacity-0 scale-105",
              )}
            />
          ))}
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
                  src={s.src}
                  alt=""
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
