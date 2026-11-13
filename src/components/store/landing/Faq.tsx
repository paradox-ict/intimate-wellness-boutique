import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "./SectionHeading";

export const FAQS = [
  { q: "Will anyone know what I ordered?", a: "No. Your order ships in a plain, unbranded box with a neutral sender name. The product name never appears on the parcel, the courier slip or any SMS." },
  { q: "How do I use the applicator?", a: "Wash your hands, open the pouch, remove the cap, gently insert the tip while lying down and press the plunger slowly. Discard after use and rest for 10–15 minutes. Each applicator is single-use." },
  { q: "How often should I use it?", a: "One applicator every 2–3 days, or as directed on the leaflet. A Trio or Ritual pack covers a complete care cycle." },
  { q: "Is it safe? What is it made of?", a: "It is a herbal, natural formulation manufactured under CE and ISO 9001 quality standards. Do not use during menstruation or pregnancy, and stop if you notice irritation. If you have a medical condition, please consult your doctor first." },
  { q: "How does Easypaisa payment work?", a: "At checkout choose Easypaisa, send the exact total to our Easypaisa account, then enter your transaction ID and/or upload the receipt screenshot. We verify and confirm your order, usually within a few hours." },
  { q: "Can I pay on delivery?", a: "Yes. Cash on Delivery is available all over Pakistan. You pay the rider when your parcel arrives." },
  { q: "How long does delivery take?", a: "Usually 2–3 working days in major cities and 3–5 working days elsewhere. You can check progress anytime on the Track order page." },
  { q: "How do I track my order?", a: "Use the Track order page with your order number (e.g. SK-1A2B3C) and the mobile number you used at checkout." },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 bg-blush px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.4fr]">
        <SectionHeading align="left" eyebrow="Questions" title={<>Asked <em className="text-brand">quietly</em>, answered honestly</>} intro="Anything else on your mind? Message us — a woman from our team will reply." />
        <Reveal>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`f${i}`} className="rounded-2xl border border-border/70 bg-card px-5 shadow-card data-[state=open]:shadow-soft">
                <AccordionTrigger className="py-5 text-left font-display text-lg font-normal hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
