"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FormDialog } from "@/components/shared/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateInventoryItem } from "@/lib/hooks/use-inventory";
import { useInventoryCategories, useSuppliers } from "@/lib/hooks/use-inventory";
import type { InventoryUnit } from "@/features/inventory/types";

// ─── Static option values ─────────────────────────────────────────────────────

const UNIT_VALUES: InventoryUnit[] = ["kg", "g", "liters", "ml", "units", "pieces", "bottles"];

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddInventoryItemDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  name:          string;
  sku:           string;
  unit:          InventoryUnit | "";
  quantity:      string;
  reorder_point: string;
  cost_per_unit: string;
  category_id:   string;
  supplier_id:   string;
}

const EMPTY_FORM: FormState = {
  name:          "",
  sku:           "",
  unit:          "",
  quantity:      "",
  reorder_point: "",
  cost_per_unit: "",
  category_id:   "",
  supplier_id:   "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AddInventoryItemDialog({ open, onOpenChange }: AddInventoryItemDialogProps) {
  const t  = useTranslations("inventory");
  const ta = useTranslations("common.actions");

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const create = useCreateInventoryItem();

  const { data: categories = [] } = useInventoryCategories();
  const { data: suppliers  = [] } = useSuppliers();

  function patch(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    onOpenChange(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.unit) return;

    create.mutate(
      {
        name:          form.name,
        sku:           form.sku           || undefined,
        unit:          form.unit          as InventoryUnit,
        quantity:      Number(form.quantity)      || 0,
        reorder_point: Number(form.reorder_point) || 0,
        cost_per_unit: Number(form.cost_per_unit) || 0,
        category_id:   form.category_id   || undefined,
        supplier_id:   form.supplier_id   || undefined,
      },
      { onSuccess: handleClose },
    );
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("add.title")}
      description={t("add.description")}
      maxWidth="lg"
      onSubmit={handleSubmit}
      onCancel={() => setForm(EMPTY_FORM)}
      submitLabel={ta("add")}
      cancelLabel={ta("cancel")}
      submitDisabled={!form.name || !form.unit}
      loading={create.isPending}
    >
          {/* Name + SKU */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="inv-name">{t("table.item")}</Label>
              <Input
                id="inv-name"
                placeholder={t("add.namePlaceholder")}
                value={form.name}
                onChange={(e) => patch("name", e.target.value)}
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="inv-sku">{t("table.sku")}</Label>
              <Input
                id="inv-sku"
                placeholder={t("add.skuPlaceholder")}
                value={form.sku}
                onChange={(e) => patch("sku", e.target.value)}
              />
            </div>
          </div>

          {/* Category + Supplier */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="inv-cat">{t("table.category")}</Label>
              <Select value={form.category_id} onValueChange={(v) => patch("category_id", v)}>
                <SelectTrigger id="inv-cat" className="h-9">
                  <SelectValue placeholder={t("add.selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="inv-sup">{t("table.supplier")}</Label>
              <Select value={form.supplier_id} onValueChange={(v) => patch("supplier_id", v)}>
                <SelectTrigger id="inv-sup" className="h-9">
                  <SelectValue placeholder={t("add.selectSupplier")} />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Unit */}
          <div className="grid gap-1.5">
            <Label htmlFor="inv-unit">Unit</Label>
            <Select value={form.unit} onValueChange={(v) => patch("unit", v)}>
              <SelectTrigger id="inv-unit" className="h-9">
                <SelectValue placeholder={t("add.selectUnit")} />
              </SelectTrigger>
              <SelectContent>
                {UNIT_VALUES.map((u) => (
                  <SelectItem key={u} value={u}>
                    {t(`unit.${u}` as Parameters<typeof t>[0])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity + Reorder Point + Cost */}
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="inv-qty">{t("table.quantity")}</Label>
              <Input
                id="inv-qty"
                type="number"
                min="0"
                step="0.01"
                placeholder={t("add.quantityPlaceholder")}
                value={form.quantity}
                onChange={(e) => patch("quantity", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="inv-reorder">{t("table.reorder")}</Label>
              <Input
                id="inv-reorder"
                type="number"
                min="0"
                step="0.01"
                placeholder={t("add.reorderPlaceholder")}
                value={form.reorder_point}
                onChange={(e) => patch("reorder_point", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="inv-cost">Cost / Unit</Label>
              <Input
                id="inv-cost"
                type="number"
                min="0"
                step="0.01"
                placeholder={t("add.costPlaceholder")}
                value={form.cost_per_unit}
                onChange={(e) => patch("cost_per_unit", e.target.value)}
              />
            </div>
          </div>
    </FormDialog>
  );
}
