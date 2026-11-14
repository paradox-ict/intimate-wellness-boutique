import { EyeOff, Lock, Package, PhoneOff } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";

const POINTS = [
  {
    icon: Package,
    title: "Plain, unbranded box",
    text: "No logos, no product name, no pictures. Just a simple sealed parcel.",
  },
  {
    icon: EyeOff,
    title: "Neutral sender name",
    text: "The label shows a general wellness store name — nothing that reveals what's inside.",
  },
  {
    icon: PhoneOff,
    title: "Respectful courier calls",
    text: "Riders only confirm your address. They never mention the product.",
  },
  {
    icon: Lock,
    title: "Your details stay private",
    text: "We use your information only to deliver your order. Never shared, never sold.",
  },
];

export function Privacy() {
  return (
    <section
      id="privacy"
      className="relative scroll-mt-24 overflow-hidden bg-ink px-5 py-20 grain md:px-8 md:py-28"
    >
      <div
        className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          invert
          eyebrow="Discreet by design"
          title={
            <>
              Your privacy is <em className="text-gold">part of the product</em>
            </>
          }
          intro="We know this is personal. From checkout to your doorstep, everything is handled with complete confidentiality."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 100}>
              <div className="h-full rounded-3xl border border-ink-foreground/10 bg-ink-foreground/5 p-6 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:border-gold/40">
                <Icon className="h-6 w-6 text-gold" />
                <h3 className="mt-5 font-display text-xl text-ink-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-foreground/65">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
