"use client";

import { Search, CalendarDays, X } from "lucide-react";
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

// ─── Types ─────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "all"
  | "pending"
  | "preparing"
  | "ready"
  | "served"
  | "cancelled";

export type OrderType = "all" | "dine-in" | "takeaway" | "delivery";

export interface OrdersFiltersValue {
  search: string;
  status: OrderStatus;
  tableId: string;
  waiterId: string;
  orderType: OrderType;
  dateFrom: string;
  dateTo: string;
}

export const DEFAULT_FILTERS: OrdersFiltersValue = {
  search:    "",
  status:    "all",
  tableId:   "all",
  waiterId:  "all",
  orderType: "all",
  dateFrom:  "",
  dateTo:    "",
};

// ─── Static Options ────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "all",       label: "All Statuses" },
  { value: "pending",   label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "ready",     label: "Ready" },
  { value: "served",    label: "Served" },
  { value: "cancelled", label: "Cancelled" },
];

const ORDER_TYPE_OPTIONS: { value: OrderType; label: string }[] = [
  { value: "all",      label: "All Types" },
  { value: "dine-in",  label: "Dine In" },
  { value: "takeaway", label: "Takeaway" },
  { value: "delivery", label: "Delivery" },
];

// Placeholder options — replaced with real data when API is connected
const TABLE_OPTIONS = [
  { value: "all",  label: "All Tables" },
  { value: "t1",   label: "Table 1" },
  { value: "t2",   label: "Table 2" },
  { value: "t3",   label: "Table 3" },
];

const WAITER_OPTIONS = [
  { value: "all",  label: "All Waiters" },
  { value: "w1",   label: "Alex M." },
  { value: "w2",   label: "Sarah K." },
  { value: "w3",   label: "Omar R." },
];

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface OrdersFiltersProps {
  value: OrdersFiltersValue;
  onChange: (patch: Partial<OrdersFiltersValue>) => void;
  onReset?: () => void;
  loading?: boolean;
  className?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function hasActiveFilters(value: OrdersFiltersValue): boolean {
  return (
    value.search !== "" ||
    value.status !== "all" ||
    value.tableId !== "all" ||
    value.waiterId !== "all" ||
    value.orderType !== "all" ||
    value.dateFrom !== "" ||
    value.dateTo !== ""
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function OrdersFilters({
  value,
  onChange,
  onReset,
  loading = false,
  className,
}: OrdersFiltersProps) {
  const active = hasActiveFilters(value);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        loading && "pointer-events-none opacity-60",
        className,
      )}
    >
      {/* Search */}
      <div className="relative min-w-[220px] flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="Search orders, items, tables…"
          value={value.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="h-9 pl-9 text-sm"
        />
      </div>

      {/* Status */}
      <Select
        value={value.status}
        onValueChange={(v) => onChange({ status: v as OrderStatus })}
      >
        <SelectTrigger className="h-9 w-[160px] text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Table */}
      <Select
        value={value.tableId}
        onValueChange={(v) => onChange({ tableId: v })}
      >
        <SelectTrigger className="h-9 w-[140px] text-sm">
          <SelectValue placeholder="Table" />
        </SelectTrigger>
        <SelectContent>
          {TABLE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Waiter */}
      <Select
        value={value.waiterId}
        onValueChange={(v) => onChange({ waiterId: v })}
      >
        <SelectTrigger className="h-9 w-[150px] text-sm">
          <SelectValue placeholder="Waiter" />
        </SelectTrigger>
        <SelectContent>
          {WAITER_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Order Type */}
      <Select
        value={value.orderType}
        onValueChange={(v) => onChange({ orderType: v as OrderType })}
      >
        <SelectTrigger className="h-9 w-[140px] text-sm">
          <SelectValue placeholder="Order Type" />
        </SelectTrigger>
        <SelectContent>
          {ORDER_TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Range — placeholder trigger, no picker yet */}
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-2 text-sm text-muted-foreground"
      >
        <CalendarDays size={15} />
        {value.dateFrom
          ? `${value.dateFrom}${value.dateTo ? ` → ${value.dateTo}` : ""}`
          : "Date range"}
      </Button>

      {/* Clear all filters */}
      {active && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 text-sm text-muted-foreground hover:text-destructive"
          onClick={onReset}
        >
          <X size={14} />
          Clear
        </Button>
      )}
    </div>
  );
}
