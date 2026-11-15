import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

// Real Easypaisa brand assets — the official lockup and the 'e' mark cropped
// from it. The site must never fall back to a generic phone icon for
// Easypaisa again.
const repoRoot = process.cwd();

function read(rel: string): string {
  return fs.readFileSync(path.join(repoRoot, rel), "utf8");
}

describe("Easypaisa brand assets", () => {
  it("both assets exist in public/images and are real PNGs", () => {
    for (const name of ["easypaisa-mark.png", "easypaisa-logo.png"]) {
      const buf = fs.readFileSync(path.join(repoRoot, "public", "images", name));
      expect(buf.length).toBeGreaterThan(1000);
      // PNG magic bytes.
      expect(buf.subarray(0, 4)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
    }
  });

  it("the 'e' mark is used everywhere Easypaisa appears on the site", () => {
    const usages: [string, string][] = [
      ["src/routes/checkout.tsx", "PayOption chip"],
      ["src/routes/order-success.tsx", "payment rows"],
      ["src/components/store/OrderTimeline.tsx", "track page"],
      ["src/components/admin/OrderDetailSheet.tsx", "admin payment section"],
    ];
    for (const [file, where] of usages) {
      expect(read(file), `${file} (${where})`).toContain("/images/easypaisa-mark.png");
    }
  });

  it("the full lockup is used in the checkout payment panel and the order email", () => {
    expect(read("src/routes/checkout.tsx")).toContain("/images/easypaisa-logo.png");
    expect(read("src/lib/email/templates.ts")).toContain("/images/easypaisa-logo.png");
  });

  it("no generic phone icon is used for Easypaisa anywhere", () => {
    expect(read("src/routes/checkout.tsx")).not.toContain("Smartphone");
  });

  it("WhatsApp surfaces use the real WhatsApp mark, not a generic chat icon", () => {
    for (const file of [
      "src/components/store/FloatingWhatsApp.tsx",
      "src/components/store/landing/StickyBuyBar.tsx",
    ]) {
      expect(read(file)).toContain("WhatsAppIcon");
      expect(read(file)).not.toContain("MessageCircle");
    }
    expect(read("src/components/store/WhatsAppIcon.tsx")).toContain("M17.472 14.382");
  });
});
