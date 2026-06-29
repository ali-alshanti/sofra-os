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
  CustomerFiltersValue,
  CustomerSegment,
  CustomerLoyaltyFilter,
  CustomerStatus,
} from "@/features/customers/types";

// ─── Static option values ─────────────────────────────────────────────────────

const SEGMENT_VALUES: (CustomerSegment | "all")[] = ["all", "regular", "vip"];
const LOYALTY_VALUES: CustomerLoyaltyFilter[]     = ["all", "platinum", "gold", "silver", "bronze"];
const STATUS_VALUES:  (CustomerStatus | "all")[]  = ["all", "active", "vip", "inactive"];

// ─── Props ─────────────────────────────────────────────────────────────────────

interface CustomerFiltersProps {
  value: CustomerFiltersValue;
  onSearchChange?:  (search: string) => void;
  onSegmentChange?: (segment: CustomerSegment) => void;
  onLoyaltyChange?: (loyalty: CustomerLoyaltyFilter) => void;
  onStatusChange?:  (status: CustomerStatus | "all") => void;
  disabled?: boolean;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function CustomerFilters({
  value,
  onSearchChange,
  onSegmentChange,
  onLoyaltyChange,
  onStatusChange,
  disabled = false,
  className,
}: CustomerFiltersProps) {
  const t = useTranslations("customers");

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-xl border border-border/20 bg-muted/40 p-4",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      {/* Search */}
      <div className="relative min-w-[260px] flex-1">
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

      {/* Segment */}
      <Select
        value={value.segment}
        onValueChange={(v) => onSegmentChange?.(v as CustomerSegment)}
        disabled={disabled}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder={t("filters.allSegments")} />
        </SelectTrigger>
        <SelectContent>
          {SEGMENT_VALUES.map((s) => (
            <SelectItem key={s} value={s}>
              {s === "all"
                ? t("filters.allSegments")
                : t(`segment.${s}` as Parameters<typeof t>[0])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Loyalty */}
      <Select
        value={value.loyalty}
        onValueChange={(v) => onLoyaltyChange?.(v as CustomerLoyaltyFilter)}
        disabled={disabled}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder={t("filters.allLoyalty")} />
        </SelectTrigger>
        <SelectContent>
          {LOYALTY_VALUES.map((l) => (
            <SelectItem key={l} value={l}>
              {l === "all"
                ? t("filters.allLoyalty")
                : t(`loyalty.${l}` as Parameters<typeof t>[0])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status */}
      <Select
        value={value.status}
        onValueChange={(v) => onStatusChange?.(v as CustomerStatus | "all")}
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
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0"
        disabled={disabled}
        aria-label={t("filters.status")}
      >
        <SlidersHorizontal size={16} />
      </Button>
    </div>
  );
}
