import { describe, expect, it } from "vitest";
import {
  REVIEWS,
  REVIEW_COUNT,
  REVIEW_RATING,
  formatReviewDate,
  productReviewJsonLd,
} from "./reviews";

describe("reviews", () => {
  it("has 8 verified-buyer reviews averaging 4.8", () => {
    expect(REVIEW_COUNT).toBe(8);
    expect(REVIEWS).toHaveLength(8);
    expect(REVIEW_RATING).toBe(4.8);
  });

  it("formats review dates like the cards show", () => {
    expect(formatReviewDate("2026-11-12")).toBe("12 Nov 2026");
    expect(formatReviewDate("2026-10-07")).toBe("7 Oct 2026");
  });

  it("emits one review per card, with author, date, rating and text", () => {
    const jsonLd = productReviewJsonLd();
    expect(jsonLd.aggregateRating).toEqual({
      "@type": "AggregateRating",
      ratingValue: 4.8,
      bestRating: 5,
      reviewCount: 8,
    });
    expect(jsonLd.review).toHaveLength(REVIEWS.length);
    for (const [i, r] of jsonLd.review.entries()) {
      expect(r.author.name).toBe(REVIEWS[i].name);
      expect(r.datePublished).toBe(REVIEWS[i].datePublished);
      expect(r.reviewRating.ratingValue).toBe(REVIEWS[i].rating);
      expect(r.reviewBody).toBe(REVIEWS[i].text);
      expect(r.reviewBody.length).toBeGreaterThan(0);
    }
  });
});
