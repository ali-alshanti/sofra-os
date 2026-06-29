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

// ─── Static options (status + type are static enums) ─────────────────────────

const STATUS_OPTIONS: { value: OrderStatusFilter; label: string }[] = [
  { value: "all",       label: "All Statuses" },
  { value: "pending",   label: "Pending"      },
  { value: "preparing", label: "Preparing"    },
  { value: "ready",     label: "Ready"        },
  { value: "served",    label: "Served"       },
  { value: "cancelled", label: "Cancelled"    },
];

const ORDER_TYPE_OPTIONS: { value: OrderType; label: string }[] = [
  { value: "all",      label: "All Types" },
  { value: "dine-in",  label: "Dine In"   },
  { value: "takeaway", label: "Takeaway"  },
  { value: "delivery", label: "Delivery"  },
];

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
    value.dateTo    !== ""
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OrdersFilters({
  value,
  onChange,
  onReset,
  loading = false,
  className,
}: OrdersFiltersProps) {
  const active = hasActiveFilters(value);

  // Real DB data for table and waiter dropdowns
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
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="Search orders…"
          aria-label="Search orders"
          value={value.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="h-9 pl-9 text-sm"
        />
      </div>

      {/* Status */}
      <Select
        value={value.status}
        onValueChange={(v) => onChange({ status: v as OrderStatusFilter })}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
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

      {/* Table — real data from DB */}
      <Select
        value={value.tableId}
        onValueChange={(v) => onChange({ tableId: v })}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder="All Tables" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tables</SelectItem>
          {tables.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              Table {t.number}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Waiter — real data from DB */}
      <Select
        value={value.waiterId}
        onValueChange={(v) => onChange({ waiterId: v })}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder="All Waiters" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Waiters</SelectItem>
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

      {/* Date Range display */}
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

      {/* Clear all */}
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
