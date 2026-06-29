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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCustomer } from "@/lib/hooks/use-customers";
import type { CustomerLoyalty, CustomerStatus } from "@/features/customers/types";

// ─── Static option values ─────────────────────────────────────────────────────

const LOYALTY_VALUES: CustomerLoyalty[] = ["platinum", "gold", "silver", "bronze", "none"];
const STATUS_VALUES:  CustomerStatus[]  = ["active", "vip", "inactive"];

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddCustomerDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  full_name: string;
  email:     string;
  phone:     string;
  loyalty:   CustomerLoyalty | "";
  status:    CustomerStatus  | "";
}

const EMPTY_FORM: FormState = {
  full_name: "",
  email:     "",
  phone:     "",
  loyalty:   "none",
  status:    "active",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AddCustomerDialog({ open, onOpenChange }: AddCustomerDialogProps) {
  const t  = useTranslations("customers");
  const ta = useTranslations("common.actions");

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const create = useCreateCustomer();

  function patch(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    onOpenChange(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name) return;

    create.mutate(
      {
        full_name: form.full_name,
        email:     form.email   || undefined,
        phone:     form.phone   || undefined,
        loyalty:   (form.loyalty || "none") as CustomerLoyalty,
        status:    (form.status  || "active") as CustomerStatus,
      },
      { onSuccess: handleClose },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("add.title")}</DialogTitle>
          <DialogDescription>{t("add.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          {/* Name */}
          <div className="grid gap-1.5">
            <Label htmlFor="cust-name">{t("table.customer")}</Label>
            <Input
              id="cust-name"
              placeholder={t("add.namePlaceholder")}
              value={form.full_name}
              onChange={(e) => patch("full_name", e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="grid gap-1.5">
            <Label htmlFor="cust-email">{t("table.contact")}</Label>
            <Input
              id="cust-email"
              type="email"
              placeholder={t("add.emailPlaceholder")}
              value={form.email}
              onChange={(e) => patch("email", e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="grid gap-1.5">
            <Label htmlFor="cust-phone">Phone</Label>
            <Input
              id="cust-phone"
              type="tel"
              placeholder={t("add.phonePlaceholder")}
              value={form.phone}
              onChange={(e) => patch("phone", e.target.value)}
            />
          </div>

          {/* Loyalty + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="cust-loyalty">{t("table.loyalty")}</Label>
              <Select value={form.loyalty} onValueChange={(v) => patch("loyalty", v)}>
                <SelectTrigger id="cust-loyalty" className="h-9">
                  <SelectValue placeholder={t("add.selectLoyalty")} />
                </SelectTrigger>
                <SelectContent>
                  {LOYALTY_VALUES.map((l) => (
                    <SelectItem key={l} value={l}>
                      {t(`loyalty.${l}` as Parameters<typeof t>[0])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="cust-status">{t("table.status")}</Label>
              <Select value={form.status} onValueChange={(v) => patch("status", v)}>
                <SelectTrigger id="cust-status" className="h-9">
                  <SelectValue placeholder={t("add.selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_VALUES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {t(`status.${s}` as Parameters<typeof t>[0])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={create.isPending}>
              {ta("cancel")}
            </Button>
            <Button type="submit" disabled={create.isPending || !form.full_name}>
              {create.isPending && <Loader2 size={14} className="animate-spin" />}
              {ta("add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
