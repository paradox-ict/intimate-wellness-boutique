import { AlertCircle, Clock, Droplet, Hand, Moon, Syringe } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";

const STEPS = [
  { icon: Hand, title: "Prepare", text: "Wash your hands and gently cleanse the intimate area with warm water. Pat dry." },
  { icon: Syringe, title: "Open the applicator", text: "Tear open the pouch, take out the pre-filled applicator and pull off the protective cap." },
  { icon: Droplet, title: "Apply gently", text: "Lie back comfortably, insert the applicator tip gently and press the plunger slowly to release all the gel." },
  { icon: Moon, title: "Rest & discard", text: "Remove and discard the applicator. Rest for 10–15 minutes. Best used at night before sleep." },
];

export function HowToUse() {
  return (
    <section id="how-to-use" className="scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="How to use" title={<>Four calm steps, <em className="text-brand">under a minute</em></>} intro="Each applicator is single-use and pre-measured — no mess, no guesswork." />
        <ol className="relative mt-16 grid gap-6 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block" aria-hidden="true" />
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 120} className="relative">
              <div className="flex gap-4 md:flex-col md:gap-0">
                <span className="relative z-10 grid h-16 w-16 shrink-0 place-items-center rounded-full border border-border bg-card shadow-card">
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-brand text-[11px] font-bold text-primary-foreground">{i + 1}</span>
                </span>
                <div className="md:mt-6">
                  <h3 className="font-display text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <Reveal className="rounded-3xl border border-border/70 bg-accent p-6">
            <div className="flex items-center gap-2 text-accent-foreground"><Clock className="h-4 w-4" /><h3 className="font-sans text-sm font-semibold uppercase tracking-[0.14em]">How often</h3></div>
            <p className="mt-3 text-sm leading-relaxed text-accent-foreground/90">Use one applicator every 2–3 days, or as directed on the leaflet. Most women use a 3–5 pack as one full care cycle.</p>
          </Reveal>
          <Reveal delay={100} className="rounded-3xl border border-border/70 bg-secondary p-6">
            <div className="flex items-center gap-2 text-secondary-foreground"><AlertCircle className="h-4 w-4" /><h3 className="font-sans text-sm font-semibold uppercase tracking-[0.14em]">Please note</h3></div>
            <p className="mt-3 text-sm leading-relaxed text-secondary-foreground/90">Do not use during menstruation or pregnancy. Avoid intercourse for a few hours after use. Stop if irritation occurs and consult a doctor.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
