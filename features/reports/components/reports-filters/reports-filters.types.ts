import type { ReportsFiltersValue, ReportType } from "@/features/reports/types";
import type { DateRangePreset } from "@/components/shared/date-range-picker";

// ─── Static select options ────────────────────────────────────────────────────

export const REPORT_TYPE_OPTIONS: { value: ReportType | "all"; label: string }[] = [
  { value: "all",       label: "All Types"  },
  { value: "revenue",   label: "Revenue"    },
  { value: "category",  label: "Category"   },
  { value: "customers", label: "Customers"  },
  { value: "employees", label: "Employees"  },
  { value: "inventory", label: "Inventory"  },
];

export const PERIOD_OPTIONS: {
  value: ReportsFiltersValue["period"];
  label: string;
}[] = [
  { value: "today", label: "Today"    },
  { value: "7d",    label: "Last 7d"  },
  { value: "30d",   label: "Last 30d" },
  { value: "custom", label: "Custom"  },
];

export const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "all",       label: "All Categories" },
  { value: "Mains",     label: "Mains"          },
  { value: "Starters",  label: "Starters"       },
  { value: "Beverages", label: "Beverages"      },
  { value: "Desserts",  label: "Desserts"       },
  { value: "Specials",  label: "Specials"       },
];

// ─── Preset ↔ period mapping ──────────────────────────────────────────────────

export const PRESET_TO_PERIOD: Record<DateRangePreset, ReportsFiltersValue["period"]> = {
  "Today":    "today",
  "Last 7d":  "7d",
  "Last 30d": "30d",
};

export const PERIOD_TO_PRESET: Partial<Record<ReportsFiltersValue["period"], DateRangePreset>> = {
  today: "Today",
  "7d":  "Last 7d",
  "30d": "Last 30d",
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ReportsFiltersProps {
  filters:          ReportsFiltersValue;
  onFiltersChange?: (patch: Partial<ReportsFiltersValue>) => void;
  onReset?:         () => void;
  disabled?:        boolean;
  className?:       string;
}
