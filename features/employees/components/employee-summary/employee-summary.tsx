import { useTranslations } from "next-intl";
import { StatCard } from "@/components/shared/stat-card";

export interface EmployeeStats {
  totalEmployees: number;
  onShift:        number;
  offShift:       number;
  avgAttendance:  string; // e.g. "94%"
}

interface EmployeeSummaryProps {
  stats: EmployeeStats;
}

export function EmployeeSummary({ stats }: EmployeeSummaryProps) {
  const t = useTranslations("employees.summary");

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          variant="compact"
          title={t("total")}
          value={String(stats.totalEmployees)}
        />
        <StatCard
          variant="compact"
          title={t("onShift")}
          value={String(stats.onShift)}
          valueColor="oklch(0.596 0.145 163.225)"
          pulse
          pulseLabel="Live"
        />
        <StatCard
          variant="compact"
          title={t("offShift")}
          value={String(stats.offShift)}
          valueColor="oklch(0.554 0.046 257.417)"
        />
        <StatCard
          variant="compact"
          title={t("attendance")}
          value={stats.avgAttendance}
          trend={{ value: "+2.4%", direction: "up" }}
        />
    </div>
  );
}
