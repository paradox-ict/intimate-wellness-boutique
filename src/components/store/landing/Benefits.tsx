import { Droplets, Feather, Flower2, ShieldPlus, Sparkles, Wind, Waves } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";

export const BENEFITS = [
  {
    icon: ShieldPlus,
    title: "Antibacterial",
    text: "Herbal actives help keep unwanted bacteria in check.",
  },
  {
    icon: Sparkles,
    title: "Cleansing",
    text: "Gently refreshes without disturbing your natural balance.",
  },
  {
    icon: Droplets,
    title: "Moisturising",
    text: "Relieves dryness and leaves skin soft and comfortable.",
  },
  {
    icon: Flower2,
    title: "Tightening",
    text: "Supports a firmer, toned feeling with regular use.",
  },
  {
    icon: Feather,
    title: "Anti-itching",
    text: "Soothes irritation and everyday discomfort.",
  },
  { icon: Wind, title: "Odour removal", text: "Neutralises odour for lasting freshness." },
  { icon: Waves, title: "Lubricating", text: "A silky, natural glide that feels like you." },
];

export function Benefits() {
  return (
    <section id="benefits" className="scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Seven benefits, one gel"
          title={
            <>
              Care that works <em className="text-brand">gently</em>
            </>
          }
          intro="Formulated with plant extracts for women who want comfort, freshness and confidence — without harsh chemicals."
        />
        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, text }, i) => (
            <Reveal
              key={title}
              delay={i * 70}
              className={i === 0 ? "col-span-2 lg:col-span-1 lg:row-span-2" : ""}
            >
              <div
                className={`group relative h-full overflow-hidden rounded-3xl border border-border/70 bg-card p-5 shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft sm:p-6 ${i === 0 ? "bg-brand text-primary-foreground lg:flex lg:flex-col lg:justify-between" : ""}`}
              >
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 ${i === 0 ? "bg-primary-foreground/15" : "bg-secondary text-primary"}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3
                    className={`mt-5 font-display text-xl sm:text-2xl ${i === 0 ? "lg:text-4xl" : ""}`}
                  >
                    {title}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${i === 0 ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                  >
                    {text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
