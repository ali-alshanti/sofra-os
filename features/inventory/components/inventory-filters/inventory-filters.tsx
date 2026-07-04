"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  InventoryCategory,
  Supplier,
  InventoryStatus,
  InventoryFiltersValue,
} from "@/features/inventory/types";

// ─── Static option values ─────────────────────────────────────────────────────

const STOCK_STATUS_VALUES: (InventoryStatus | "all")[] = [
  "all", "in_stock", "low_stock", "out_of_stock",
];

// ─── Props ─────────────────────────────────────────────────────────────────────

interface InventoryFiltersProps {
  value: InventoryFiltersValue;
  categories?: InventoryCategory[];
  suppliers?:  Supplier[];
  onSearchChange?:   (search: string) => void;
  onCategoryChange?: (categoryId: string) => void;
  onSupplierChange?: (supplierId: string) => void;
  onStatusChange?:   (status: InventoryStatus | "all") => void;
  disabled?: boolean;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function InventoryFilters({
  value,
  categories = [],
  suppliers  = [],
  onSearchChange,
  onCategoryChange,
  onSupplierChange,
  onStatusChange,
  disabled = false,
  className,
}: InventoryFiltersProps) {
  const t = useTranslations("inventory");

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-xl border border-border/20 bg-muted/40 p-4",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      {/* Search */}
      <div className="relative min-w-60 flex-1">
        <Search
          size={16}
          className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
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

      {/* Category */}
      <Select
        value={value.categoryId}
        onValueChange={onCategoryChange}
        disabled={disabled}
      >
        <SelectTrigger className="h-9 w-44 text-sm">
          <SelectValue placeholder={t("filters.allCategories")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("filters.allCategories")}</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Supplier */}
      <Select
        value={value.supplierId}
        onValueChange={onSupplierChange}
        disabled={disabled}
      >
        <SelectTrigger className="h-9 w-44 text-sm">
          <SelectValue placeholder={t("filters.allSuppliers")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("filters.allSuppliers")}</SelectItem>
          {suppliers.map((sup) => (
            <SelectItem key={sup.id} value={sup.id}>
              {sup.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Stock Status */}
      <Select
        value={value.status}
        onValueChange={(v) => onStatusChange?.(v as InventoryStatus | "all")}
        disabled={disabled}
      >
        <SelectTrigger className="h-9 w-44 text-sm">
          <SelectValue placeholder={t("filters.allStatuses")} />
        </SelectTrigger>
        <SelectContent>
          {STOCK_STATUS_VALUES.map((s) => (
            <SelectItem key={s} value={s}>
              {s === "all"
                ? t("filters.allStatuses")
                : t(`status.${s}` as Parameters<typeof t>[0])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
