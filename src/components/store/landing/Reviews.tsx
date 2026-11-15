import { MessageCircleHeart } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./SectionHeading";

// No invented reviews: RoseCare has no approved customer reviews yet. Real
// reviews from verified buyers will appear here once orders are delivered.
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
        />
        <Reveal className="mx-auto mt-12 max-w-2xl">
          <div className="rounded-[2.5rem] border border-border/70 bg-card p-8 text-center shadow-card sm:p-12">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary text-primary">
              <MessageCircleHeart className="h-7 w-7" />
            </span>
            <h3 className="mt-6 font-display text-2xl sm:text-3xl">No reviews yet</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Every review here will come from a real, verified order — never written by us. As
              RoseCare orders are delivered, honest words from buyers will appear in this space.
            </p>
            <Button variant="hero" size="xl" className="mt-8" asChild>
              <a href="#bundles">Be one of the first to try it</a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
