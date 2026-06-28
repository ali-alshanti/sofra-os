"use client";

import { useState } from "react";
import {
  TrendingUp,
  Star,
  AlertTriangle,
  Users,
  type LucideIcon,
} from "lucide-react";
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
  DEFAULT_REPORTS_FILTERS,
  type ReportsFiltersValue,
  type RevenuePoint,
  type CategorySales,
  type Insight,
  type Report,
} from "./types";

// ─── Placeholder Data ─────────────────────────────────────────────────────────

const PLACEHOLDER_STATS: ReportStats = {
  totalRevenue:     "$48,320.00",
  topCategory:      "Mains",
  avgOrderValue:    "$84.50",
  reportsGenerated: 24,
};

const PLACEHOLDER_REVENUE: RevenuePoint[] = [
  { label: "08:00 AM", actual: 1200,  forecast: 1000 },
  { label: "10:00 AM", actual: 2800,  forecast: 2500 },
  { label: "12:00 PM", actual: 6400,  forecast: 5800 },
  { label: "02:00 PM", actual: 5100,  forecast: 5500 },
  { label: "04:00 PM", actual: 4200,  forecast: 4800 },
  { label: "06:00 PM", actual: 7800,  forecast: 7000 },
  { label: "08:00 PM", actual: 9200,  forecast: 8500 },
  { label: "10:00 PM", actual: 6600,  forecast: 7200 },
];

const PLACEHOLDER_CATEGORIES: CategorySales[] = [
  { category: "Mains",     revenue: 12400, percentage: 100 },
  { category: "Beverages", revenue: 8928,  percentage: 72  },
  { category: "Starters",  revenue: 6820,  percentage: 55  },
  { category: "Desserts",  revenue: 4712,  percentage: 38  },
  { category: "Specials",  revenue: 2976,  percentage: 24  },
];

const PLACEHOLDER_INSIGHTS: Array<
  Insight & {
    icon:       LucideIcon;
    iconBg?:    string;
    iconColor?: string;
  }
> = [
  {
    id:       "ins-1",
    headline: "Revenue peaked on Friday evenings",
    body:     "Orders between 7–9 PM on Fridays generate 34% more revenue than the weekly average.",
    icon:     TrendingUp,
    iconBg:   "oklch(0.845 0.143 164.978 / 0.2)",
    iconColor: "oklch(0.362 0.072 165.670)",
    cta:      { label: "View revenue report", href: "#" },
  },
  {
    id:       "ins-2",
    headline: "Mains drive 38% of total sales",
    body:     "Main courses consistently outperform all other categories. Consider expanding the menu.",
    icon:     Star,
    iconBg:   "oklch(0.879 0.169 91.605 / 0.2)",
    iconColor: "#f69f0d",
    cta:      { label: "View category breakdown", href: "#" },
  },
  {
    id:       "ins-3",
    headline: "Dessert sales dropped 12% this month",
    body:     "Dessert orders declined compared to last month. A promotion could help recover volume.",
    icon:     AlertTriangle,
    iconBg:   "oklch(0.577 0.245 27.325 / 0.10)",
    iconColor: "oklch(0.577 0.245 27.325)",
  },
  {
    id:       "ins-4",
    headline: "Returning customers spend 2.4× more",
    body:     "Customers with 5+ visits have an average spend of $204 vs $84 for first-time visitors.",
    icon:     Users,
    iconBg:   "#d5e3fc80",
    iconColor: "#515f74",
    cta:      { label: "View customer report", href: "#" },
  },
];

const PLACEHOLDER_REPORTS: Report[] = [
  {
    id:          "rep-1",
    name:        "Monthly Revenue Summary — Jun 2026",
    type:        "revenue",
    status:      "ready",
    period:      "Jun 2026",
    generatedAt: new Date("2026-06-28T09:00:00"),
    downloadUrl: "#",
  },
  {
    id:          "rep-2",
    name:        "Category Performance — Q2 2026",
    type:        "category",
    status:      "ready",
    period:      "Q2 2026",
    generatedAt: new Date("2026-06-27T14:30:00"),
    downloadUrl: "#",
  },
  {
    id:          "rep-3",
    name:        "Customer Loyalty Report — Jun 2026",
    type:        "customers",
    status:      "generating",
    period:      "Jun 2026",
    generatedAt: new Date("2026-06-28T10:15:00"),
  },
  {
    id:          "rep-4",
    name:        "Employee Attendance — Jun 2026",
    type:        "employees",
    status:      "failed",
    period:      "Jun 2026",
    generatedAt: new Date("2026-06-26T08:00:00"),
  },
  {
    id:          "rep-5",
    name:        "Inventory Audit — May 2026",
    type:        "inventory",
    status:      "ready",
    period:      "May 2026",
    generatedAt: new Date("2026-06-01T11:00:00"),
    downloadUrl: "#",
  },
];

// ─── Reports Feature ──────────────────────────────────────────────────────────

export function ReportsFeature() {
  const [filters, setFilters] = useState<ReportsFiltersValue>(DEFAULT_REPORTS_FILTERS);
  const [currentPage, setCurrentPage]   = useState(1);

  function handleFiltersChange(patch: Partial<ReportsFiltersValue>) {
    setFilters((prev) => ({ ...prev, ...patch }));
    setCurrentPage(1);
  }

  function handleReset() {
    setFilters(DEFAULT_REPORTS_FILTERS);
    setCurrentPage(1);
  }

  return (
    <AppShell>
      <div className="space-y-6">

        {/* 1 — Header */}
        <ReportHeader
          onExport={  () => undefined }
          onRefresh={ () => undefined }
          onSchedule={() => undefined }
        />

        {/* 2 — KPI Summary */}
        <ReportSummary stats={PLACEHOLDER_STATS} />

        {/* 3 — Filters */}
        <ReportsFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleReset}
        />

        {/* 4 — Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RevenueChart  data={PLACEHOLDER_REVENUE}    />
          <CategoryChart data={PLACEHOLDER_CATEGORIES} />
        </div>

        {/* 5 — Insights */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLACEHOLDER_INSIGHTS.map(({ icon, iconBg, iconColor, ...insight }) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              icon={icon}
              iconBg={iconBg}
              iconColor={iconColor}
            />
          ))}
        </div>

        {/* 6 — Reports Table */}
        <ReportsTable
          reports={PLACEHOLDER_REPORTS}
          onView={    (_id) => undefined }
          onDownload={ (_id) => undefined }
          onDelete={  (_id) => undefined }
          pagination={
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(24 / 10)}
              totalItems={24}
              pageSize={10}
              itemLabel="reports"
              onPageChange={setCurrentPage}
            />
          }
        />

      </div>
    </AppShell>
  );
}
