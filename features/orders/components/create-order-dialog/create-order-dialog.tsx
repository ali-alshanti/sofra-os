"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("create.title")}</DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          {/* Order Type */}
          <div className="grid gap-1.5">
            <Label htmlFor="ord-type">{t("filters.type")}</Label>
            <Select value={form.type} onValueChange={(v) => patch("type", v)}>
              <SelectTrigger id="ord-type" className="h-9">
                <SelectValue placeholder={t("filters.allTypes")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dine-in">
                  {t("type.dine_in")}
                </SelectItem>
                <SelectItem value="takeaway">
                  {t("type.takeaway")}
                </SelectItem>
                <SelectItem value="delivery">
                  {t("type.delivery")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table (dine-in only) */}
          {isDineIn && (
            <div className="grid gap-1.5">
              <Label htmlFor="ord-table">{t("filters.table")}</Label>
              <Select value={form.tableId} onValueChange={(v) => patch("tableId", v)}>
                <SelectTrigger id="ord-table" className="h-9">
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
              <SelectTrigger id="ord-waiter" className="h-9">
                <SelectValue placeholder={t("filters.allWaiters")} />
              </SelectTrigger>
              <SelectContent>
                {waiters.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={create.isPending}>
              {ta("cancel")}
            </Button>
            <Button type="submit" disabled={create.isPending || !form.type}>
              {create.isPending && <Loader2 size={14} className="animate-spin" />}
              {ta("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
