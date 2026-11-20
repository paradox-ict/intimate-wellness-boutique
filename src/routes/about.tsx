import { Link, createFileRoute } from "@tanstack/react-router";
import { Droplets, Leaf, Lock, ShieldCheck } from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";
import { SectionHeading } from "@/components/store/landing/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { SITE_URL, breadcrumbJsonLd } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About RoseCare — Herbal Intimate Care in Pakistan" },
      {
        name: "description",
        content:
          "RoseCare is a herbal intimate-care gel in single-use applicators — discreet delivery across Pakistan, COD & Easypaisa, CE & ISO 9001.",
      },
      { property: "og:title", content: "About RoseCare — Herbal Intimate Care" },
      {
        property: "og:description",
        content:
          "Quiet, herbal intimate care in single-use applicators, delivered discreetly across Pakistan.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/about` },
      { property: "og:image", content: `${SITE_URL}/images/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "828" },
      {
        property: "og:image:alt",
        content: "RoseCare herbal tightening gel applicator on silk with herbs and a flower",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About RoseCare — Herbal Intimate Care" },
      {
        name: "twitter:description",
        content:
          "Quiet, herbal intimate care in single-use applicators, delivered discreetly across Pakistan.",
      },
      { name: "twitter:image", content: `${SITE_URL}/images/og-image.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
  }),
  component: AboutPage,
});

const PILLARS = [
  {
    icon: Leaf,
    title: "Herbal, by design",
    text: "A natural herbal formulation in single-use applicators — one applicator every 2–3 days, or as directed on the leaflet.",
  },
  {
    icon: Droplets,
    title: "Seven kinds of care",
    text: "Antibacterial, cleansing, moisturising, tightening, anti-itching, odour removal and lubricating — in one gentle gel.",
  },
  {
    icon: ShieldCheck,
    title: "Made to a standard",
    text: "Manufactured under CE and ISO 9001 quality standards, with a leaflet in every pack. Read it before use.",
  },
  {
    icon: Lock,
    title: "Private, end to end",
    text: "Plain, unbranded box, neutral sender name. The product name never appears on the parcel, the courier slip, any SMS — or your bank statement.",
  },
];

function AboutPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
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
            eyebrow="About"
            title={
              <>
                Quiet care, made for <em className="text-brand">everyday confidence</em>
              </>
            }
            intro="RoseCare is a herbal intimate-care gel for women across Pakistan — simple to use, honest about what it does, and private from the moment you order to the moment it arrives."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <Reveal key={p.title}>
                <div className="h-full rounded-3xl bg-card p-6 shadow-card md:p-7">
                  <p.icon className="h-6 w-6 text-brand" />
                  <h3 className="mt-4 font-display text-xl">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mx-auto mt-12 max-w-3xl text-center">
            <p className="text-base leading-relaxed text-muted-foreground">
              Every order is Cash on Delivery or Easypaisa, and usually arrives in 2–4 working days.
              Single, Double and Trio packs cover every routine — the Trio ships free.
            </p>
            <Link
              to="/product"
              className="mt-6 inline-flex items-center rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-95"
            >
              Shop the gel
            </Link>
          </Reveal>
        </div>
      </section>
    </StoreShell>
  );
}
