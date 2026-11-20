import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StoreShell } from "@/components/store/StoreShell";
import { SectionHeading } from "@/components/store/landing/SectionHeading";
import { FAQS } from "@/components/store/landing/Faq";
import { Reveal } from "@/components/Reveal";
import { SITE_URL, breadcrumbJsonLd } from "@/lib/site";
import { WHATSAPP_URL } from "@/lib/whatsapp";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions | RoseCare" },
      {
        name: "description",
        content:
          "Answers about discreet delivery, Cash on Delivery, Easypaisa payment, tracking and using the RoseCare herbal tightening gel.",
      },
      { property: "og:title", content: "Frequently Asked Questions — RoseCare" },
      {
        property: "og:description",
        content:
          "Discreet delivery, COD & Easypaisa, tracking and how to use the gel — answered honestly.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/faq` },
      { property: "og:image", content: `${SITE_URL}/images/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "828" },
      {
        property: "og:image:alt",
        content: "RoseCare herbal tightening gel applicator on silk with herbs and a flower",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Frequently Asked Questions — RoseCare" },
      {
        name: "twitter:description",
        content:
          "Discreet delivery, COD & Easypaisa, tracking and how to use the gel — answered honestly.",
      },
      { name: "twitter:image", content: `${SITE_URL}/images/og-image.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/faq` }],
  }),
  component: FaqPage,
});

function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "FAQ", path: "/faq" },
      ]),
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <StoreShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-hero px-5 pb-20 pt-10 md:px-8 md:pt-14">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Questions"
            title={
              <>
                Asked <em className="text-brand">quietly</em>, answered honestly
              </>
            }
            intro="Everything about ordering, paying, delivery and using the gel — in one place."
          />
          <Reveal className="mx-auto mt-12 max-w-3xl">
            <Accordion type="single" collapsible className="space-y-3">
              {FAQS.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`f${i}`}
                  className="rounded-2xl border border-border/70 bg-card px-5 shadow-card data-[state=open]:shadow-soft"
                >
                  <AccordionTrigger className="py-5 text-left font-display text-lg font-normal hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
          <div className="mx-auto mt-12 max-w-3xl rounded-3xl bg-card p-6 text-center shadow-card md:p-8">
            <p className="font-display text-xl">Still have a question?</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Message us — a woman from our team will reply, discreetly.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-95"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </StoreShell>
  );
}
