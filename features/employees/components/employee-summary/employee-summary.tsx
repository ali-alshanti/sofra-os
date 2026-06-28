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
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          variant="compact"
          title="Total Employees"
          value={String(stats.totalEmployees)}
          description="Headcount"
        />
        <StatCard
          variant="compact"
          title="On Shift"
          value={String(stats.onShift)}
          valueColor="oklch(0.596 0.145 163.225)"
          pulse
          pulseLabel="Live"
        />
        <StatCard
          variant="compact"
          title="Off Shift"
          value={String(stats.offShift)}
          valueColor="oklch(0.554 0.046 257.417)"
        />
        <StatCard
          variant="compact"
          title="Avg. Attendance"
          value={stats.avgAttendance}
          trend={{ value: "+2.4%", direction: "up" }}
        />
      </div>
    </div>
  );
}
