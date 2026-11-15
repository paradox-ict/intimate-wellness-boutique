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

describe("RoseCare logo assets", () => {
  it("the new lockups and marks exist in public/images and are real PNGs", () => {
    for (const name of [
      "rosecare-logo-white.png",
      "rosecare-logo-black.png",
      "rosecare-mark-white.png",
      "rosecare-mark-black.png",
      "rosecare-logo-email.png",
    ]) {
      const buf = fs.readFileSync(path.join(repoRoot, "public", "images", name));
      expect(buf.length).toBeGreaterThan(1000);
      // PNG magic bytes.
      expect(buf.subarray(0, 4)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
    }
  });

  it("the email logo is small enough to load fast", () => {
    const buf = fs.readFileSync(
      path.join(repoRoot, "public", "images", "rosecare-logo-email.png"),
    );
    expect(buf.length).toBeLessThan(120_000);
  });

  it("the old watercolor rose-mark is gone from the repo", () => {
    expect(fs.existsSync(path.join(repoRoot, "public", "images", "rose-mark.png"))).toBe(
      false,
    );
    for (const file of [
      "src/components/store/Logo.tsx",
      "src/lib/email/templates.ts",
      "src/routes/index.tsx",
    ]) {
      expect(read(file), file).not.toContain("rose-mark");
    }
  });

  it("header uses the white mark, footer the black mark, email the transparent email lockup", () => {
    expect(read("src/components/store/Logo.tsx")).toContain("/images/rosecare-mark-white.png");
    expect(read("src/components/store/Logo.tsx")).toContain("/images/rosecare-mark-black.png");
    expect(read("src/lib/email/templates.ts")).toContain("/images/rosecare-logo-email.png");
    expect(read("src/routes/index.tsx")).toContain("/images/rosecare-logo-white.png");
  });

  it("app icons exist and are real PNGs", () => {
    for (const name of ["icon-192.png", "icon-512.png", "apple-touch-icon.png"]) {
      const buf = fs.readFileSync(path.join(repoRoot, "public", name));
      expect(buf.length).toBeGreaterThan(1000);
      expect(buf.subarray(0, 4)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
    }
    const ico = fs.readFileSync(path.join(repoRoot, "public", "favicon.ico"));
    expect(ico.length).toBeGreaterThan(100);
    // ICO magic bytes: 00 00 01 00.
    expect(ico.subarray(0, 4)).toEqual(Buffer.from([0x00, 0x00, 0x01, 0x00]));
  });
});
