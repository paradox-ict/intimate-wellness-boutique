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
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(storefrontQuery),
  component: Index,
});

function Index() {
  return (
    <StoreShell>
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
