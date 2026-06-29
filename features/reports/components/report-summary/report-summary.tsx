import { DollarSign, Tag, ShoppingBag, FileBarChart2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { StatCard } from "@/components/shared/stat-card";

// ─── Stats shape ──────────────────────────────────────────────────────────────

export interface ReportStats {
  /** Pre-formatted — e.g. "$48,320.00" */
  totalRevenue:      string;
  /** Category name — e.g. "Mains" */
  topCategory:       string;
  /** Pre-formatted — e.g. "$84.50" */
  avgOrderValue:     string;
  reportsGenerated:  number;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReportSummaryProps {
  stats: ReportStats;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReportSummary({ stats }: ReportSummaryProps) {
  const t = useTranslations("reports.summary");

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t("revenue")}
        value={stats.totalRevenue}
        icon={DollarSign}
        iconBg="oklch(0.845 0.143 164.978 / 0.2)"
        iconColor="oklch(0.362 0.072 165.670)"
        trend={{ value: "+12%", direction: "up" }}
      />
      <StatCard
        title={t("category")}
        value={stats.topCategory}
        icon={Tag}
        iconBg="oklch(0.879 0.169 91.605 / 0.2)"
        iconColor="#f69f0d"
        badge={t("best")}
        badgeStyle={{ bg: "#ffddb8", color: "#653e00" }}
      />
      <StatCard
        title={t("avgOrder")}
        value={stats.avgOrderValue}
        icon={ShoppingBag}
        iconBg="#d5e3fc80"
        iconColor="#515f74"
        badge={t("avg")}
        badgeStyle={{ bg: "#d5e3fc80", color: "#515f74" }}
      />
      <StatCard
        title={t("generated")}
        value={String(stats.reportsGenerated)}
        icon={FileBarChart2}
        iconBg="oklch(0.596 0.145 163.225 / 0.08)"
        iconColor="oklch(0.596 0.145 163.225)"
        trend={{ value: "+3", direction: "up" }}
      />
    </div>
  );
}
