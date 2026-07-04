"use client";

import { useState } from "react";
import { CalendarPlus } from "lucide-react";
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
import { useCreateReservation, useTablesForReservation } from "@/lib/hooks/use-tables";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateReservationDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  guest_name:       string;
  party_size:       string;
  reservation_time: string;
  table_id:         string;
}

const EMPTY_FORM: FormState = {
  guest_name:       "",
  party_size:       "2",
  reservation_time: "",
  table_id:         "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateReservationDialog({ open, onOpenChange }: CreateReservationDialogProps) {
  const t  = useTranslations("tables");
  const ta = useTranslations("common.actions");

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const create = useCreateReservation();

  const { data: tables = [] } = useTablesForReservation();

  function patch(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    onOpenChange(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.guest_name || !form.reservation_time) return;

    create.mutate(
      {
        guest_name:       form.guest_name,
        party_size:       Number(form.party_size) || 1,
        reservation_time: new Date(form.reservation_time).toISOString(),
        table_id:         form.table_id || undefined,
      },
      { onSuccess: handleClose },
    );
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={(next) => { if (!next) setForm(EMPTY_FORM); onOpenChange(next); }}
      icon={CalendarPlus}
      title={t("create.title")}
      description={t("create.description")}
      onSubmit={handleSubmit}
      onCancel={() => setForm(EMPTY_FORM)}
      submitLabel={ta("create")}
      cancelLabel={ta("cancel")}
      submitDisabled={!form.guest_name || !form.reservation_time}
      loading={create.isPending}
    >
      {/* Guest name */}
      <div className="grid gap-1.5">
        <Label htmlFor="res-guest">{t("create.nameLabel")}</Label>
        <Input
          id="res-guest"
          placeholder={t("create.namePlaceholder")}
          value={form.guest_name}
          onChange={(e) => patch("guest_name", e.target.value)}
          required
        />
      </div>

      {/* Party size + Time */}
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="res-party">{t("create.partyLabel")}</Label>
          <Input
            id="res-party"
            type="number"
            min="1"
            value={form.party_size}
            onChange={(e) => patch("party_size", e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="res-time">{t("create.timeLabel")}</Label>
          <Input
            id="res-time"
            type="datetime-local"
            dir="ltr"
            className="text-left"
            value={form.reservation_time}
            onChange={(e) => patch("reservation_time", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Table */}
      <div className="grid gap-1.5">
        <Label htmlFor="res-table">{t("create.tableLabel")}</Label>
        <Select value={form.table_id} onValueChange={(v) => patch("table_id", v)}>
          <SelectTrigger id="res-table" className="h-9 w-full">
            <SelectValue placeholder={t("create.selectTable")} />
          </SelectTrigger>
          <SelectContent>
            {tables.map((table) => (
              <SelectItem key={table.id} value={table.id}>
                {t("table.number", { number: table.number })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FormDialog>
  );
}
