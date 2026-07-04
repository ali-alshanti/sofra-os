"use client";

import { useState } from "react";
import { ShoppingBag, UtensilsCrossed, Bike, ClipboardList, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { FormDialog } from "@/components/shared/form-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateOrder, useTablesForFilter, useWaitersForFilter } from "@/lib/hooks/use-orders";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateOrderDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Form state ───────────────────────────────────────────────────────────────

type OrderTypeValue = "dine-in" | "takeaway" | "delivery";

interface FormState {
  type:     OrderTypeValue | "";
  tableId:  string;
  waiterId: string;
}

const EMPTY_FORM: FormState = { type: "", tableId: "", waiterId: "" };

const ORDER_TYPES: { value: OrderTypeValue; icon: typeof UtensilsCrossed }[] = [
  { value: "dine-in",  icon: UtensilsCrossed },
  { value: "takeaway", icon: ShoppingBag },
  { value: "delivery", icon: Bike },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateOrderDialog({ open, onOpenChange }: CreateOrderDialogProps) {
  const t  = useTranslations("orders");
  const ta = useTranslations("common.actions");

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const create = useCreateOrder();

  const { data: tables  = [] } = useTablesForFilter();
  const { data: waiters = [] } = useWaitersForFilter();

  function patch(key: keyof FormState, value: string) {
    setForm((f) => ({
      ...f,
      [key]: value,
      // reset table when switching away from dine-in
      ...(key === "type" && value !== "dine-in" ? { tableId: "" } : {}),
    }));
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    onOpenChange(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.type) return;

    create.mutate(
      {
        type:     form.type as OrderTypeValue,
        tableId:  form.tableId  || undefined,
        waiterId: form.waiterId || undefined,
      },
      { onSuccess: handleClose },
    );
  }

  const isDineIn = form.type === "dine-in";

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      icon={ClipboardList}
      title={t("create.title")}
      description={t("create.description")}
      onSubmit={handleSubmit}
      onCancel={() => setForm(EMPTY_FORM)}
      submitLabel={ta("create")}
      cancelLabel={ta("cancel")}
      submitDisabled={!form.type}
      loading={create.isPending}
    >
          {/* Order Type */}
          <div className="grid gap-1.5">
            <Label>{t("filters.type")}</Label>
            <div className="grid grid-cols-3 gap-2">
              {ORDER_TYPES.map(({ value, icon: Icon }) => {
                const selected = form.type === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => patch("type", value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-xs font-medium transition-colors",
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/60",
                    )}
                  >
                    <Icon className="size-4.5" />
                    {t(`type.${value === "dine-in" ? "dine_in" : value}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 rounded-lg bg-muted/30 p-3">
            {/* Table (dine-in only) */}
            {isDineIn && (
              <div className="grid gap-1.5">
                <Label htmlFor="ord-table">{t("filters.table")}</Label>
                <Select value={form.tableId} onValueChange={(v) => patch("tableId", v)}>
                  <SelectTrigger id="ord-table" className="h-9 w-full bg-background">
                    <SelectValue placeholder={t("filters.allTables")} />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table.id} value={table.id}>
                        {t("filters.tableLabel", { number: table.number })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Waiter */}
            <div className="grid gap-1.5">
              <Label htmlFor="ord-waiter">{t("filters.waiter")}</Label>
              <Select value={form.waiterId} onValueChange={(v) => patch("waiterId", v)}>
                <SelectTrigger id="ord-waiter" className="h-9 w-full bg-background">
                  <div className="flex items-center gap-2">
                    <UserRound className="size-4 text-muted-foreground" />
                    <SelectValue placeholder={t("filters.allWaiters")} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {waiters.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      <div className="flex items-center gap-2">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                          {w.name.charAt(0).toUpperCase()}
                        </span>
                        {w.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
    </FormDialog>
  );
}
