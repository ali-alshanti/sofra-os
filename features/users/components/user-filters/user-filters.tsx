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
import { ROLE_VALUES, type UserFiltersValue, type AppUserStatus } from "@/features/users/types";
import type { UserRole } from "@/types/auth";

const STATUS_VALUES: (AppUserStatus | "all")[] = ["all", "active", "inactive"];

interface UserFiltersProps {
  value: UserFiltersValue;
  onSearchChange?: (search: string) => void;
  onRoleChange?: (role: UserRole | "all") => void;
  onStatusChange?: (status: AppUserStatus | "all") => void;
  onClearFilters?: () => void;
  disabled?: boolean;
  className?: string;
}

export function UserFilters({
  value,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onClearFilters,
  disabled = false,
  className,
}: UserFiltersProps) {
  const t = useTranslations("users");

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-xl border border-border/20 bg-muted/40 p-4",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      <div className="relative min-w-50 flex-1">
        <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("filters.searchPlaceholder")}
          aria-label={t("filters.searchPlaceholder")}
          value={value.search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="h-9 w-full ps-9 text-sm"
          disabled={disabled}
        />
      </div>

      <Select value={value.role} onValueChange={(v) => onRoleChange?.(v as UserRole | "all")} disabled={disabled}>
        <SelectTrigger className="h-9 w-44 text-sm">
          <SelectValue placeholder={t("filters.allRoles")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("filters.allRoles")}</SelectItem>
          {ROLE_VALUES.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.status} onValueChange={(v) => onStatusChange?.(v as AppUserStatus | "all")} disabled={disabled}>
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder={t("filters.allStatuses")} />
        </SelectTrigger>
        <SelectContent>
          {STATUS_VALUES.map((s) => (
            <SelectItem key={s} value={s}>
              {s === "all" ? t("filters.allStatuses") : t(`status.${s}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-muted-foreground hover:text-foreground"
        disabled={disabled}
        aria-label={t("filters.clear")}
        title={t("filters.clear")}
        onClick={() => onClearFilters?.()}
      >
        <SlidersHorizontal size={16} />
      </Button>
    </div>
  );
}
