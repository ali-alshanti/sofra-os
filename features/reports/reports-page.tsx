"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  Star,
  AlertTriangle,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { AppShell } from "@/components/layout/app-shell";
import { Pagination } from "@/components/shared/pagination";
import { ReportHeader } from "./components/report-header";
import { ReportSummary, type ReportStats } from "./components/report-summary";
import { ReportsFilters } from "./components/reports-filters";
import { RevenueChart } from "./components/revenue-chart";
import { CategoryChart } from "./components/category-chart";
import { InsightCard } from "./components/insight-card";
import { ReportsTable } from "./components/reports-table";
import {
  useDashboardReports,
  useRevenueReport,
  useCategorySalesReport,
  useGeneratedReports,
  useRefreshReports,
  useCustomerAnalytics,
} from "@/lib/hooks/use-reports";
import {
  DEFAULT_REPORTS_FILTERS,
  type ReportsFiltersValue,
  type Insight,
} from "./types";
import type { DateRangePreset } from "@/components/shared/date-range-picker";
import type { DashboardReportStats, CustomerAnalytics } from "@/services/reports";

// ─── Preset ↔ period mapping ─────────────────────────────────────────────────

const PRESET_TO_PERIOD: Record<DateRangePreset, ReportsFiltersValue["period"]> = {
  "Today":    "today",
  "Last 7d":  "7d",
  "Last 30d": "30d",
};

// ─── Fallback stats ───────────────────────────────────────────────────────────

const EMPTY_STATS: ReportStats = {
  totalRevenue:     "—",
  topCategory:      "—",
  avgOrderValue:    "—",
  reportsGenerated: 0,
};

const PAGE_SIZE = 10;

// ─── Derive insights from real data ──────────────────────────────────────────

type InsightWithIcon = Insight & {
  icon:       LucideIcon;
  iconBg?:    string;
  iconColor?: string;
};

function buildInsights(
  dashboard: DashboardReportStats | undefined,
  customers: CustomerAnalytics   | undefined,
): InsightWithIcon[] {
  const insights: InsightWithIcon[] = [];

  if (dashboard?.topCategory && dashboard.topCategory !== "—") {
    insights.push({
      id:        "ins-category",
      headline:  `${dashboard.topCategory} is your top-earning category`,
      body:      `Revenue from ${dashboard.topCategory} leads all other categories.`,
      icon:      Star,
      iconBg:    "oklch(0.879 0.169 91.605 / 0.2)",
      iconColor: "#f69f0d",
    });
  }

  if (customers?.returningRate && customers.returningRate > 0) {
    insights.push({
      id:        "ins-returning",
      headline:  `${customers.returningRate}% of customers are returning`,
      body:      `Returning customers represent a strong loyalty signal.`,
      icon:      TrendingUp,
      iconBg:    "oklch(0.845 0.143 164.978 / 0.2)",
      iconColor: "oklch(0.362 0.072 165.670)",
    });
  }

  if (customers?.vipCustomers && customers.vipCustomers > 0) {
    insights.push({
      id:        "ins-vip",
      headline:  `${customers.vipCustomers} VIP customer${customers.vipCustomers > 1 ? "s" : ""} on record`,
      body:      `VIP customers spend significantly more per visit.`,
      icon:      Users,
      iconBg:    "#d5e3fc80",
      iconColor: "#515f74",
    });
  }

  if (insights.length < 2) {
    insights.push({
      id:        "ins-avg",
      headline:  `Average order value: ${dashboard?.avgOrderValue ?? "—"}`,
      body:      "Track how your average order value changes over time.",
      icon:      AlertTriangle,
      iconBg:    "oklch(0.577 0.245 27.325 / 0.10)",
      iconColor: "oklch(0.577 0.245 27.325)",
    });
  }

  return insights;
}

// ─── Reports Feature ──────────────────────────────────────────────────────────

export function ReportsFeature() {
  const t = useTranslations("reports");

  // ── Header date picker state (single source of truth) ────────────────────────
  const [activePreset, setActivePreset] = useState<DateRangePreset | null>("Last 30d");

  // ── Filter state (includes period synced from header picker) ─────────────────
  const [filters, setFilters]           = useState<ReportsFiltersValue>(DEFAULT_REPORTS_FILTERS);
  const [currentPage, setCurrentPage]   = useState(1);

  const refreshAll = useRefreshReports();

  // Stable reference so memo/key computations don't re-create on every render
  const dateFilters = useMemo(() => ({
    period:   filters.period,
    dateFrom: filters.dateFrom,
    dateTo:   filters.dateTo,
  }), [filters.period, filters.dateFrom, filters.dateTo]);

  const { data: dashboardData } = useDashboardReports(dateFilters);
  const { data: revenueData,  isLoading: revenueLoading } = useRevenueReport(dateFilters);
  const { data: categoryData, isLoading: catLoading     } = useCategorySalesReport(dateFilters);
  const { data: customerData }                            = useCustomerAnalytics();
  const { data: generatedData, isLoading: reportsLoading } = useGeneratedReports(
    { reportType: filters.reportType, search: filters.search },
    currentPage,
    PAGE_SIZE,
  );

  const stats    = dashboardData ?? EMPTY_STATS;
  const insights = buildInsights(dashboardData, customerData);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function handlePresetChange(preset: DateRangePreset) {
    setActivePreset(preset);
    setFilters((prev) => ({
      ...prev,
      period:   PRESET_TO_PERIOD[preset],
      dateFrom: "",
      dateTo:   "",
    }));
    setCurrentPage(1);
  }

  function handleCustomClick() {
    setActivePreset(null);
    setFilters((prev) => ({ ...prev, period: "custom" }));
  }

  function handleFiltersChange(patch: Partial<ReportsFiltersValue>) {
    // If the filter bar updates the period, sync the header picker too
    if (patch.period && patch.period !== "custom") {
      const matchingPreset = Object.entries(PRESET_TO_PERIOD).find(([, p]) => p === patch.period)?.[0];
      setActivePreset((matchingPreset as DateRangePreset | undefined) ?? null);
    }
    setFilters((prev) => ({ ...prev, ...patch }));
    setCurrentPage(1);
  }

  function handleReset() {
    setFilters(DEFAULT_REPORTS_FILTERS);
    setActivePreset("Last 30d");
    setCurrentPage(1);
  }

  return (
    <AppShell>
      <div className="space-y-6">

        {/* 1 — Header (with connected DateRangePicker) */}
        <ReportHeader
          activePreset={activePreset}
          onPresetChange={handlePresetChange}
          onCustomClick={handleCustomClick}
          onExport={  () => undefined }
          onRefresh={ refreshAll }
          onSchedule={() => undefined }
        />

        {/* 2 — KPI Summary */}
        <ReportSummary stats={stats} />

        {/* 3 — Filters */}
        <ReportsFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleReset}
        />

        {/* 4 — Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RevenueChart
            data={revenueData ?? []}
            loading={revenueLoading}
            empty={!revenueLoading && (revenueData ?? []).length === 0}
          />
          <CategoryChart
            data={categoryData ?? []}
            loading={catLoading}
            empty={!catLoading && (categoryData ?? []).length === 0}
          />
        </div>

        {/* 5 — Insights */}
        {insights.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {insights.map(({ icon, iconBg, iconColor, ...insight }) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                icon={icon}
                iconBg={iconBg}
                iconColor={iconColor}
              />
            ))}
          </div>
        )}

        {/* 6 — Reports Table */}
        <ReportsTable
          reports={generatedData?.reports ?? []}
          loading={reportsLoading}
          onView={    () => undefined }
          onDownload={ () => undefined }
          onDelete={  () => undefined }
          pagination={
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil((generatedData?.total ?? 0) / PAGE_SIZE)}
              totalItems={generatedData?.total ?? 0}
              pageSize={PAGE_SIZE}
              itemLabel={t("title").toLowerCase()}
              onPageChange={setCurrentPage}
            />
          }
        />

      </div>
    </AppShell>
  );
}
