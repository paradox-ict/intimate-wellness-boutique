import { describe, expect, it } from "vitest";
import { SITE_URL, breadcrumbJsonLd } from "./site";

describe("breadcrumbJsonLd", () => {
  it("builds a BreadcrumbList with absolute URLs in order", () => {
    const jsonLd = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Product", path: "/product" },
    ]);
    expect(jsonLd["@type"]).toBe("BreadcrumbList");
    expect(jsonLd.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Product",
        item: `${SITE_URL}/product`,
      },
    ]);
  });

  it("numbers positions from 1", () => {
    const jsonLd = breadcrumbJsonLd([{ name: "FAQ", path: "/faq" }]);
    expect(jsonLd.itemListElement[0].position).toBe(1);
  });
});
