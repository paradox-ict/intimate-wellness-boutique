import { BadgeCheck, Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";

const REVIEWS = [
  {
    name: "Ayesha K.",
    city: "Lahore",
    text: "Packaging was completely plain — even my family didn't ask. The gel feels gentle and I noticed the freshness from the first use.",
    pack: "Trio",
  },
  {
    name: "Sana R.",
    city: "Karachi",
    text: "I was nervous ordering something like this online but the COD option made it easy. Delivered in 3 days, no awkward questions.",
    pack: "Ritual",
  },
  {
    name: "Mehwish T.",
    city: "Islamabad",
    text: "No more itching or dryness. The applicator is clean and simple to use. Will definitely reorder.",
    pack: "Trio",
  },
  {
    name: "Hira A.",
    city: "Faisalabad",
    text: "Paid via Easypaisa, sent the screenshot and they confirmed within hours. Very professional and private.",
    pack: "Single",
  },
  {
    name: "Fatima Z.",
    city: "Multan",
    text: "After my second baby I felt less confident. This gave me comfort and I feel like myself again.",
    pack: "Ritual",
  },
  {
    name: "Rabia M.",
    city: "Peshawar",
    text: "Gentle, no burning, and it smells clean. The herbal formula is what convinced me.",
    pack: "Trio",
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Real words"
          title={
            <>
              Women who chose <em className="text-brand">Sukoon</em>
            </>
          }
        />
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="flex text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <span>Verified buyers · names shortened for privacy</span>
        </div>
        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 100} className="mb-4 break-inside-avoid">
              <figure className="rounded-3xl border border-border/70 bg-card p-6 shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-soft">
                <div className="flex text-gold">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 font-display text-lg leading-snug">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary font-display text-secondary-foreground">
                    {r.name[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 text-sm font-semibold">
                      {r.name} <BadgeCheck className="h-3.5 w-3.5 text-sage" />
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.city} · bought {r.pack}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
