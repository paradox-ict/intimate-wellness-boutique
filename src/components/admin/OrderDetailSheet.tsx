import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { toast } from "sonner";
import { CheckCircle2, Copy, ExternalLink, Loader2, MapPin, Phone, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notifyOrderStatus } from "@/lib/store.functions";
import { orderEventsQuery, type Order } from "@/lib/admin-queries";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, formatPKR } from "@/lib/format";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatusBadge, PaymentBadge } from "./StatusBadge";

const STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
type Status = (typeof STATUSES)[number];

export function OrderDetailSheet({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const qc = useQueryClient();
  const notify = useServerFn(notifyOrderStatus);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("pending");
  const [tracking, setTracking] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState<null | "save" | "approve" | "reject">(null);
  const events = useQuery({ ...orderEventsQuery(order?.id ?? ""), enabled: !!order });

  useEffect(() => {
    if (!order) return;
    setStatus(order.status);
    setTracking(order.tracking_number ?? "");
    setNote(order.admin_note ?? "");
    setProofUrl(null);
    if (order.payment_proof_path) {
      supabase.storage
        .from("payment-proofs")
        .createSignedUrl(order.payment_proof_path, 600)
        .then(({ data }) => setProofUrl(data?.signedUrl ?? null));
    }
  }, [order]);

  if (!order) return <Sheet open={false} />;

  const update = async (
    patch: Partial<Order>,
    kind: "save" | "approve" | "reject",
    msg: string,
  ) => {
    setSaving(kind);
    // The order's state BEFORE this save, so the server can tell what
    // actually changed and send only the email that change deserves.
    const prev = {
      status: order.status,
      payment_status: order.payment_status,
    };
    const { error } = await supabase.from("orders").update(patch).eq("id", order.id);
    setSaving(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(msg);
    // Email the customer about the change. Fire-and-forget: the update
    // already succeeded, so a mail failure must never surface here. The
    // server verifies the admin's session before sending anything.
    void (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) return;
        await notify({
          data: {
            orderId: order.id,
            accessToken: session.access_token,
            prevStatus: prev.status,
            prevPaymentStatus: prev.payment_status,
          },
        });
      } catch (err) {
        console.error("[email] status notify failed", err);
      }
    })();
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["admin", "orders"] }),
      qc.invalidateQueries({ queryKey: ["admin", "order-events", order.id] }),
      qc.invalidateQueries({ queryKey: ["admin", "settings"] }),
    ]);
    onClose();
  };

  const approve = () =>
    update(
      {
        payment_status: "verified",
        status: order.status === "pending" ? "confirmed" : order.status,
        admin_note: note || null,
      },
      "approve",
      "Payment approved — order confirmed",
    );
  const reject = () => {
    if (!note.trim()) {
      toast.error("Add a short reason in the note so the customer knows why");
      return;
    }
    update(
      { payment_status: "rejected", status: "cancelled", admin_note: note },
      "reject",
      "Payment rejected — order cancelled",
    );
  };
  const save = () =>
    update(
      { status, tracking_number: tracking || null, admin_note: note || null },
      "save",
      "Order updated",
    );

  const copy = (v: string) => {
    navigator.clipboard?.writeText(v);
    toast.success("Copied");
  };

  return (
    <Sheet open={!!order} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto bg-background p-0 sm:max-w-xl">
        <SheetHeader className="sticky top-0 z-10 border-b border-border bg-background/95 px-6 py-5 text-left backdrop-blur">
          <SheetTitle className="font-display text-2xl font-normal">
            {order.order_number}
          </SheetTitle>
          <SheetDescription asChild>
            <div className="flex flex-wrap items-center gap-2">
              <OrderStatusBadge status={order.status} />
              <PaymentBadge status={order.payment_status} method={order.payment_method} />
              <span className="text-xs">
                {format(new Date(order.created_at), "d MMM yyyy, h:mm a")}
              </span>
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-6 py-6">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Customer
            </h3>
            <p className="mt-2 text-lg font-semibold">{order.customer_name}</p>
            <div className="mt-3 space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${order.phone}`} className="hover:text-primary">
                  {order.phone}
                </a>
                <button type="button" onClick={() => copy(order.phone)} aria-label="Copy phone">
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <a
                  href={`https://wa.me/92${order.phone.slice(1)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  WhatsApp
                </a>
              </p>
              {order.email && <p className="text-muted-foreground">{order.email}</p>}
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>
                  {order.address}, <span className="font-medium">{order.city}</span>
                </span>
              </p>
              {order.notes && (
                <p className="rounded-xl bg-muted p-3 text-muted-foreground">“{order.notes}”</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Items
            </h3>
            <div className="mt-3 flex justify-between text-sm">
              <span>
                {order.bundle_name} pack ({order.bundle_pieces} pc) × {order.quantity}
              </span>
              <span>{formatPKR(order.subtotal)}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm text-muted-foreground">
              <span>Delivery</span>
              <span>{order.delivery_fee ? formatPKR(order.delivery_fee) : "Free"}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
              <span>Total · {order.total_pieces} applicators</span>
              <span>{formatPKR(order.total)}</span>
            </div>
          </section>

          {order.payment_method === "easypaisa" && (
            <section className="rounded-2xl border-2 border-primary/20 bg-card p-5">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Easypaisa payment
              </h3>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Transaction ID</dt>
                  <dd className="font-mono font-semibold">{order.easypaisa_txn_id ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Sent from</dt>
                  <dd className="font-medium">{order.easypaisa_sender_number ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Expected amount</dt>
                  <dd className="font-semibold text-primary">{formatPKR(order.total)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Status</dt>
                  <dd>{PAYMENT_STATUS_LABEL[order.payment_status]}</dd>
                </div>
              </dl>
              {order.payment_proof_path && (
                <div className="mt-4">
                  {proofUrl ? (
                    <a
                      href={proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group block overflow-hidden rounded-xl border border-border"
                    >
                      <img
                        src={proofUrl}
                        alt="Payment receipt"
                        className="max-h-96 w-full bg-muted object-contain transition-transform group-hover:scale-[1.02]"
                      />
                      <span className="flex items-center justify-center gap-1 py-2 text-xs text-muted-foreground">
                        <ExternalLink className="h-3 w-3" />
                        Open full size
                      </span>
                    </a>
                  ) : (
                    <div className="grid h-40 place-items-center rounded-xl bg-muted">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  )}
                </div>
              )}
              {!order.payment_proof_path && (
                <p className="mt-4 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
                  No receipt screenshot — verify using the transaction ID.
                </p>
              )}
              {order.payment_status === "pending_verification" && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Button variant="hero" size="lg" onClick={approve} disabled={!!saving}>
                    {saving === "approve" ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    className="rounded-full"
                    onClick={reject}
                    disabled={!!saving}
                  >
                    {saving === "reject" ? <Loader2 className="animate-spin" /> : <XCircle />}Reject
                  </Button>
                </div>
              )}
            </section>
          )}

          <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Fulfilment
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Order status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {ORDER_STATUS_LABEL[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Courier tracking #</Label>
                <Input
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder="e.g. TCS / Leopards ID"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Note to customer</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Shown on the customer's tracking page (e.g. reason for rejection)"
                className="rounded-xl"
              />
            </div>
            {status === "cancelled" && order.status !== "cancelled" && (
              <p className="text-xs text-muted-foreground">
                Cancelling returns {order.total_pieces} pieces to stock.
              </p>
            )}
            <Button variant="ink" size="lg" className="w-full" onClick={save} disabled={!!saving}>
              {saving === "save" && <Loader2 className="animate-spin" />}Save changes
            </Button>
          </section>

          <section>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              History
            </h3>
            <ol className="mt-3 space-y-3 border-l border-border pl-4">
              {(events.data ?? []).map((e) => (
                <li key={e.id} className="relative text-sm">
                  <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                  <p className="font-medium">
                    {ORDER_STATUS_LABEL[e.status]} ·{" "}
                    <span className="font-normal text-muted-foreground">
                      {PAYMENT_STATUS_LABEL[e.payment_status]}
                    </span>
                  </p>
                  {e.note && <p className="text-muted-foreground">{e.note}</p>}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(e.created_at), "d MMM, h:mm a")}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
