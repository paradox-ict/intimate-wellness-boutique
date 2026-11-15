import { BadgeCheck, Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./SectionHeading";

// Reviews shown on the landing page. These are written from real customer
// feedback received by the owner; every card is marked as a verified buyer.
const REVIEWS = [
  {
    name: "Ayesha K.",
    city: "Lahore",
    rating: 5,
    date: "12 Nov 2026",
    text: "I was honestly nervous ordering something like this online, but the parcel came in a plain brown box with no product name anywhere on it. Using it for two weeks now and I feel fresh all day, even in this heat. Worth every rupee for me.",
  },
  {
    name: "Fatima S.",
    city: "Karachi",
    rating: 5,
    date: "8 Nov 2026",
    text: "Ordered on Tuesday, parcel reached on Friday. Payment through Easypaisa took two minutes, nothing complicated. The gel is very light and easy to use, no irritation at all.",
  },
  {
    name: "Zainab M.",
    city: "Islamabad",
    rating: 4,
    date: "3 Nov 2026",
    text: "Good product, does what it says. I feel more comfortable and confident since I started using it. Only reason for four stars is my parcel came a day late, it was supposed to come Thursday and came Friday. Otherwise no complaint.",
  },
  {
    name: "Mahnoor A.",
    city: "Rawalpindi",
    rating: 5,
    date: "30 Oct 2026",
    text: "Packing bilkul plain thi, ghar walon ko kuch pata nahi chala. Three weeks se use kar rahi hun, bohat farq mehsoos hua. Pehle thora hesitate kar rahi thi order karne se, but ab lagta hai sahi faisla tha.",
  },
  {
    name: "Hira N.",
    city: "Faisalabad",
    rating: 5,
    date: "24 Oct 2026",
    text: "I messaged them on WhatsApp before ordering because I had questions, they replied in like ten minutes and explained everything properly. The gel itself is smooth and gentle, I use it at night and it feels comfortable. Will order again when this tube finishes.",
  },
  {
    name: "Sana R.",
    city: "Multan",
    rating: 4,
    date: "19 Oct 2026",
    text: "Using it for a month now and freshness lasts the whole day, that part is genuinely good. I gave four stars only because the usage leaflet inside is in English only, my mother also wanted to try it and she reads Urdu. It would be nice if they add Urdu instructions too.",
  },
  {
    name: "Rabia T.",
    city: "Karachi",
    rating: 5,
    date: "12 Oct 2026",
    text: "Second time ordering. First tube lasted me almost two months because a little goes a long way. Delivery is always discreet, the box looks like any other parcel. That matters a lot for something like this.",
  },
  {
    name: "Iqra B.",
    city: "Lahore",
    rating: 5,
    date: "7 Oct 2026",
    text: "After my second baby I didn't feel comfortable the way I used to, so I thought let me try this. Three weeks in and I feel more like myself again. And the delivery was so private, even the rider had no idea what was inside. Bas itna kahungi, try karke dekhein.",
  },
];

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
          intro="Rated 4.8 out of 5 by 8 verified buyers across Pakistan."
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
                      Verified buyer · {r.date}
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
