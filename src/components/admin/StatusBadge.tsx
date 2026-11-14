import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/format";
import { cn } from "@/lib/utils";

const ORDER_TONE: Record<string, string> = {
  pending: "bg-warning/25 text-warning-foreground",
  confirmed: "bg-secondary text-secondary-foreground",
  processing: "bg-secondary text-secondary-foreground",
  shipped: "bg-accent text-accent-foreground",
  delivered: "bg-success text-success-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};
const PAY_TONE: Record<string, string> = {
  not_required: "bg-muted text-muted-foreground",
  pending_verification: "bg-warning/25 text-warning-foreground",
  verified: "bg-success text-success-foreground",
  rejected: "bg-destructive/10 text-destructive",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold",
        ORDER_TONE[status],
      )}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}
export function PaymentBadge({ status, method }: { status: string; method: string }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold",
        PAY_TONE[status],
      )}
    >
      {method === "cod" ? "COD" : `Easypaisa · ${PAYMENT_STATUS_LABEL[status]}`}
    </span>
  );
}
