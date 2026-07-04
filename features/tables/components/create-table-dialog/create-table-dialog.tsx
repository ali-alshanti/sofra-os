"use client";

import { useState } from "react";
import { LayoutGrid } from "lucide-react";
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
import { useCreateTable } from "@/lib/hooks/use-tables";
import type { TableShape } from "@/features/tables/components/table-card";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateTableDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  number:   string;
  capacity: string;
  shape:    TableShape;
  location: string;
}

const EMPTY_FORM: FormState = {
  number:   "",
  capacity: "2",
  shape:    "square",
  location: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateTableDialog({ open, onOpenChange }: CreateTableDialogProps) {
  const t  = useTranslations("tables");
  const ta = useTranslations("common.actions");

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const create = useCreateTable();

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    onOpenChange(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.number) return;

    create.mutate(
      {
        number:   form.number,
        capacity: Number(form.capacity) || 1,
        shape:    form.shape,
        location: form.location || undefined,
      },
      { onSuccess: handleClose },
    );
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={(next) => { if (!next) setForm(EMPTY_FORM); onOpenChange(next); }}
      icon={LayoutGrid}
      title={t("createTable.title")}
      description={t("createTable.description")}
      onSubmit={handleSubmit}
      onCancel={() => setForm(EMPTY_FORM)}
      submitLabel={ta("create")}
      cancelLabel={ta("cancel")}
      submitDisabled={!form.number}
      loading={create.isPending}
    >
      {/* Number + Capacity */}
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="table-number">{t("createTable.numberLabel")}</Label>
          <Input
            id="table-number"
            placeholder={t("createTable.numberPlaceholder")}
            value={form.number}
            onChange={(e) => patch("number", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="table-capacity">{t("createTable.capacityLabel")}</Label>
          <Input
            id="table-capacity"
            type="number"
            min="1"
            value={form.capacity}
            onChange={(e) => patch("capacity", e.target.value)}
          />
        </div>
      </div>

      {/* Shape */}
      <div className="grid gap-1.5">
        <Label htmlFor="table-shape">{t("createTable.shapeLabel")}</Label>
        <Select value={form.shape} onValueChange={(v) => patch("shape", v as TableShape)}>
          <SelectTrigger id="table-shape" className="h-9 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="square">{t("createTable.shapeSquare")}</SelectItem>
            <SelectItem value="round">{t("createTable.shapeRound")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="grid gap-1.5">
        <Label htmlFor="table-location">{t("createTable.locationLabel")}</Label>
        <Input
          id="table-location"
          placeholder={t("createTable.locationPlaceholder")}
          value={form.location}
          onChange={(e) => patch("location", e.target.value)}
        />
      </div>
    </FormDialog>
  );
}
