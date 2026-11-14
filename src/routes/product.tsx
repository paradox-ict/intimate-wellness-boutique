import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Check, Expand, ShoppingBag, X } from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from "@/lib/cart";
import { storefrontQuery } from "@/lib/storefront-query";
import { formatPKR } from "@/lib/format";
import { BENEFITS } from "@/components/store/landing/Benefits";
import { FAQS } from "@/components/store/landing/Faq";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import pack from "@/assets/product-pack.jpg";
import packM from "@/assets/product-pack-m.jpg";
import applicators from "@/assets/product-applicators.jpg";
import applicatorsM from "@/assets/product-applicators-m.jpg";
import diagram from "@/assets/product-diagram.jpg";
import diagramM from "@/assets/product-diagram-m.jpg";
import benefitsImg from "@/assets/product-benefits.jpg";
import benefitsM from "@/assets/product-benefits-m.jpg";
import beforeAfter from "@/assets/product-before-after.jpg";
import beforeAfterM from "@/assets/product-before-after-m.jpg";
import lifestyle from "@/assets/product-lifestyle.jpg";
import lifestyleM from "@/assets/product-lifestyle-m.jpg";

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [
      { title: "Herbal Tightening Gel — Buy Online | Sukoon" },
      {
        name: "description",
        content:
          "Sukoon herbal tightening gel in single-use applicators: antibacterial, cleansing, moisturising, tightening. CE & ISO 9001. COD & Easypaisa, plain packaging.",
      },
      { property: "og:title", content: "Herbal Tightening Gel — Sukoon" },
      {
        property: "og:description",
        content:
          "Gentle herbal intimate care in single-use applicators. COD & Easypaisa, discreet delivery across Pakistan.",
      },
      { property: "og:type", content: "product" },
      { property: "og:url", content: `${SITE_URL}/product` },
      { property: "og:image", content: `${SITE_URL}/images/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "828" },
      { property: "og:image:alt", content: "Sukoon herbal tightening gel applicator on silk with herbs and a flower" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Herbal Tightening Gel — Sukoon" },
      {
        name: "twitter:description",
        content:
          "Gentle herbal intimate care in single-use applicators. COD & Easypaisa, discreet delivery across Pakistan.",
      },
      { name: "twitter:image", content: `${SITE_URL}/images/og-image.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/product` }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(storefrontQuery),
  component: ProductPage,
});

const SHOTS = [
  { src: pack, srcM: packM, alt: "Sukoon gel pouches with applicator", label: "The pack" },
  { src: applicators, srcM: applicatorsM, alt: "Two pre-filled applicators", label: "Applicators" },
  { src: diagram, srcM: diagramM, alt: "Gel pouches and applicator diagram", label: "Inside the pack" },
  { src: benefitsImg, srcM: benefitsM, alt: "Sukoon gel — the seven benefits", label: "Benefits" },
];

function ProductPage() {
  const { data } = useSuspenseQuery(storefrontQuery);
  const { add, buy, setOpen } = useCart();
  const navigate = useNavigate();
  const featured = data.bundles.find((b) => b.badge)?.id ?? data.bundles[0]?.id;
  const [selected, setSelected] = useState<string | undefined>(featured);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const bundle = data.bundles.find((b) => b.id === selected) ?? data.bundles[0];
  const trustItems = [
    "Discreet plain packaging",
    "Cash on Delivery",
    `Easypaisa to ${data.settings.easypaisa_number} — ${data.settings.easypaisa_account_name}`,
    "Free delivery on Trio & Ritual",
    "CE · ISO 9001",
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Sukoon Herbal Tightening Gel",
    description:
      "Herbal vaginal tightening gel in single-use applicators. Antibacterial, cleansing, moisturising, tightening, anti-itching, odour removal and lubricating. CE & ISO 9001.",
    url: `${SITE_URL}/product`,
    image: `${SITE_URL}/images/og-image.jpg`,
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

  const buyNow = (id: string) => {
    buy(id);
    void navigate({ to: "/checkout" });
  };

  return (
    <StoreShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-hero px-5 pb-16 pt-8 md:px-8 md:pb-24 md:pt-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery: one main photo + thumbnail strip, tap for lightbox */}
          <div className="min-w-0">
            <div className="animate-fade-up relative overflow-hidden rounded-[2.5rem] bg-card shadow-soft">
              <button
                type="button"
                onClick={() => setLightbox(true)}
                className="block w-full"
                aria-label="View photo full size"
              >
                <img
                  src={SHOTS[active]?.src}
                  srcSet={`${SHOTS[active]?.srcM} 720w, ${SHOTS[active]?.src} 1436w`}
                  sizes="(max-width: 1024px) 100vw, 620px"
                  alt={SHOTS[active]?.alt}
                  width={1436}
                  height={1438}
                  decoding="async"
                  fetchPriority="high"
                  className="aspect-square w-full object-cover"
                />
              </button>
              <span className="pointer-events-none absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-card/85 text-foreground shadow-card backdrop-blur">
                <Expand className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {SHOTS.map((s, i) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show ${s.label}`}
                  className={cn(
                    "overflow-hidden rounded-2xl border-2 transition-all duration-300",
                    i === active
                      ? "border-primary shadow-glow"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <img
                    src={s.srcM}
                    alt=""
                    width={720}
                    height={720}
                    decoding="async"
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Tap a photo to view it full size
            </p>
          </div>

          {/* Info */}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Sukoon · Intimate care
            </p>
            <h1 className="mt-3 text-4xl font-light leading-[1.05] sm:text-5xl">
              Herbal Tightening Gel
            </h1>
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              Herbal · Natural · CE &amp; ISO 9001
            </p>
            <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
              A gentle, herbal tightening gel in a single-use, pre-filled applicator. Cleanses,
              moisturises and restores comfort — delivered in a plain box no one will question.
            </p>

            <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {BENEFITS.map((b) => (
                <li key={b.title} className="flex items-center gap-2.5 text-sm">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sage text-sage-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="shrink-0 font-medium whitespace-nowrap">{b.title}</span>
                  <span className="text-muted-foreground">— {b.text}</span>
                </li>
              ))}
            </ul>

            {/* Bundle selector */}
            <div id="buy" className="mt-8 scroll-mt-28">
              <h2 className="font-display text-2xl">Choose your pack</h2>
              <div className="mt-4 space-y-3">
                {data.bundles.map((b) => {
                  const isSel = b.id === selected;
                  const save = b.compare_at_price ? b.compare_at_price - b.price : 0;
                  return (
                    <div
                      key={b.id}
                      className={cn(
                        "rounded-3xl border-2 bg-card p-5 transition-all duration-300",
                        isSel ? "border-primary shadow-soft" : "border-border/70 shadow-card",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSelected(b.id)}
                        className="flex w-full items-start justify-between gap-3 text-left"
                        aria-pressed={isSel}
                      >
                        <span>
                          <span className="flex items-center gap-2">
                            <span className="font-display text-2xl">{b.name}</span>
                            {b.badge && (
                              <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                                {b.badge}
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block text-sm text-muted-foreground">
                            {b.tagline} · {b.pieces} applicator{b.pieces > 1 ? "s" : ""}
                            {b.free_delivery ? " · Free delivery" : ""}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block whitespace-nowrap font-display text-2xl tabular-nums">
                            {formatPKR(b.price)}
                          </span>
                          {save > 0 && (
                            <span className="block whitespace-nowrap text-xs text-muted-foreground">
                              Save {formatPKR(save)}
                            </span>
                          )}
                        </span>
                      </button>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Button
                          variant="hero"
                          size="lg"
                          onClick={() => buyNow(b.id)}
                          disabled={!data.settings.in_stock}
                        >
                          Buy Now
                        </Button>
                        <Button
                          variant="line"
                          size="lg"
                          onClick={() => add(b.id)}
                          disabled={!data.settings.in_stock}
                        >
                          <ShoppingBag /> Add to Bag
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!data.settings.in_stock && (
                <p className="mt-3 text-sm font-medium text-destructive">
                  Out of stock right now — check back soon.
                </p>
              )}
            </div>

            {/* Payment & trust as a rolling strip — never a wrapping block */}
            <div
              className="mt-8 overflow-hidden rounded-full border border-border/60 bg-card py-3"
              aria-label={trustItems.join(". ")}
            >
              <div className="animate-marquee flex w-max gap-8">
                {[...trustItems, ...trustItems].map((t, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-8 whitespace-nowrap text-sm font-medium text-foreground/80"
                  >
                    {t}
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* What's inside the pack */}
        <div className="mx-auto mt-16 max-w-7xl md:mt-24">
          <h2 className="text-center font-display text-3xl font-light sm:text-4xl">
            What is inside the pack
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                src: beforeAfter,
                srcM: beforeAfterM,
                alt: "Before and after illustration",
                caption: "Visible care, week by week",
              },
              {
                src: lifestyle,
                srcM: lifestyleM,
                alt: "Sukoon gel in everyday use",
                caption: "Made for quiet, everyday routines",
              },
            ].map((s) => (
              <figure
                key={s.caption}
                className="overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-card"
              >
                <img
                  src={s.src}
                  srcSet={`${s.srcM} 720w, ${s.src} 1436w`}
                  sizes="(max-width: 640px) 100vw, 620px"
                  alt={s.alt}
                  width={1436}
                  height={1438}
                  decoding="async"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="p-4 text-center text-sm font-medium">{s.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Good to know */}
        <div className="mx-auto mt-16 max-w-3xl md:mt-24">
          <h2 className="text-center font-display text-3xl font-light sm:text-4xl">Good to know</h2>
          <Accordion type="single" collapsible className="mt-8 space-y-3">
            {FAQS.slice(0, 5).map((f, i) => (
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
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Still curious?{" "}
            <Link to="/" hash="faq" className="font-medium text-primary hover:underline">
              Read all FAQs
            </Link>{" "}
            or{" "}
            <Link to="/track" className="font-medium text-primary hover:underline">
              track your order
            </Link>
            .
          </p>
        </div>
      </section>

      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent className="max-w-2xl overflow-hidden rounded-[2rem] border-0 bg-card p-0">
          <img
            src={SHOTS[active]?.src}
            alt={SHOTS[active]?.alt}
            width={1436}
            height={1438}
            decoding="async"
            className="aspect-square w-full object-cover"
          />
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-card/90 text-foreground shadow-card"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogContent>
      </Dialog>
    </StoreShell>
  );
}
