import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export function FinalCta() {
  return (
    <section className="px-5 py-20 md:px-8 md:py-24">
      <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-brand px-6 py-16 text-center text-primary-foreground shadow-glow sm:px-12">
        <div className="absolute inset-0 shimmer opacity-40" aria-hidden="true" />
        <div className="relative">
          <h2 className="text-4xl font-light leading-tight sm:text-5xl">
            Your comfort, <em>your secret.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
            Order today with Cash on Delivery. Plain packaging, guaranteed.
          </p>
          <Button variant="ink" size="xl" className="mt-8" asChild>
            <a href="#bundles">
              Choose your pack <ArrowRight />
            </a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
