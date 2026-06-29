"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  EmployeeFiltersValue,
  EmployeeDepartment,
  EmployeeRole,
  EmployeeStatus,
} from "@/features/employees/types";

// ─── Static option values ─────────────────────────────────────────────────────

const DEPARTMENT_VALUES: (EmployeeDepartment | "all")[] = [
  "all", "kitchen", "service", "management", "cashier", "delivery",
];

const ROLE_VALUES: (EmployeeRole | "all")[] = [
  "all", "manager", "head_chef", "chef", "waiter", "cashier", "delivery_driver",
];

const STATUS_VALUES: (EmployeeStatus | "all")[] = [
  "all", "on_shift", "break", "off_shift", "on_leave",
];

// ─── Props ─────────────────────────────────────────────────────────────────────

interface EmployeeFiltersProps {
  value: EmployeeFiltersValue;
  onSearchChange?:    (search: string) => void;
  onDepartmentChange?: (department: EmployeeDepartment | "all") => void;
  onRoleChange?:      (role: EmployeeRole | "all") => void;
  onStatusChange?:    (status: EmployeeStatus | "all") => void;
  disabled?: boolean;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function EmployeeFilters({
  value,
  onSearchChange,
  onDepartmentChange,
  onRoleChange,
  onStatusChange,
  disabled = false,
  className,
}: EmployeeFiltersProps) {
  const t = useTranslations("employees");

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-xl border border-border/20 bg-muted/40 p-4",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      {/* Search */}
      <div className="relative min-w-50 flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder={t("filters.searchPlaceholder")}
          aria-label={t("filters.searchPlaceholder")}
          value={value.search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="h-9 w-full pl-9 text-sm"
          disabled={disabled}
        />
      </div>

      {/* Department */}
      <Select
        value={value.department}
        onValueChange={(v) => onDepartmentChange?.(v as EmployeeDepartment | "all")}
        disabled={disabled}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder={t("filters.allDepartments")} />
        </SelectTrigger>
        <SelectContent>
          {DEPARTMENT_VALUES.map((d) => (
            <SelectItem key={d} value={d}>
              {d === "all"
                ? t("filters.allDepartments")
                : t(`department.${d}` as Parameters<typeof t>[0])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Role */}
      <Select
        value={value.role}
        onValueChange={(v) => onRoleChange?.(v as EmployeeRole | "all")}
        disabled={disabled}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder={t("filters.allRoles")} />
        </SelectTrigger>
        <SelectContent>
          {ROLE_VALUES.map((r) => (
            <SelectItem key={r} value={r}>
              {r === "all"
                ? t("filters.allRoles")
                : t(`role.${r}` as Parameters<typeof t>[0])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Shift Status */}
      <Select
        value={value.status}
        onValueChange={(v) => onStatusChange?.(v as EmployeeStatus | "all")}
        disabled={disabled}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder={t("filters.allStatuses")} />
        </SelectTrigger>
        <SelectContent>
          {STATUS_VALUES.map((s) => (
            <SelectItem key={s} value={s}>
              {s === "all"
                ? t("filters.allStatuses")
                : t(`status.${s}` as Parameters<typeof t>[0])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Advanced filters */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-muted-foreground hover:text-foreground"
        disabled={disabled}
        aria-label={t("filters.department")}
      >
        <SlidersHorizontal size={16} />
      </Button>
    </div>
  );
}
