import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminBundlesQuery, adminSettingsQuery, type Bundle } from "@/lib/admin-queries";
import { formatPKR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/admin/packs")({
  component: PacksPage,
});

function PacksPage() {
  const qc = useQueryClient();
  const { data: bundles, isLoading } = useQuery(adminBundlesQuery);
  const { data: settings } = useQuery(adminSettingsQuery);
  const [stock, setStock] = useState("");
  const [threshold, setThreshold] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setStock(String(settings.stock_count));
      setThreshold(String(settings.low_stock_threshold));
    }
  }, [settings]);

  const refresh = () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ["admin"] }),
      qc.invalidateQueries({ queryKey: ["storefront"] }),
    ]);

  const saveStock = async () => {
    const s = parseInt(stock, 10);
    const t = parseInt(threshold, 10);
    if (!Number.isFinite(s) || s < 0 || !Number.isFinite(t) || t < 0) {
      toast.error("Enter valid numbers");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("store_settings")
      .update({ stock_count: s, low_stock_threshold: t })
      .eq("id", 1);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Stock updated");
    refresh();
  };

  const addBundle = async () => {
    const { error } = await supabase.from("bundles").insert({
      name: "New pack",
      pieces: 2,
      price: 2799,
      sort_order: (bundles?.length ?? 0) + 1,
      is_active: false,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    refresh();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light sm:text-4xl">Packs & stock</h1>
        <p className="text-sm text-muted-foreground">
          Stock is counted in individual applicators. Orders reduce it automatically; cancellations
          put it back.
        </p>
      </div>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
        <h2 className="text-xl font-light">Inventory</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="space-y-1.5">
            <Label>Applicators in stock</Label>
            <Input
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Show "low stock" below</Label>
            <Input
              type="number"
              min={0}
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
          <Button variant="ink" size="lg" onClick={saveStock} disabled={saving}>
            {saving && <Loader2 className="animate-spin" />}Save stock
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-light">Bundle pricing</h2>
          <Button variant="soft" size="sm" onClick={addBundle}>
            <Plus />
            Add pack
          </Button>
        </div>
        {isLoading ? (
          <div className="grid h-32 place-items-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {bundles?.map((b) => (
              <BundleEditor key={b.id} bundle={b} onSaved={refresh} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function BundleEditor({ bundle, onSaved }: { bundle: Bundle; onSaved: () => void }) {
  const [f, setF] = useState({
    name: bundle.name,
    tagline: bundle.tagline ?? "",
    pieces: String(bundle.pieces),
    price: String(bundle.price),
    compare_at_price: bundle.compare_at_price ? String(bundle.compare_at_price) : "",
    badge: bundle.badge ?? "",
    sort_order: String(bundle.sort_order),
    is_active: bundle.is_active,
  });
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    const pieces = parseInt(f.pieces, 10);
    const price = parseInt(f.price, 10);
    const compare = f.compare_at_price ? parseInt(f.compare_at_price, 10) : null;
    if (!f.name.trim() || !(pieces > 0) || !(price >= 0)) {
      toast.error("Name, pieces and price are required");
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("bundles")
      .update({
        name: f.name.trim(),
        tagline: f.tagline.trim() || null,
        pieces,
        price,
        compare_at_price: compare,
        badge: f.badge.trim() || null,
        sort_order: parseInt(f.sort_order, 10) || 0,
        is_active: f.is_active,
      })
      .eq("id", bundle.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`${f.name} saved`);
    onSaved();
  };

  const remove = async () => {
    if (!confirm(`Delete the "${bundle.name}" pack? Past orders keep their details.`)) return;
    const { error } = await supabase.from("bundles").delete().eq("id", bundle.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    onSaved();
  };

  return (
    <div className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-2xl">{f.name || "Untitled"}</p>
        <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {f.is_active ? "Visible" : "Hidden"}{" "}
          <Switch
            checked={f.is_active}
            onCheckedChange={(v) => setF((p) => ({ ...p, is_active: v }))}
          />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input value={f.name} onChange={set("name")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label>Applicators</Label>
          <Input
            type="number"
            min={1}
            value={f.pieces}
            onChange={set("pieces")}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Price (Rs)</Label>
          <Input
            type="number"
            min={0}
            value={f.price}
            onChange={set("price")}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Was price (Rs)</Label>
          <Input
            type="number"
            min={0}
            value={f.compare_at_price}
            onChange={set("compare_at_price")}
            placeholder="optional"
            className="rounded-xl"
          />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Tagline</Label>
          <Input value={f.tagline} onChange={set("tagline")} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label>Badge</Label>
          <Input
            value={f.badge}
            onChange={set("badge")}
            placeholder="e.g. Best value"
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Display order</Label>
          <Input
            type="number"
            value={f.sort_order}
            onChange={set("sort_order")}
            className="rounded-xl"
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {parseInt(f.pieces) > 0 && parseInt(f.price) >= 0
            ? `${formatPKR(parseInt(f.price) / parseInt(f.pieces))} per applicator`
            : ""}
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={remove} aria-label="Delete pack">
            <Trash2 />
          </Button>
          <Button variant="ink" onClick={save} disabled={busy}>
            {busy && <Loader2 className="animate-spin" />}Save
          </Button>
        </div>
      </div>
    </div>
  );
}
