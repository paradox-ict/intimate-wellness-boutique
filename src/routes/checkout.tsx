import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Banknote,
  Check,
  ChevronDown,
  Copy,
  ImageUp,
  Loader2,
  Lock,
  ShieldCheck,
  Smartphone,
  Truck,
  X,
} from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";
import { QuantityStepper } from "@/components/store/QuantityStepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart";
import { storefrontQuery } from "@/lib/storefront-query";
import { placeOrder } from "@/lib/store.functions";
import { computeTotals, formatPKR, normalizePkPhone } from "@/lib/format";
import { compressImage } from "@/lib/image";
import { cn } from "@/lib/utils";
import productImg from "@/assets/product-pack.jpg";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — Sukoon" },
      {
        name: "description",
        content:
          "Complete your discreet order. Cash on Delivery or Easypaisa, delivered in plain packaging.",
      },
      { property: "og:title", content: "Secure Checkout — Sukoon" },
      {
        property: "og:description",
        content: "Discreet checkout with Cash on Delivery or Easypaisa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(storefrontQuery),
  component: CheckoutPage,
});

const CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Hyderabad",
  "Sialkot",
  "Gujranwala",
  "Bahawalpur",
  "Sargodha",
  "Abbottabad",
];

type Errors = Partial<
  Record<"customerName" | "phone" | "email" | "city" | "address" | "payment", string | undefined>
>;

function CheckoutPage() {
  const { data } = useSuspenseQuery(storefrontQuery);
  const { line, setQuantity, setBundle, clear } = useCart();
  const navigate = useNavigate();
  const submit = useServerFn(placeOrder);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    notes: "",
  });
  const [method, setMethod] = useState<"cod" | "easypaisa">("cod");
  const [txnId, setTxnId] = useState("");
  const [sender, setSender] = useState("");
  const [proof, setProof] = useState<{
    base64: string;
    contentType: string;
    previewUrl: string;
    name: string;
  } | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const bundle = data.bundles.find((b) => b.id === line?.bundleId) ?? null;
  const qty = line?.quantity ?? 1;
  const totals = bundle ? computeTotals(bundle, qty, data.settings.delivery_fee) : null;

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      setErrors((er) => ({ ...er, [k]: undefined }));
    };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image of your receipt");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error("That image is too large");
      return;
    }
    try {
      const c = await compressImage(file);
      setProof({ ...c, name: file.name });
      setErrors((er) => ({ ...er, payment: undefined }));
    } catch {
      toast.error("Couldn't read that image. Try a screenshot instead.");
    }
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (form.customerName.trim().length < 2) e.customerName = "Please enter your name";
    if (!normalizePkPhone(form.phone)) e.phone = "Enter a valid mobile number (03XX XXXXXXX)";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email or leave it empty";
    if (form.city.trim().length < 2) e.city = "Please enter your city";
    if (form.address.trim().length < 8) e.address = "Please enter your full address";
    if (method === "easypaisa" && !txnId.trim() && !proof)
      e.payment = "Add your transaction ID or upload the receipt screenshot";
    return e;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!bundle) return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please check the highlighted fields");
      document
        .querySelector("[aria-invalid='true']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await submit({
        data: {
          bundleId: bundle.id,
          quantity: qty,
          ...form,
          paymentMethod: method,
          txnId: method === "easypaisa" ? txnId : "",
          senderNumber: method === "easypaisa" ? sender : "",
          proof:
            method === "easypaisa" && proof
              ? { base64: proof.base64, contentType: proof.contentType }
              : undefined,
        },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      sessionStorage.setItem("sukoon-last-order", JSON.stringify(res));
      clear();
      navigate({ to: "/order-success" });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copy = (v: string) => {
    navigator.clipboard?.writeText(v.replace(/\s/g, ""));
    toast.success("Copied");
  };

  if (!bundle || !totals) {
    return (
      <StoreShell>
        <div className="mx-auto flex max-w-md flex-col items-center px-5 py-28 text-center">
          <h1 className="text-4xl font-light">Your bag is empty</h1>
          <p className="mt-3 text-muted-foreground">Choose a pack to continue to checkout.</p>
          <div className="mt-8 grid w-full gap-3">
            {data.bundles.map((b) => (
              <Button
                key={b.id}
                variant="line"
                size="xl"
                className="justify-between"
                onClick={() => setBundle(b.id)}
              >
                <span>
                  {b.name} · {b.pieces} pc
                </span>
                <span className="font-semibold">{formatPKR(b.price)}</span>
              </Button>
            ))}
          </div>
        </div>
      </StoreShell>
    );
  }

  const summary = (
    <div className="space-y-5">
      <div className="flex gap-4">
        <img src={productImg} alt="" className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg leading-tight">Herbal Tightening Gel</p>
          <p className="text-sm text-muted-foreground">
            {bundle.name} · {bundle.pieces} applicator{bundle.pieces > 1 ? "s" : ""}
          </p>
          <div className="mt-2">
            <QuantityStepper value={qty} onChange={setQuantity} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {data.bundles.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setBundle(b.id)}
            className={cn(
              "rounded-xl border px-2 py-2 text-center text-xs transition-all",
              b.id === bundle.id
                ? "border-primary bg-secondary/60 font-semibold"
                : "border-border hover:border-primary/40",
            )}
          >
            {b.name}
            <span className="block text-muted-foreground">{formatPKR(b.price)}</span>
          </button>
        ))}
      </div>
      <dl className="space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="tabular-nums">{formatPKR(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Delivery</dt>
          <dd className="tabular-nums">
            {totals.delivery === 0 ? (
              <span className="font-semibold text-sage">Free</span>
            ) : (
              formatPKR(totals.delivery)
            )}
          </dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold">
          <dt>Total</dt>
          <dd className="font-display tabular-nums">{formatPKR(totals.total)}</dd>
        </div>
      </dl>
      <div className="space-y-2 rounded-2xl bg-muted p-4 text-xs text-muted-foreground">
        <p className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-primary" />
          Plain, unbranded packaging
        </p>
        <p className="flex items-center gap-2">
          <Truck className="h-3.5 w-3.5 text-primary" />
          2–4 working days nationwide
        </p>
        <p className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          CE & ISO 9001 certified
        </p>
      </div>
    </div>
  );

  return (
    <StoreShell>
      <div className="bg-blush">
        <form
          onSubmit={onSubmit}
          noValidate
          className="mx-auto grid max-w-6xl gap-8 px-5 pb-32 pt-8 md:grid-cols-[1.3fr_1fr] md:px-8 md:pb-20 md:pt-12"
        >
          <div className="space-y-6">
            <div className="animate-fade-up">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                ← Continue shopping
              </Link>
              <h1 className="mt-3 text-4xl font-light sm:text-5xl">Checkout</h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                Your details are private and used only for delivery.
              </p>
            </div>

            {/* Mobile summary */}
            <div className="rounded-3xl border border-border/70 bg-card shadow-card md:hidden">
              <button
                type="button"
                onClick={() => setSummaryOpen((v) => !v)}
                className="flex w-full items-center justify-between px-5 py-4"
                aria-expanded={summaryOpen}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  Order summary{" "}
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", summaryOpen && "rotate-180")}
                  />
                </span>
                <span className="font-display text-lg">{formatPKR(totals.total)}</span>
              </button>
              <div
                className={cn(
                  "grid transition-all duration-500",
                  summaryOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="px-5 pb-5">{summary}</div>
                </div>
              </div>
            </div>

            <fieldset className="animate-fade-up rounded-3xl border border-border/70 bg-card p-5 shadow-card sm:p-7 [animation-delay:100ms]">
              <legend className="sr-only">Delivery details</legend>
              <StepTitle n={1} title="Delivery details" />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={errors.customerName} className="sm:col-span-2">
                  <Input
                    autoComplete="name"
                    value={form.customerName}
                    onChange={set("customerName")}
                    aria-invalid={!!errors.customerName}
                    placeholder="e.g. Ayesha Khan"
                    className="h-12 rounded-xl"
                  />
                </Field>
                <Field
                  label="Mobile number"
                  error={errors.phone}
                  hint="Rider will call this number"
                >
                  <Input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    aria-invalid={!!errors.phone}
                    placeholder="03XX XXXXXXX"
                    className="h-12 rounded-xl"
                  />
                </Field>
                <Field label="Email (optional)" error={errors.email}>
                  <Input
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={set("email")}
                    aria-invalid={!!errors.email}
                    placeholder="you@example.com"
                    className="h-12 rounded-xl"
                  />
                </Field>
                <Field label="City" error={errors.city} className="sm:col-span-2">
                  <Input
                    list="pk-cities"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={set("city")}
                    aria-invalid={!!errors.city}
                    placeholder="Start typing your city"
                    className="h-12 rounded-xl"
                  />
                  <datalist id="pk-cities">
                    {CITIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Full address" error={errors.address} className="sm:col-span-2">
                  <Textarea
                    autoComplete="street-address"
                    value={form.address}
                    onChange={set("address")}
                    aria-invalid={!!errors.address}
                    placeholder="House #, street, area, nearby landmark"
                    className="min-h-24 rounded-xl"
                  />
                </Field>
                <Field label="Delivery note (optional)" className="sm:col-span-2">
                  <Input
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="e.g. Call before delivery"
                    className="h-12 rounded-xl"
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset className="animate-fade-up rounded-3xl border border-border/70 bg-card p-5 shadow-card sm:p-7 [animation-delay:200ms]">
              <legend className="sr-only">Payment</legend>
              <StepTitle n={2} title="Payment method" />
              <div role="radiogroup" className="mt-6 grid gap-3 sm:grid-cols-2">
                <PayOption
                  active={method === "cod"}
                  onClick={() => setMethod("cod")}
                  icon={<Banknote className="h-5 w-5" />}
                  title="Cash on Delivery"
                  text="Pay the rider when it arrives"
                />
                <PayOption
                  active={method === "easypaisa"}
                  onClick={() => setMethod("easypaisa")}
                  icon={<Smartphone className="h-5 w-5" />}
                  title="Easypaisa"
                  text="Send now, we verify & ship"
                />
              </div>

              <div
                className={cn(
                  "grid transition-all duration-500",
                  method === "easypaisa"
                    ? "mt-6 grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="space-y-5 rounded-2xl border border-dashed border-primary/30 bg-secondary/40 p-5">
                    <ol className="space-y-2 text-sm">
                      <li>
                        <span className="font-semibold">1.</span> Open Easypaisa and send{" "}
                        <span className="font-semibold text-primary">
                          {formatPKR(totals.total)}
                        </span>{" "}
                        to:
                      </li>
                    </ol>
                    <div className="grid gap-2 rounded-2xl bg-card p-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Account number</p>
                        <button
                          type="button"
                          onClick={() => copy(data.settings.easypaisa_number)}
                          className="mt-0.5 flex items-center gap-2 font-display text-xl tabular-nums hover:text-primary"
                        >
                          {data.settings.easypaisa_number} <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Account title</p>
                        <p className="mt-0.5 font-medium">{data.settings.easypaisa_account_name}</p>
                      </div>
                    </div>
                    <p className="text-sm">
                      <span className="font-semibold">2.</span> Enter the transaction ID and/or
                      upload your receipt screenshot:
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Transaction ID (TID)">
                        <Input
                          value={txnId}
                          onChange={(e) => {
                            setTxnId(e.target.value);
                            setErrors((er) => ({ ...er, payment: undefined }));
                          }}
                          aria-invalid={!!errors.payment}
                          placeholder="e.g. 3456789012"
                          className="h-12 rounded-xl"
                        />
                      </Field>
                      <Field label="Sent from number (optional)">
                        <Input
                          type="tel"
                          value={sender}
                          onChange={(e) => setSender(e.target.value)}
                          placeholder="03XX XXXXXXX"
                          className="h-12 rounded-xl"
                        />
                      </Field>
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onFile(e.target.files?.[0])}
                    />
                    {proof ? (
                      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 animate-pop">
                        <img
                          src={proof.previewUrl}
                          alt="Receipt preview"
                          className="h-16 w-16 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1.5 text-sm font-medium">
                            <Check className="h-4 w-4 text-sage" />
                            Receipt attached
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{proof.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setProof(null)}
                          className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
                          aria-label="Remove receipt"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card px-4 py-6 text-sm transition-all hover:border-primary/50 hover:bg-secondary/40"
                      >
                        <ImageUp className="h-6 w-6 text-primary" />
                        <span className="font-medium">Upload receipt screenshot</span>
                        <span className="text-xs text-muted-foreground">
                          JPG or PNG · we'll verify it within a few hours
                        </span>
                      </button>
                    )}
                    {errors.payment && (
                      <p className="text-sm font-medium text-destructive" aria-invalid="true">
                        {errors.payment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </fieldset>

            <div className="hidden md:block">
              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full"
                disabled={submitting || !data.settings.in_stock}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Placing order…
                  </>
                ) : (
                  `Place order · ${formatPKR(totals.total)}`
                )}
              </Button>
            </div>
          </div>

          <aside className="hidden md:block">
            <div className="sticky top-28 rounded-3xl border border-border/70 bg-card p-7 shadow-card animate-fade-up [animation-delay:150ms]">
              <h2 className="mb-5 text-2xl font-light">Order summary</h2>
              {summary}
            </div>
          </aside>

          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 p-3 backdrop-blur-xl md:hidden">
            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={submitting || !data.settings.in_stock}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Placing order…
                </>
              ) : (
                `Place order · ${formatPKR(totals.total)}`
              )}
            </Button>
          </div>
        </form>
      </div>
    </StoreShell>
  );
}

function StepTitle({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-sm font-bold text-primary-foreground">
        {n}
      </span>
      <h2 className="text-2xl font-light">{title}</h2>
    </div>
  );
}

function Field({
  label,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  className?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function PayOption({
  active,
  onClick,
  icon,
  title,
  text,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-300",
        active
          ? "border-primary bg-secondary/50 shadow-soft"
          : "border-border hover:border-primary/40",
      )}
    >
      <span
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors",
          active ? "bg-brand text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="block text-xs text-muted-foreground">{text}</span>
      </span>
      <span
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
          active ? "border-primary bg-primary text-primary-foreground" : "border-border",
        )}
      >
        {active && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}
