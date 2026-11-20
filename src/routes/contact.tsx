import { Link, createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, PackageSearch } from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";
import { SectionHeading } from "@/components/store/landing/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { SITE_URL, breadcrumbJsonLd } from "@/lib/site";
import { WHATSAPP_NUMBER, WHATSAPP_URL } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact RoseCare — WhatsApp & Email" },
      {
        name: "description",
        content:
          "Message RoseCare on WhatsApp 03025279825 or email orders@rosecare.store. Discreet replies, usually within a few hours.",
      },
      { property: "og:title", content: "Contact RoseCare — WhatsApp & Email" },
      {
        property: "og:description",
        content:
          "Questions about your order, payment or delivery? Message us — a woman from our team will reply.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/contact` },
      { property: "og:image", content: `${SITE_URL}/images/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "828" },
      {
        property: "og:image:alt",
        content: "RoseCare herbal tightening gel applicator on silk with herbs and a flower",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Contact RoseCare — WhatsApp & Email" },
      {
        name: "twitter:description",
        content:
          "Questions about your order, payment or delivery? Message us — a woman from our team will reply.",
      },
      { name: "twitter:image", content: `${SITE_URL}/images/og-image.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <StoreShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-hero px-5 pb-20 pt-10 md:px-8 md:pt-14">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Contact"
            title={
              <>
                Talk to us, <em className="text-brand">quietly</em>
              </>
            }
            intro="Questions about your order, payment or delivery? Message us — a woman from our team will reply, discreetly, usually within a few hours."
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-3">
            <Reveal>
              <div className="flex h-full flex-col rounded-3xl bg-card p-6 shadow-card md:p-7">
                <MessageCircle className="h-6 w-6 text-[#25d366]" />
                <h3 className="mt-4 font-display text-xl">WhatsApp</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Fastest way to reach us — order questions, payment help, delivery updates.
                </p>
                <p className="mt-3 text-sm font-semibold">{WHATSAPP_NUMBER}</p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-[#25d366] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </Reveal>
            <Reveal>
              <div className="flex h-full flex-col rounded-3xl bg-card p-6 shadow-card md:p-7">
                <Mail className="h-6 w-6 text-brand" />
                <h3 className="mt-4 font-display text-xl">Email</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  For order receipts, payment proofs and anything you want in writing.
                </p>
                <p className="mt-3 text-sm font-semibold">orders@rosecare.store</p>
                <a
                  href="mailto:orders@rosecare.store"
                  className="mt-4 inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:bg-blush"
                >
                  Write an email
                </a>
              </div>
            </Reveal>
            <Reveal>
              <div className="flex h-full flex-col rounded-3xl bg-card p-6 shadow-card md:p-7">
                <PackageSearch className="h-6 w-6 text-brand" />
                <h3 className="mt-4 font-display text-xl">Track an order</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Already ordered? Check where your parcel is with your order number and mobile
                  number.
                </p>
                <Link
                  to="/track"
                  className="mt-4 inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:bg-blush"
                >
                  Track your order
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal className="mx-auto mt-10 max-w-3xl text-center">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your messages stay private, and bank statements and parcels never show the product
              name.
            </p>
          </Reveal>
        </div>
      </section>
    </StoreShell>
  );
}
