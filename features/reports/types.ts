// ─── Report Type ───────────────────────────────────────────────────────────────

/**
 * The analytical domain a report covers.
 * Drives which chart, table columns, and KPIs are rendered.
 * Strongly typed to prevent string drift across filter controls and row badges.
 */
export type ReportType =
  | "revenue"
  | "category"
  | "customers"
  | "employees"
  | "inventory";

// ─── Report Status ─────────────────────────────────────────────────────────────

/**
 * Lifecycle state of a generated report.
 * "generating" — async job in progress; download unavailable.
 * "ready"      — report is complete and downloadable.
 * "failed"     — generation failed; user can retry.
 */
export type ReportStatus = "generating" | "ready" | "failed";

// ─── Report ────────────────────────────────────────────────────────────────────

/**
 * Core entity representing a saved or in-progress report.
 * downloadUrl is absent while status === "generating" or === "failed".
 */
export interface Report {
  id:           string;
  name:         string;
  type:         ReportType;
  status:       ReportStatus;
  /** Pre-formatted display string — e.g. "Jun 2026" or "Last 30 days" */
  period:       string;
  generatedAt:  Date | string;
  downloadUrl?: string;
}

// ─── Revenue Point ─────────────────────────────────────────────────────────────

/**
 * A single data point on the revenue time-series chart.
 * Kept independent from any chart library — the chart component
 * maps this shape to whatever the library expects at render time.
 * forecast is optional so the same model covers both actuals-only
 * and actuals-vs-forecast views.
 */
export interface RevenuePoint {
  /** X-axis label — e.g. "08:00 AM", "Mon", "Jun" */
  label:     string;
  actual:    number;
  forecast?: number;
}

// ─── Category Sales ────────────────────────────────────────────────────────────

/**
 * Revenue breakdown for a single menu category.
 * percentage is pre-computed (0–100) to decouple the domain
 * from the rendering concern of bar widths or arc angles.
 */
export interface CategorySales {
  /** Menu category name — e.g. "Starters", "Mains", "Beverages" */
  category:   string;
  revenue:    number;
  percentage: number;
}

// ─── Insight ───────────────────────────────────────────────────────────────────

/**
 * A single business insight derived from report data.
 * Named "Insight" (not "InsightCard") because this model describes
 * a piece of domain knowledge, not a UI presentation decision.
 * The InsightCard component is responsible for deciding how to
 * render an Insight — icon choice, layout, color — independently
 * of the data itself.
 */
export interface Insight {
  id:       string;
  headline: string;
  body:     string;
  /** Optional action the user can take in response to this insight */
  cta?: {
    label: string;
    href:  string;
  };
}

// ─── Reports Filter Value ──────────────────────────────────────────────────────

/**
 * Controlled filter state for the Reports feature.
 * Lives in the domain layer — not in the component — because:
 * 1. The page and the filter bar both read from it; it must be
 *    owned at a level above both.
 * 2. It can be serialized to URL search params or passed to an
 *    API query builder without touching React state or JSX.
 * 3. The DEFAULT_REPORTS_FILTERS constant can be imported by tests
 *    without mounting any component.
 */
export interface ReportsFiltersValue {
  reportType: ReportType | "all";
  period:     "today" | "7d" | "30d" | "custom";
  /** Category name or "all" — used to scope category-type reports */
  category:   string;
  /** ISO date string or empty — active only when period === "custom" */
  dateFrom:   string;
  dateTo:     string;
}

export const DEFAULT_REPORTS_FILTERS: ReportsFiltersValue = {
  reportType: "all",
  period:     "30d",
  category:   "all",
  dateFrom:   "",
  dateTo:     "",
};
