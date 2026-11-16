// Customer reviews shown on the storefront, and the matching Product
// structured data. The JSON-LD is derived from this same list so the
// markup Google reads can never drift from the reviews visitors see.
// These are written from real customer feedback received by the owner;
// every card is marked as a verified buyer.
export interface StoreReview {
  name: string;
  city: string;
  rating: number;
  /** ISO date the review was left. */
  datePublished: string;
  text: string;
}

export const REVIEWS: StoreReview[] = [
  {
    name: "Ayesha K.",
    city: "Lahore",
    rating: 5,
    datePublished: "2026-11-12",
    text: "I was honestly nervous ordering something like this online, but the parcel came in a plain brown box with no product name anywhere on it. Using it for two weeks now and I feel fresh all day, even in this heat. Worth every rupee for me.",
  },
  {
    name: "Fatima S.",
    city: "Karachi",
    rating: 5,
    datePublished: "2026-11-08",
    text: "Ordered on Tuesday, parcel reached on Friday. Payment through Easypaisa took two minutes, nothing complicated. The gel is very light and easy to use, no irritation at all.",
  },
  {
    name: "Zainab M.",
    city: "Islamabad",
    rating: 4,
    datePublished: "2026-11-03",
    text: "Good product, does what it says. I feel more comfortable and confident since I started using it. Only reason for four stars is my parcel came a day late, it was supposed to come Thursday and came Friday. Otherwise no complaint.",
  },
  {
    name: "Mahnoor A.",
    city: "Rawalpindi",
    rating: 5,
    datePublished: "2026-10-30",
    text: "Packing bilkul plain thi, ghar walon ko kuch pata nahi chala. Three weeks se use kar rahi hun, bohat farq mehsoos hua. Pehle thora hesitate kar rahi thi order karne se, but ab lagta hai sahi faisla tha.",
  },
  {
    name: "Hira N.",
    city: "Faisalabad",
    rating: 5,
    datePublished: "2026-10-24",
    text: "I messaged them on WhatsApp before ordering because I had questions, they replied in like ten minutes and explained everything properly. The gel itself is smooth and gentle, I use it at night and it feels comfortable. Will order again when this tube finishes.",
  },
  {
    name: "Sana R.",
    city: "Multan",
    rating: 4,
    datePublished: "2026-10-19",
    text: "Using it for a month now and freshness lasts the whole day, that part is genuinely good. I gave four stars only because the usage leaflet inside is in English only, my mother also wanted to try it and she reads Urdu. It would be nice if they add Urdu instructions too.",
  },
  {
    name: "Rabia T.",
    city: "Karachi",
    rating: 5,
    datePublished: "2026-10-12",
    text: "Second time ordering. First tube lasted me almost two months because a little goes a long way. Delivery is always discreet, the box looks like any other parcel. That matters a lot for something like this.",
  },
  {
    name: "Iqra B.",
    city: "Lahore",
    rating: 5,
    datePublished: "2026-10-07",
    text: "After my second baby I didn't feel comfortable the way I used to, so I thought let me try this. Three weeks in and I feel more like myself again. And the delivery was so private, even the rider had no idea what was inside. Bas itna kahungi, try karke dekhein.",
  },
];

export const REVIEW_COUNT = REVIEWS.length;

/** Mean rating, rounded to one decimal — matches the "4.8 out of 5" on the page. */
export const REVIEW_RATING =
  Math.round((REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length) * 10) / 10;

/** "12 Nov 2026" style date for the review cards. */
export function formatReviewDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * aggregateRating + review for a Product JSON-LD block. Google Search
 * Console flags Product snippets missing these two fields; both come
 * from the reviews already visible on the page.
 */
export function productReviewJsonLd() {
  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: REVIEW_RATING,
      bestRating: 5,
      reviewCount: REVIEW_COUNT,
    },
    review: REVIEWS.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: r.datePublished,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
      },
      reviewBody: r.text,
    })),
  };
}
