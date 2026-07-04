"use client";

import { Search, X } from "lucide-react";
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
import { DateRangePicker, type DateRangePreset } from "@/components/shared/date-range-picker";
import { presetToDateRange } from "@/lib/utils/date";
import { cn } from "@/lib/utils";
import { useTablesForFilter, useWaitersForFilter } from "@/lib/hooks/use-orders";
import type { OrderStatusFilter, OrderType } from "@/features/orders/types";

// ─── Re-exports for consumers ─────────────────────────────────────────────────
export type { OrderStatusFilter as OrderStatus, OrderType };

// ─── Filter value ─────────────────────────────────────────────────────────────

export interface OrdersFiltersValue {
  search:    string;
  status:    OrderStatusFilter;
  tableId:   string;
  waiterId:  string;
  orderType: OrderType;
  dateFrom:  string;
  dateTo:    string;
  /** Active quick-preset, or null when a custom range (or none) is set. */
  preset:    DateRangePreset | null;
}

export const DEFAULT_FILTERS: OrdersFiltersValue = {
  search:    "",
  status:    "all",
  tableId:   "all",
  waiterId:  "all",
  orderType: "all",
  dateFrom:  "",
  dateTo:    "",
  preset:    null,
};

// ─── Status option values (static) ───────────────────────────────────────────

const STATUS_VALUES: OrderStatusFilter[] = [
  "all", "pending", "preparing", "ready", "served", "cancelled",
];

const ORDER_TYPE_VALUES: OrderType[] = ["all", "dine-in", "takeaway", "delivery"];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface OrdersFiltersProps {
  value:     OrdersFiltersValue;
  onChange:  (patch: Partial<OrdersFiltersValue>) => void;
  onReset?:  () => void;
  loading?:  boolean;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hasActiveFilters(value: OrdersFiltersValue): boolean {
  return (
    value.search    !== "" ||
    value.status    !== "all" ||
    value.tableId   !== "all" ||
    value.waiterId  !== "all" ||
    value.orderType !== "all" ||
    value.dateFrom  !== "" ||
    value.dateTo    !== "" ||
    value.preset    !== null
  );
}

// Maps OrderType enum value → locale key (dine-in → dine_in)
function typeKey(v: OrderType): string {
  return v === "dine-in" ? "dine_in" : v;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OrdersFilters({
  value,
  onChange,
  onReset,
  loading = false,
  className,
}: OrdersFiltersProps) {
  const t  = useTranslations("orders");
  const tc = useTranslations("common.actions");
  const active = hasActiveFilters(value);

  const { data: tables  = [] } = useTablesForFilter();
  const { data: waiters = [] } = useWaitersForFilter();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        loading && "pointer-events-none opacity-60",
        className,
      )}
    >
      {/* Search */}
      <div className="relative min-w-55 flex-1">
        <Search
          size={16}
          className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder={t("filters.searchPlaceholder")}
          aria-label={t("filters.searchPlaceholder")}
          value={value.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="h-9 ps-9 text-sm"
        />
      </div>

      {/* Status */}
      <Select
        value={value.status}
        onValueChange={(v) => onChange({ status: v as OrderStatusFilter })}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder={t("filters.allStatuses")} />
        </SelectTrigger>
        <SelectContent>
          {STATUS_VALUES.map((s) => (
            <SelectItem key={s} value={s}>
              {s === "all" ? t("filters.allStatuses") : t(`status.${s}` as Parameters<typeof t>[0])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Table */}
      <Select
        value={value.tableId}
        onValueChange={(v) => onChange({ tableId: v })}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder={t("filters.allTables")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("filters.allTables")}</SelectItem>
          {tables.map((table) => (
            <SelectItem key={table.id} value={table.id}>
              {t("filters.tableLabel", { number: table.number })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Waiter */}
      <Select
        value={value.waiterId}
        onValueChange={(v) => onChange({ waiterId: v })}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder={t("filters.allWaiters")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("filters.allWaiters")}</SelectItem>
          {waiters.map((w) => (
            <SelectItem key={w.id} value={w.id}>
              {w.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Order Type */}
      <Select
        value={value.orderType}
        onValueChange={(v) => onChange({ orderType: v as OrderType })}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder={t("filters.allTypes")} />
        </SelectTrigger>
        <SelectContent>
          {ORDER_TYPE_VALUES.map((v) => (
            <SelectItem key={v} value={v}>
              {v === "all"
                ? t("filters.allTypes")
                : t(`type.${typeKey(v)}` as Parameters<typeof t>[0])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Range */}
      <DateRangePicker
        activePreset={value.preset}
        onPresetChange={(preset) => {
          const range = presetToDateRange(preset);
          onChange({ preset, dateFrom: range.from, dateTo: range.to });
        }}
        customRange={value.dateFrom && value.dateTo ? { from: value.dateFrom, to: value.dateTo } : null}
        onCustomRangeChange={(range) =>
          onChange({ preset: null, dateFrom: range.from, dateTo: range.to })
        }
        className="h-9"
      />

      {/* Clear all */}
      {active && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 text-sm text-muted-foreground hover:text-destructive"
          onClick={onReset}
        >
          <X size={14} />
          {tc("clear")}
        </Button>
      )}
    </div>
  );
}
