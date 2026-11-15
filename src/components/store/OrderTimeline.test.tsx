import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderTimeline } from "./OrderTimeline";
import type { TrackedOrder } from "@/lib/store.functions";

function makeOrder(overrides: Partial<TrackedOrder>): TrackedOrder {
  return {
    order_number: "SK-TEST01",
    status: "confirmed",
    payment_status: "verified",
    payment_method: "easypaisa",
    bundle_name: "Trio",
    quantity: 1,
    total_pieces: 3,
    subtotal: 4850,
    delivery_fee: 0,
    total: 4850,
    advance_due: 4850,
    balance_due: 0,
    city: "Lahore",
    tracking_number: null,
    created_at: "2026-11-15T12:00:00.000Z",
    events: [
      {
        status: "pending",
        payment_status: "pending_verification",
        note: "Order placed",
        created_at: "2026-11-15T12:00:00.000Z",
      },
      {
        status: "confirmed",
        payment_status: "verified",
        note: null,
        created_at: "2026-11-15T13:00:00.000Z",
      },
    ],
    ...overrides,
  };
}

describe("OrderTimeline Easypaisa branding", () => {
  it("shows the real Easypaisa mark for a prepaid Easypaisa order", () => {
    const { container } = render(<OrderTimeline order={makeOrder({})} />);
    const marks = container.querySelectorAll('img[src="/images/easypaisa-mark.png"]');
    // Payment banner + Payment row.
    expect(marks.length).toBe(2);
  });

  it("shows no Easypaisa mark for a COD order", () => {
    const { container } = render(
      <OrderTimeline
        order={makeOrder({
          payment_method: "cod",
          payment_status: "pending_verification",
          advance_due: 400,
          balance_due: 4450,
        })}
      />,
    );
    expect(container.querySelectorAll('img[src="/images/easypaisa-mark.png"]')).toHaveLength(0);
    expect(screen.getByText("Cash on Delivery")).toBeInTheDocument();
  });
});
