import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
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
import { Faq, FAQS } from "@/components/store/landing/Faq";
import { FinalCta } from "@/components/store/landing/FinalCta";
import { storefrontQuery } from "@/lib/storefront-query";
import { productReviewJsonLd } from "@/lib/reviews";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RoseCare Herbal Tightening Gel — Discreet Intimate Care in Pakistan" },
      {
        name: "description",
        content:
          "Herbal vaginal tightening gel: antibacterial, cleansing, moisturising, anti-itching. CE & ISO 9001. Plain packaging, COD & Easypaisa across Pakistan.",
      },
      { property: "og:title", content: "RoseCare Herbal Tightening Gel — Discreet Intimate Care" },
      {
        property: "og:description",
        content:
          "Gentle herbal intimate care, delivered in plain packaging across Pakistan. COD & Easypaisa.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: `${SITE_URL}/images/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "828" },
      { property: "og:image:alt", content: "RoseCare herbal tightening gel applicator on silk with herbs and a flower" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "RoseCare Herbal Tightening Gel — Discreet Intimate Care" },
      {
        name: "twitter:description",
        content:
          "Gentle herbal intimate care, delivered in plain packaging across Pakistan. COD & Easypaisa.",
      },
      { name: "twitter:image", content: `${SITE_URL}/images/og-image.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(storefrontQuery),
  component: Index,
});

function Index() {
  const { data } = useSuspenseQuery(storefrontQuery);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "RoseCare Herbal Tightening Gel",
        description:
          "Herbal vaginal tightening gel in single-use applicators. Antibacterial, cleansing, moisturising, tightening, anti-itching, odour removal and lubricating. CE & ISO 9001.",
        url: `${SITE_URL}/`,
        image: `${SITE_URL}/images/og-image.jpg`,
        brand: { "@type": "Brand", name: "RoseCare" },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "PKR",
          lowPrice: Math.min(...data.bundles.map((b) => b.price)),
          highPrice: Math.max(...data.bundles.map((b) => b.price)),
          offerCount: data.bundles.length,
          availability: "https://schema.org/InStock",
        },
        // Same reviews as the visible cards below, so Google can show stars.
        ...productReviewJsonLd(),
      },
      {
        "@type": "Organization",
        name: "RoseCare",
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/images/rosecare-logo-white.png`,
      },
      {
        "@type": "WebSite",
        name: "RoseCare",
        url: `${SITE_URL}/`,
      },
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
