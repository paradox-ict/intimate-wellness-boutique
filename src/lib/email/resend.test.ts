import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  deriveStatusKind,
  resetEmailDailyCount,
  sendEmail,
  sendOrderPlacedEmails,
  sendStatusEmailForOrder,
  type OrderEmailData,
} from "./resend";

const easypaisa = { accountName: "Abdul Khaliq", accountNumber: "03115778995" };

const sampleOrder: OrderEmailData = {
  order_number: "SK-ABC123",
  customer_name: "Ayesha Khan",
  email: "ayesha@example.com",
  phone: "03001234567",
  city: "Lahore",
  address: "House 12, Street 4, Gulberg III",
  notes: null,
  bundle_name: "Single",
  bundle_pieces: 1,
  quantity: 1,
  total_pieces: 1,
  subtotal: 1950,
  delivery_fee: 200,
  total: 2150,
  payment_method: "cod",
  payment_status: "not_required",
  status: "pending",
  easypaisa_txn_id: null,
  easypaisa_sender_number: null,
  payment_proof_path: null,
  admin_note: null,
  tracking_number: null,
  created_at: "2026-11-15T12:00:00.000Z",
};

type FetchCall = { url: string; init: { method?: string; headers?: Record<string, string>; body?: string } };
function makeFetch(ok = true, status = 200, id = "re_test_1") {
  const calls: FetchCall[] = [];
  const fn = vi.fn(async (url: unknown, init?: unknown) => {
    calls.push({ url: String(url), init: (init ?? {}) as FetchCall["init"] });
    return {
      ok,
      status,
      json: async () => ({ id }),
      text: async () => (ok ? "" : "unauthorized"),
    };
  });
  return { fn: fn as unknown as typeof fetch, calls };
}

const OLD_KEY = process.env["RESEND_API_KEY"];
beforeEach(() => {
  process.env["RESEND_API_KEY"] = "re_test_key";
  resetEmailDailyCount();
});
afterEach(() => {
  if (OLD_KEY === undefined) delete process.env["RESEND_API_KEY"];
  else process.env["RESEND_API_KEY"] = OLD_KEY;
  resetEmailDailyCount();
  vi.restoreAllMocks();
});

describe("sendEmail", () => {
  it("posts the right request to Resend and returns the id", async () => {
    const { fn, calls } = makeFetch();
    const res = await sendEmail({
      to: "ayesha@example.com",
      subject: "Hi",
      html: "<p>Hi</p>",
      text: "Hi",
      fetchImpl: fn,
    });
    expect(res).toEqual({ ok: true, id: "re_test_1" });
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe("https://api.resend.com/emails");
    expect(calls[0].init.method).toBe("POST");
    expect(calls[0].init.headers?.Authorization).toBe("Bearer re_test_key");
    const body = JSON.parse(calls[0].init.body ?? "{}");
    expect(body.from).toBe("RoseCare <orders@rosecare.store>");
    expect(body.to).toBe("ayesha@example.com");
    expect(body.subject).toBe("Hi");
  });

  it("fails soft without a key and never calls fetch", async () => {
    delete process.env["RESEND_API_KEY"];
    const { fn, calls } = makeFetch();
    const res = await sendEmail({ to: "a@b.c", subject: "Hi", html: "<p>Hi</p>", fetchImpl: fn });
    expect(res.ok).toBe(false);
    expect(calls).toHaveLength(0);
  });

  it("fails soft when fetch throws", async () => {
    const throwing = vi.fn(async () => {
      throw new Error("network down");
    }) as unknown as typeof fetch;
    const res = await sendEmail({ to: "a@b.c", subject: "Hi", html: "<p>Hi</p>", fetchImpl: throwing });
    expect(res.ok).toBe(false);
  });

  it("fails soft on a Resend rejection", async () => {
    const { fn, calls } = makeFetch(false, 401);
    const res = await sendEmail({ to: "a@b.c", subject: "Hi", html: "<p>Hi</p>", fetchImpl: fn });
    expect(res.ok).toBe(false);
    expect(calls).toHaveLength(1);
  });

  it("logs every send attempt with its outcome and a daily count", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const { fn } = makeFetch();
    await sendEmail({
      to: "a@b.c",
      subject: "Hi",
      html: "<p>Hi</p>",
      kind: "order-confirmation",
      fetchImpl: fn,
    });
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("[email] to=a@b.c kind=order-confirmation ok=true"),
    );
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("daily=1/100"));
    logSpy.mockRestore();
  });

  it("warns at 80 sends in a day", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    const { fn } = makeFetch();
    for (let i = 0; i < 80; i++) {
      await sendEmail({ to: "a@b.c", subject: "Hi", html: "<p>Hi</p>", fetchImpl: fn });
    }
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("80/100 free-tier emails used today"),
    );
    warnSpy.mockRestore();
  });
});

describe("sendOrderPlacedEmails", () => {
  it("sends the customer confirmation and the owner alert", async () => {
    const { fn, calls } = makeFetch();
    const out = await sendOrderPlacedEmails({
      order: sampleOrder,
      easypaisa,
      ownerEmail: "itxparadox.ab@gmail.com",
      fetchImpl: fn,
    });
    expect(out.confirmation?.ok).toBe(true);
    expect(out.ownerAlert?.ok).toBe(true);
    expect(calls).toHaveLength(2);
    const bodies = calls.map((c) => JSON.parse(c.init.body ?? "{}"));
    expect(bodies[0].to).toBe("ayesha@example.com");
    expect(bodies[0].subject).toContain("SK-ABC123");
    expect(bodies[1].to).toBe("itxparadox.ab@gmail.com");
    expect(bodies[1].subject).toContain("New RoseCare order");
  });

  it("skips the customer email when there is no email address", async () => {
    const { fn, calls } = makeFetch();
    const out = await sendOrderPlacedEmails({
      order: { ...sampleOrder, email: null },
      easypaisa,
      ownerEmail: "itxparadox.ab@gmail.com",
      fetchImpl: fn,
    });
    expect(out.confirmation).toBeNull();
    expect(out.ownerAlert?.ok).toBe(true);
    expect(calls).toHaveLength(1);
  });

  it("skips the owner alert when no owner email is configured", async () => {
    const { fn, calls } = makeFetch();
    const out = await sendOrderPlacedEmails({ order: sampleOrder, easypaisa, fetchImpl: fn });
    expect(out.confirmation?.ok).toBe(true);
    expect(out.ownerAlert).toBeNull();
    expect(calls).toHaveLength(1);
  });

  it("skips the confirmation when it was already claimed (retried placeOrder)", async () => {
    // The server claims the confirmation flag on the order row before
    // sending; a retry passes sendConfirmation:false, so only the owner
    // alert goes out — never a duplicate receipt.
    const { fn, calls } = makeFetch();
    const out = await sendOrderPlacedEmails({
      order: sampleOrder,
      easypaisa,
      ownerEmail: "itxparadox.ab@gmail.com",
      sendConfirmation: false,
      fetchImpl: fn,
    });
    expect(out.confirmation).toBeNull();
    expect(out.ownerAlert?.ok).toBe(true);
    expect(calls).toHaveLength(1);
    const body = JSON.parse(calls[0].init.body ?? "{}");
    expect(body.to).toBe("itxparadox.ab@gmail.com");
  });

  it("never throws when sending fails", async () => {
    const throwing = vi.fn(async () => {
      throw new Error("boom");
    }) as unknown as typeof fetch;
    const out = await sendOrderPlacedEmails({
      order: sampleOrder,
      easypaisa,
      ownerEmail: "itxparadox.ab@gmail.com",
      fetchImpl: throwing,
    });
    expect(out.confirmation?.ok).toBe(false);
    expect(out.ownerAlert?.ok).toBe(false);
  });
});

describe("deriveStatusKind", () => {
  const base = { status: "pending", payment_status: "pending_verification", tracking_number: null };
  it("approve (pending -> confirmed, payment verified) sends confirmed", () => {
    expect(
      deriveStatusKind(
        { ...base, status: "confirmed", payment_status: "verified" },
        "pending",
        "pending_verification",
      ),
    ).toBe("confirmed");
  });
  it("approve on an already-processing order still sends confirmed (payment verified)", () => {
    expect(
      deriveStatusKind(
        { ...base, status: "processing", payment_status: "verified" },
        "processing",
        "pending_verification",
      ),
    ).toBe("confirmed");
  });
  it("reject sends rejected, not cancelled", () => {
    expect(
      deriveStatusKind(
        { ...base, status: "cancelled", payment_status: "rejected" },
        "pending",
        "pending_verification",
      ),
    ).toBe("rejected");
  });
  it("ship sends shipped on a status change only", () => {
    expect(
      deriveStatusKind({ ...base, status: "shipped", payment_status: "verified" }, "confirmed", "verified"),
    ).toBe("shipped");
  });
  it("adding a tracking number to an already-shipped order sends nothing", () => {
    // A tracking number is not a status change — the customer already got
    // the "shipped" email for this order.
    expect(
      deriveStatusKind(
        { ...base, status: "shipped", payment_status: "verified", tracking_number: "TCS1" },
        "shipped",
        "verified",
      ),
    ).toBeNull();
  });
  it("delivered / cancelled / processing map to their own kinds", () => {
    expect(
      deriveStatusKind({ ...base, status: "delivered", payment_status: "verified" }, "shipped", "verified"),
    ).toBe("delivered");
    expect(
      deriveStatusKind({ ...base, status: "cancelled", payment_status: "not_required" }, "confirmed", "not_required"),
    ).toBe("cancelled");
    expect(
      deriveStatusKind({ ...base, status: "processing", payment_status: "verified" }, "confirmed", "verified"),
    ).toBe("processing");
  });
  it("no change (note-only save) sends nothing", () => {
    expect(
      deriveStatusKind({ ...base, status: "confirmed", payment_status: "verified" }, "confirmed", "verified"),
    ).toBeNull();
  });
});

describe("sendStatusEmailForOrder", () => {
  it("sends the confirmed email after approval", async () => {
    const { fn, calls } = makeFetch();
    const out = await sendStatusEmailForOrder({
      order: { ...sampleOrder, status: "confirmed", payment_status: "verified" },
      prevStatus: "pending",
      prevPaymentStatus: "pending_verification",
      fetchImpl: fn,
    });
    expect(out).toEqual({ sent: true, kind: "confirmed" });
    expect(calls).toHaveLength(1);
    const body = JSON.parse(calls[0].init.body ?? "{}");
    expect(body.to).toBe("ayesha@example.com");
    expect(body.subject).toContain("confirmed");
  });

  it("sends nothing when nothing changed", async () => {
    const { fn, calls } = makeFetch();
    const out = await sendStatusEmailForOrder({
      order: { ...sampleOrder, status: "confirmed", payment_status: "verified" },
      prevStatus: "confirmed",
      prevPaymentStatus: "verified",
      fetchImpl: fn,
    });
    expect(out).toEqual({ sent: false, kind: null });
    expect(calls).toHaveLength(0);
  });

  it("sends nothing when the customer has no email", async () => {
    const { fn, calls } = makeFetch();
    const out = await sendStatusEmailForOrder({
      order: { ...sampleOrder, email: null, status: "shipped", payment_status: "verified" },
      prevStatus: "confirmed",
      prevPaymentStatus: "verified",
      fetchImpl: fn,
    });
    expect(out).toEqual({ sent: false, kind: "shipped" });
    expect(calls).toHaveLength(0);
  });
});
