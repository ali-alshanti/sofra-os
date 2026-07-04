import type { ReportsFiltersValue, ReportType } from "@/features/reports/types";
import type { DateRangePreset } from "@/components/shared/date-range-picker";

// ─── Static select options ────────────────────────────────────────────────────

export const REPORT_TYPE_OPTIONS: { value: ReportType | "all"; labelKey: string }[] = [
  { value: "all",       labelKey: "filters.allTypes" },
  { value: "revenue",   labelKey: "type.revenue"     },
  { value: "category",  labelKey: "type.category"    },
  { value: "customers", labelKey: "type.customers"   },
  { value: "employees", labelKey: "type.employees"   },
  { value: "inventory", labelKey: "type.inventory"   },
];

export const PERIOD_OPTIONS: {
  value: ReportsFiltersValue["period"];
  labelKey: string;
}[] = [
  { value: "today",  labelKey: "filters.today"  },
  { value: "7d",     labelKey: "filters.last7"  },
  { value: "30d",    labelKey: "filters.last30" },
  { value: "custom", labelKey: "filters.custom" },
];

export const CATEGORY_OPTIONS: { value: string; labelKey: string }[] = [
  { value: "all",       labelKey: "filters.allCategories" },
  { value: "Mains",     labelKey: "categories.mains"       },
  { value: "Starters",  labelKey: "categories.starters"    },
  { value: "Beverages", labelKey: "categories.beverages"   },
  { value: "Desserts",  labelKey: "categories.desserts"    },
  { value: "Specials",  labelKey: "categories.specials"    },
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
