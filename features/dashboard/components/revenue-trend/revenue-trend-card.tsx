import { ChartCard } from "@/components/shared/chart-card";
import { RevenueChartPlaceholder } from "./revenue-chart-placeholder";

function RevenueLegend() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: "oklch(0.596 0.145 163.225)" }}
        />
        <span className="typography-small text-muted-foreground">Actual</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full opacity-30"
          style={{ background: "oklch(0.554 0.046 257.417)" }}
        />
        <span className="typography-small text-muted-foreground">Forecast</span>
      </div>
    </div>
  );
}

export function RevenueTrendCard() {
  return (
    <ChartCard
      title="Revenue Trends"
      description="Hourly revenue comparison vs. previous week"
      actions={<RevenueLegend />}
    >
      <RevenueChartPlaceholder />
    </ChartCard>
  );
}
