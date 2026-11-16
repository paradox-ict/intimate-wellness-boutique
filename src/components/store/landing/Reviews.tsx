import { BadgeCheck, Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./SectionHeading";
import {
  REVIEWS,
  REVIEW_COUNT,
  REVIEW_RATING,
  formatReviewDate,
} from "@/lib/reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={
            i < rating ? "h-4 w-4 fill-gold text-gold" : "h-4 w-4 fill-border text-border"
          }
        />
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="What women say"
          title={
            <>
              Reviews from <em className="text-brand">real buyers</em>
            </>
          }
          intro={`Rated ${REVIEW_RATING.toFixed(1)} out of 5 by ${REVIEW_COUNT} verified buyers across Pakistan.`}
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 70}>
              <figure className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft">
                <Stars rating={r.rating} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/85">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary font-display text-lg text-primary"
                  >
                    {r.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {r.name} · {r.city}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-success" />
                      Verified buyer · {formatReviewDate(r.datePublished)}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
          <Reveal delay={140}>
            <div className="flex h-full flex-col justify-between gap-6 rounded-3xl bg-brand p-6 text-primary-foreground shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-soft">
              <div>
                <h3 className="font-display text-2xl leading-snug sm:text-3xl">
                  Your turn to feel the difference
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">
                  Discreet delivery, private packing, and an order that takes just a few minutes.
                </p>
              </div>
              <Button variant="ink" size="lg" className="w-fit" asChild>
                <a href="#bundles">Shop RoseCare</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
