import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminSettingsQuery } from "@/lib/admin-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery(adminSettingsQuery);
  const [f, setF] = useState({
    easypaisa_account_name: "",
    easypaisa_number: "",
    cod_delivery_fee: "",
    easypaisa_delivery_fee: "",
    support_whatsapp: "",
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data)
      setF({
        easypaisa_account_name: data.easypaisa_account_name,
        easypaisa_number: data.easypaisa_number,
        cod_delivery_fee: String(data.cod_delivery_fee ?? 400),
        easypaisa_delivery_fee: String(data.easypaisa_delivery_fee ?? 300),
        support_whatsapp: data.support_whatsapp,
      });
  }, [data]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    const codFee = parseInt(f.cod_delivery_fee, 10);
    const epFee = parseInt(f.easypaisa_delivery_fee, 10);
    if (
      !f.easypaisa_number.trim() ||
      !f.easypaisa_account_name.trim() ||
      !(codFee >= 0) ||
      !(epFee >= 0)
    ) {
      toast.error("Fill in all fields");
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("store_settings")
      .update({
        easypaisa_account_name: f.easypaisa_account_name.trim(),
        easypaisa_number: f.easypaisa_number.trim(),
        cod_delivery_fee: codFee,
        easypaisa_delivery_fee: epFee,
        support_whatsapp: f.support_whatsapp.trim(),
      })
      .eq("id", 1);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Settings saved");
    qc.invalidateQueries({ queryKey: ["admin"] });
    qc.invalidateQueries({ queryKey: ["storefront"] });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-light sm:text-4xl">Settings</h1>
        <p className="text-sm text-muted-foreground">These details appear at checkout.</p>
      </div>
      <section className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
        <h2 className="text-xl font-light">Easypaisa account</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Account number</Label>
            <Input
              value={f.easypaisa_number}
              onChange={set("easypaisa_number")}
              placeholder="03XX XXXXXXX"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Account title</Label>
            <Input
              value={f.easypaisa_account_name}
              onChange={set("easypaisa_account_name")}
              className="h-11 rounded-xl"
            />
          </div>
        </div>
      </section>
      <section className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
        <h2 className="text-xl font-light">Delivery fees</h2>
        <p className="text-sm text-muted-foreground">
          Flat per order, for every pack. COD customers pay the COD fee now via Easypaisa to
          confirm their order, then pay the product price in cash on delivery. Easypaisa customers
          pay the full total — product + delivery — in advance.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>COD delivery fee (Rs)</Label>
            <Input
              type="number"
              min={0}
              value={f.cod_delivery_fee}
              onChange={set("cod_delivery_fee")}
              className="h-11 rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              Paid in advance via Easypaisa to confirm a COD order.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>Easypaisa delivery fee (Rs)</Label>
            <Input
              type="number"
              min={0}
              value={f.easypaisa_delivery_fee}
              onChange={set("easypaisa_delivery_fee")}
              className="h-11 rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              Part of the full total paid in advance by Easypaisa.
            </p>
          </div>
        </div>
      </section>
      <section className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
        <h2 className="text-xl font-light">Support</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Support WhatsApp</Label>
            <Input
              value={f.support_whatsapp}
              onChange={set("support_whatsapp")}
              className="h-11 rounded-xl"
            />
          </div>
        </div>
      </section>
      <Button variant="hero" size="xl" onClick={save} disabled={busy}>
        {busy && <Loader2 className="animate-spin" />}Save settings
      </Button>
    </div>
  );
}
