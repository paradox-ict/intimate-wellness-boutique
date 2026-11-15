import { Check, Copy, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { TrackedOrder } from "@/lib/store.functions";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, formatPKR } from "@/lib/format";
import { cn, copyText } from "@/lib/utils";

const FLOW = ["pending", "confirmed", "processing", "shipped", "delivered"] as const;

export function OrderTimeline({ order }: { order: TrackedOrder }) {
  const cancelled = order.status === "cancelled";
  const idx = FLOW.indexOf(order.status as (typeof FLOW)[number]);
  const reached = (s: string) => order.events.find((e) => e.status === s)?.created_at;
  const lastNote = [...order.events]
    .reverse()
    .find((e) => e.note && e.note !== "Order placed")?.note;
  // The delivery fee is 0 exactly on a free-delivery pack — the Rs 400 COD
  // advance then comes off the pack price instead of being the delivery
  // charge. advance_due / balance_due come from the server (trackOrder),
  // so this component never derives money itself.
  const freeDelivery = order.delivery_fee === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Order</p>
          <button
            type="button"
            onClick={async () => {
              const ok = await copyText(order.order_number);
              toast.success(ok ? "✓ Copied" : "Couldn't copy — long-press to copy it manually");
            }}
            className="flex items-center gap-2 font-display text-3xl hover:text-primary"
            aria-label="Copy order number"
          >
            {order.order_number} <Copy className="h-5 w-5" />
          </button>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold",
            cancelled
              ? "bg-destructive/10 text-destructive"
              : order.status === "delivered"
                ? "bg-success text-success-foreground"
                : "bg-secondary text-secondary-foreground",
          )}
        >
          {ORDER_STATUS_LABEL[order.status]}
        </span>
      </div>

      {/* Payment verification — for BOTH methods now. COD orders pay a Rs 400
          Easypaisa advance to confirm, so they go through the same
          verification as prepaid Easypaisa orders. */}
      {order.payment_status !== "not_required" && (
        <div
          className={cn(
            "rounded-2xl p-4 text-sm",
            order.payment_status === "verified"
              ? "bg-accent text-accent-foreground"
              : order.payment_status === "rejected"
                ? "bg-destructive/10 text-destructive"
                : "bg-warning/25 text-warning-foreground",
          )}
        >
          <span className="font-semibold">
            {order.payment_method === "cod" ? (
              `COD advance (${formatPKR(order.advance_due)}): `
            ) : (
              <>
                <img
                  src="/images/easypaisa-mark.png"
                  alt=""
                  className="mr-1 inline-block h-4 w-4 align-[-2px]"
                />
                Easypaisa:{" "}
              </>
            )}
          </span>
          {PAYMENT_STATUS_LABEL[order.payment_status]}
          {order.payment_status === "pending_verification" &&
            " — we usually confirm within a few hours."}
          {order.payment_method === "cod" && (
            <span className="mt-1 block">
              Balance due on delivery: <strong>{formatPKR(order.balance_due)}</strong> (cash).
              {freeDelivery &&
                " Delivery was free on this pack — the advance came off your pack price."}
            </span>
          )}
        </div>
      )}

      {lastNote && (
        <p className="rounded-2xl bg-muted p-4 text-sm">
          <span className="font-semibold">Message from us: </span>
          {lastNote}
        </p>
      )}

      {cancelled ? (
        <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 p-4 text-sm">
          <X className="h-5 w-5 text-destructive" /> This order was cancelled. Contact us if you
          think this is a mistake.
        </div>
      ) : (
        <ol className="relative space-y-0">
          {FLOW.map((s, i) => {
            const done = i <= idx;
            const at = reached(s);
            return (
              <li key={s} className="relative flex gap-4 pb-7 last:pb-0">
                {i < FLOW.length - 1 && (
                  <span
                    className={cn(
                      "absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 transition-colors duration-700",
                      i < idx ? "bg-primary" : "bg-border",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition-all duration-500",
                    done
                      ? "border-primary bg-brand text-primary-foreground"
                      : "border-border bg-card",
                    i === idx && "shadow-glow",
                  )}
                >
                  {done ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-border" />
                  )}
                </span>
                <div className="pt-1">
                  <p className={cn("font-medium", !done && "text-muted-foreground")}>
                    {ORDER_STATUS_LABEL[s]}
                  </p>
                  {at && (
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(at), "d MMM, h:mm a")}
                    </p>
                  )}
                  {s === "shipped" && done && order.tracking_number && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs">
                      Courier tracking:{" "}
                      <span className="font-semibold">{order.tracking_number}</span>
                      <button
                        type="button"
                        onClick={async () => {
                          const ok = await copyText(order.tracking_number!);
                          toast.success(
                            ok ? "✓ Copied" : "Couldn't copy — long-press to copy it manually",
                          );
                        }}
                        aria-label="Copy tracking number"
                        className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-primary"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-muted p-4 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Pack</dt>
          <dd className="font-medium">
            {order.bundle_name} × {order.quantity}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Total</dt>
          <dd className="font-medium">{formatPKR(order.total)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Delivery</dt>
          <dd className="font-medium">
            {freeDelivery ? "Free" : formatPKR(order.delivery_fee)}
          </dd>
        </div>
        {order.payment_method === "cod" ? (
          <>
            <div>
              <dt className="text-xs text-muted-foreground">
                {freeDelivery
                  ? "Advance (deducted from pack price)"
                  : "Advance paid now (Easypaisa)"}
              </dt>
              <dd className="font-medium">{formatPKR(order.advance_due)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Pay on delivery (cash)</dt>
              <dd className="font-medium">{formatPKR(order.balance_due)}</dd>
            </div>
          </>
        ) : (
          <div>
            <dt className="text-xs text-muted-foreground">Paid now (Easypaisa)</dt>
            <dd className="font-medium">{formatPKR(order.total)}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs text-muted-foreground">Payment</dt>
          <dd className="flex items-center gap-1.5 font-medium">
            {order.payment_method === "easypaisa" && (
              <img src="/images/easypaisa-mark.png" alt="" className="h-4 w-4 shrink-0" />
            )}
            {order.payment_method === "cod" ? "Cash on Delivery" : "Easypaisa"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">City</dt>
          <dd className="font-medium">{order.city}</dd>
        </div>
      </dl>
    </div>
  );
}
