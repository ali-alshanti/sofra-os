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
import { useCreateEmployee } from "@/lib/hooks/use-employees";
import type { EmployeeDepartment, EmployeeRole, EmployeeStatus } from "@/features/employees/types";

// ─── Static option values ─────────────────────────────────────────────────────

const DEPARTMENT_VALUES: EmployeeDepartment[] = [
  "kitchen", "service", "management", "cashier", "delivery",
];
const ROLE_VALUES: EmployeeRole[] = [
  "manager", "head_chef", "chef", "waiter", "cashier", "delivery_driver",
];
const STATUS_VALUES: EmployeeStatus[] = [
  "on_shift", "break", "off_shift", "on_leave",
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddEmployeeDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  full_name:   string;
  email:       string;
  phone:       string;
  department:  EmployeeDepartment | "";
  role:        EmployeeRole | "";
  shift_start: string;
  shift_end:   string;
  status:      EmployeeStatus | "";
  hire_date:   string;
}

const EMPTY_FORM: FormState = {
  full_name:   "",
  email:       "",
  phone:       "",
  department:  "",
  role:        "",
  shift_start: "09:00",
  shift_end:   "17:00",
  status:      "off_shift",
  hire_date:   "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AddEmployeeDialog({ open, onOpenChange }: AddEmployeeDialogProps) {
  const t  = useTranslations("employees");
  const ta = useTranslations("common.actions");

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const create = useCreateEmployee();

  function patch(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    onOpenChange(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name || !form.department || !form.role) return;

    create.mutate(
      {
        full_name:   form.full_name,
        email:       form.email   || undefined,
        phone:       form.phone   || undefined,
        department:  form.department as EmployeeDepartment,
        role:        form.role        as EmployeeRole,
        shift_start: form.shift_start,
        shift_end:   form.shift_end,
        status:      (form.status || "off_shift") as EmployeeStatus,
        hire_date:   form.hire_date || undefined,
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
      submitDisabled={!form.full_name || !form.department || !form.role}
      loading={create.isPending}
    >
          {/* Name */}
          <div className="grid gap-1.5">
            <Label htmlFor="emp-name">{t("table.employee")}</Label>
            <Input
              id="emp-name"
              placeholder={t("add.namePlaceholder")}
              value={form.full_name}
              onChange={(e) => patch("full_name", e.target.value)}
              required
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="emp-email">Email</Label>
              <Input
                id="emp-email"
                type="email"
                placeholder={t("add.emailPlaceholder")}
                value={form.email}
                onChange={(e) => patch("email", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="emp-phone">Phone</Label>
              <Input
                id="emp-phone"
                type="tel"
                placeholder={t("add.phonePlaceholder")}
                value={form.phone}
                onChange={(e) => patch("phone", e.target.value)}
              />
            </div>
          </div>

          {/* Department + Role */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="emp-dept">{t("table.department")}</Label>
              <Select
                value={form.department}
                onValueChange={(v) => patch("department", v)}
              >
                <SelectTrigger id="emp-dept" className="h-9">
                  <SelectValue placeholder={t("add.selectDepartment")} />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENT_VALUES.map((d) => (
                    <SelectItem key={d} value={d}>
                      {t(`department.${d}` as Parameters<typeof t>[0])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="emp-role">{t("table.role")}</Label>
              <Select
                value={form.role}
                onValueChange={(v) => patch("role", v)}
              >
                <SelectTrigger id="emp-role" className="h-9">
                  <SelectValue placeholder={t("add.selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_VALUES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {t(`role.${r}` as Parameters<typeof t>[0])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Shift */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="emp-shift-start">{t("add.shiftStart")}</Label>
              <Input
                id="emp-shift-start"
                type="time"
                value={form.shift_start}
                onChange={(e) => patch("shift_start", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="emp-shift-end">{t("add.shiftEnd")}</Label>
              <Input
                id="emp-shift-end"
                type="time"
                value={form.shift_end}
                onChange={(e) => patch("shift_end", e.target.value)}
              />
            </div>
          </div>

          {/* Status + Hire Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="emp-status">{t("table.status")}</Label>
              <Select
                value={form.status}
                onValueChange={(v) => patch("status", v)}
              >
                <SelectTrigger id="emp-status" className="h-9">
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

            <div className="grid gap-1.5">
              <Label htmlFor="emp-hire">{t("table.hireDate")}</Label>
              <Input
                id="emp-hire"
                type="date"
                value={form.hire_date}
                onChange={(e) => patch("hire_date", e.target.value)}
              />
            </div>
          </div>
    </FormDialog>
  );
}
