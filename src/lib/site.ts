// Public site URL used for canonical tags, OG URLs and the sitemap.
export const SITE_URL = "https://rosecare.store";

// BreadcrumbList JSON-LD for a page, so Google can show where the page
// sits in the site hierarchy — one of the signals behind sitelinks.
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
