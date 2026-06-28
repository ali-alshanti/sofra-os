"use client";

import { Search, X } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { ReportsFiltersValue, ReportType } from "@/features/reports/types";
import { DEFAULT_REPORTS_FILTERS } from "@/features/reports/types";
import {
  REPORT_TYPE_OPTIONS,
  CATEGORY_OPTIONS,
  PRESET_TO_PERIOD,
  PERIOD_TO_PRESET,
  type ReportsFiltersProps,
} from "./reports-filters.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hasActiveFilters(f: ReportsFiltersValue): boolean {
  return (
    f.reportType !== DEFAULT_REPORTS_FILTERS.reportType ||
    f.period     !== DEFAULT_REPORTS_FILTERS.period     ||
    f.category   !== DEFAULT_REPORTS_FILTERS.category   ||
    f.dateFrom   !== ""                                  ||
    f.dateTo     !== ""
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReportsFilters({
  filters,
  onFiltersChange,
  onReset,
  disabled = false,
  className,
}: ReportsFiltersProps) {
  const active = hasActiveFilters(filters);

  // Map ReportsFiltersValue.period → DateRangePreset (null when "custom")
  const activePreset: DateRangePreset | null =
    PERIOD_TO_PRESET[filters.period] ?? null;

  // Custom label shows the selected date range when period === "custom"
  const customLabel =
    filters.dateFrom
      ? filters.dateTo
        ? `${filters.dateFrom} → ${filters.dateTo}`
        : filters.dateFrom
      : undefined;

  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-4",
        "flex flex-wrap items-center gap-3",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      {/* Search — visual only; wire to a search field when the domain model gains one */}
      <div className="relative flex-1 min-w-65">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="Search reports..."
          aria-label="Search reports"
          className="pl-9 h-10 bg-background text-sm"
          disabled={disabled}
        />
      </div>

      {/* Report Type */}
      <Select
        value={filters.reportType}
        onValueChange={(v) =>
          onFiltersChange?.({ reportType: v as ReportType | "all" })
        }
        disabled={disabled}
      >
        <SelectTrigger className="h-10 w-44 bg-background text-sm">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          {REPORT_TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Category */}
      <Select
        value={filters.category}
        onValueChange={(v) => onFiltersChange?.({ category: v })}
        disabled={disabled}
      >
        <SelectTrigger className="h-10 w-44 bg-background text-sm">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORY_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Range Picker */}
      <DateRangePicker
        activePreset={activePreset}
        onPresetChange={(preset) =>
          onFiltersChange?.({
            period:   PRESET_TO_PERIOD[preset],
            dateFrom: "",
            dateTo:   "",
          })
        }
        onCustomClick={() =>
          onFiltersChange?.({ period: "custom" })
        }
        customLabel={customLabel}
      />

      {/* Clear */}
      {active && (
        <Button
          variant="ghost"
          size="sm"
          className="h-10 gap-1.5 text-sm text-muted-foreground hover:text-destructive"
          onClick={onReset}
          disabled={disabled}
        >
          <X size={14} />
          Clear
        </Button>
      )}
    </div>
  );
}
