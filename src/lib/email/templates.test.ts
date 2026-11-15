import { describe, expect, it } from "vitest";
import {
  esc,
  orderConfirmationEmail,
  orderStatusEmail,
  ownerNewOrderEmail,
  type OrderEmailData,
} from "./templates";

const easypaisa = { accountName: "Abdul Khaliq", accountNumber: "03115778995" };

const sampleOrder: OrderEmailData = {
  order_number: "SK-ABC123",
  customer_name: "Ayesha Khan",
  email: "ayesha@example.com",
  phone: "03001234567",
  city: "Lahore",
  address: "House 12, Street 4, Gulberg III",
  notes: "Call before delivery",
  bundle_name: "Single",
  bundle_pieces: 1,
  quantity: 1,
  total_pieces: 1,
  subtotal: 1950,
  delivery_fee: 400,
  total: 2350,
  payment_method: "cod",
  payment_status: "pending_verification",
  status: "pending",
  easypaisa_txn_id: "5278263737",
  easypaisa_sender_number: "03001234567",
  payment_proof_path: null,
  admin_note: null,
  tracking_number: null,
  created_at: "2026-11-15T12:00:00.000Z",
};

describe("esc", () => {
  it("escapes HTML in user-supplied text", () => {
    expect(esc("<script>alert(1)</script>")).toBe("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(esc(null)).toBe("");
    expect(esc("Ayesha & Khan")).toBe("Ayesha &amp; Khan");
  });
});

describe("order confirmation email", () => {
  it("COD order has the receipt, the advance/balance split, tracking link and address", () => {
    const e = orderConfirmationEmail(sampleOrder, easypaisa);
    expect(e.subject).toContain("SK-ABC123");
    expect(e.html).toContain("SK-ABC123");
    expect(e.html).toContain("Rs 2,350");
    expect(e.html).toContain("Cash on Delivery");
    // The Rs 400 advance is due now via Easypaisa; only the product price
    // is due in cash on delivery.
    expect(e.html).toContain("Pay now (Easypaisa advance)");
    expect(e.html).toContain("Rs 400");
    expect(e.html).toContain("Pay on delivery (cash)");
    expect(e.html).toContain("Rs 1,950");
    expect(e.html).toContain("verifying your advance");
    expect(e.html).toContain("5278263737");
    expect(e.html).toContain("https://rosecare.store/track?order=SK-ABC123");
    expect(e.html).toContain("House 12, Street 4, Gulberg III");
    expect(e.html).toContain("03001234567");
    expect(e.html).toContain("https://rosecare.store/images/rose-mark.png");
    expect(e.text).toContain("SK-ABC123");
    expect(e.text).toContain("Rs 2,350");
    expect(e.text).toContain("Pay now (Easypaisa advance): Rs 400");
    expect(e.text).toContain("Pay on delivery (cash): Rs 1,950");
    expect(e.text).toContain("https://rosecare.store/track?order=SK-ABC123");
    expect(e.text).not.toContain("<div");
  });

  it("Easypaisa order shows the account details and the full total paid now", () => {
    const e = orderConfirmationEmail(
      {
        ...sampleOrder,
        payment_method: "easypaisa",
        delivery_fee: 300,
        total: 2250,
        easypaisa_txn_id: "3456789012",
        easypaisa_sender_number: "03009876543",
      },
      easypaisa,
    );
    expect(e.html).toContain("03115778995");
    expect(e.html).toContain("Abdul Khaliq");
    expect(e.html).toContain("3456789012");
    expect(e.html).toContain("Paid now (Easypaisa)");
    expect(e.html).toContain("Rs 2,250");
    expect(e.html).toContain("verifying your payment");
    expect(e.text).toContain("03115778995");
    expect(e.text).toContain("Paid now (Easypaisa): Rs 2,250");
  });

  it("never renders raw user HTML", () => {
    const e = orderConfirmationEmail(
      { ...sampleOrder, customer_name: "<img src=x onerror=alert(1)>", address: "<b>bold</b>" },
      easypaisa,
    );
    expect(e.html).not.toContain("<img src=x");
    expect(e.html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(e.html).not.toContain("<b>bold</b>");
  });
});

describe("order status emails", () => {
  it("covers every status with its own subject and headline", () => {
    const subjects = {
      confirmed: "confirmed",
      processing: "packing",
      shipped: "on its way",
      delivered: "delivered",
      rejected: "issue with your",
      cancelled: "cancelled",
    } as const;
    for (const [kind, word] of Object.entries(subjects)) {
      const e = orderStatusEmail(sampleOrder, kind as keyof typeof subjects);
      expect(e.subject.toLowerCase()).toContain(word);
      expect(e.html).toContain("SK-ABC123");
      expect(e.html).toContain("https://rosecare.store/track?order=SK-ABC123");
      expect(e.text).toContain("SK-ABC123");
    }
  });

  it("rejected email includes the admin's reason", () => {
    const e = orderStatusEmail(
      { ...sampleOrder, payment_status: "rejected", admin_note: "Transaction ID not found" },
      "rejected",
    );
    expect(e.html).toContain("Transaction ID not found");
    expect(e.text).toContain("Transaction ID not found");
  });

  it("confirmed email for COD names the advance and the balance due on delivery", () => {
    const e = orderStatusEmail(sampleOrder, "confirmed");
    expect(e.html).toContain("Rs 400 advance has been verified");
    expect(e.html).toContain("Pay on delivery Rs 1,950");
    expect(e.text).toContain("Rs 400 advance has been verified");
    expect(e.text).toContain("Pay on delivery Rs 1,950");
  });

  it("rejected email for COD names the advance", () => {
    const e = orderStatusEmail(
      { ...sampleOrder, payment_status: "rejected", admin_note: "Advance not found" },
      "rejected",
    );
    expect(e.html).toContain("Rs 400 advance");
    expect(e.html).toContain("Advance not found");
  });

  it("confirmed email for Easypaisa does not mention a COD advance", () => {
    const e = orderStatusEmail(
      { ...sampleOrder, payment_method: "easypaisa", delivery_fee: 300, total: 2250 },
      "confirmed",
    );
    expect(e.html).toContain("Your payment has been verified");
    expect(e.html).not.toContain("advance");
  });

  it("shipped email includes the courier tracking number when present", () => {
    const withTracking = orderStatusEmail(
      { ...sampleOrder, tracking_number: "TCS123456" },
      "shipped",
    );
    expect(withTracking.html).toContain("TCS123456");
    const withoutTracking = orderStatusEmail(sampleOrder, "shipped");
    expect(withoutTracking.html).not.toContain("Courier tracking number");
  });
});

describe("owner new-order alert", () => {
  it("COD alert has the customer, the advance/balance split and the admin link", () => {
    const e = ownerNewOrderEmail(sampleOrder, easypaisa);
    expect(e.subject).toContain("SK-ABC123");
    expect(e.subject).toContain("Rs 2,350");
    expect(e.subject).toContain("Cash on Delivery");
    expect(e.html).toContain("Ayesha Khan");
    expect(e.html).toContain("03001234567");
    expect(e.html).toContain("ayesha@example.com");
    expect(e.html).toContain("House 12, Street 4, Gulberg III");
    expect(e.html).toContain("Rs 400 advance");
    expect(e.html).toContain("Rs 1,950");
    expect(e.html).toContain("5278263737");
    expect(e.html).toContain("https://rosecare.store/admin");
    expect(e.text).toContain("https://rosecare.store/admin");
    expect(e.text).toContain("Rs 400 advance");
  });

  it("Easypaisa alert shows the transaction and the receipt note", () => {
    const e = ownerNewOrderEmail(
      {
        ...sampleOrder,
        payment_method: "easypaisa",
        delivery_fee: 300,
        total: 2250,
        easypaisa_txn_id: "3456789012",
        easypaisa_sender_number: "03009876543",
        payment_proof_path: "2026-11/abc.jpg",
      },
      easypaisa,
    );
    expect(e.subject).toContain("Easypaisa");
    expect(e.html).toContain("3456789012");
    expect(e.html).toContain("Receipt screenshot uploaded");
    const noProof = ownerNewOrderEmail(
      { ...sampleOrder, payment_method: "easypaisa", payment_proof_path: null },
      easypaisa,
    );
    expect(noProof.html).toContain("No receipt screenshot");
  });
});
