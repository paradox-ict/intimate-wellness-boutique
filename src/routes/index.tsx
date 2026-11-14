import { createFileRoute } from "@tanstack/react-router";
import { StoreShell } from "@/components/store/StoreShell";
import { Hero } from "@/components/store/landing/Hero";
import { Marquee } from "@/components/store/landing/Marquee";
import { Benefits } from "@/components/store/landing/Benefits";
import { Formula } from "@/components/store/landing/Formula";
import { Gallery } from "@/components/store/landing/Gallery";
import { HowToUse } from "@/components/store/landing/HowToUse";
import { Bundles } from "@/components/store/landing/Bundles";
import { Privacy } from "@/components/store/landing/Privacy";
import { Reviews } from "@/components/store/landing/Reviews";
import { Faq } from "@/components/store/landing/Faq";
import { FinalCta } from "@/components/store/landing/FinalCta";
import { storefrontQuery } from "@/lib/storefront-query";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sukoon Herbal Tightening Gel — Discreet Intimate Care in Pakistan" },
      {
        name: "description",
        content:
          "Herbal vaginal tightening gel: antibacterial, cleansing, moisturising and anti-itching. CE & ISO 9001. Plain packaging, Cash on Delivery & Easypaisa across Pakistan.",
      },
      { property: "og:title", content: "Sukoon Herbal Tightening Gel — Discreet Intimate Care" },
      {
        property: "og:description",
        content:
          "Gentle herbal intimate care, delivered in plain packaging across Pakistan. COD & Easypaisa.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(storefrontQuery),
  component: Index,
});

function Index() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Sukoon Herbal Tightening Gel",
    description:
      "Herbal vaginal tightening gel in single-use applicators. Antibacterial, cleansing, moisturising, tightening, anti-itching, odour removal and lubricating. CE & ISO 9001.",
    brand: { "@type": "Brand", name: "Sukoon" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "PKR",
      lowPrice: Math.min(...data.bundles.map((b) => b.price)),
      highPrice: Math.max(...data.bundles.map((b) => b.price)),
      offerCount: data.bundles.length,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <StoreShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Marquee />
      <Benefits />
      <Formula />
      <Gallery />
      <HowToUse />
      <Bundles />
      <Privacy />
      <Reviews />
      <Faq />
      <FinalCta />
    </StoreShell>
  );
}
