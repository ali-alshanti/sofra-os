"use client";

import { ChartCard } from "@/components/shared/chart-card";
import { useRevenueAnalytics } from "@/lib/hooks/use-dashboard";
import { RevenueChartPlaceholder } from "./revenue-chart-placeholder";
import type { RevenueDataPoint } from "@/types/dashboard";

function RevenueLegend() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full" style={{ background: "oklch(0.596 0.145 163.225)" }} />
        <span className="typography-small text-muted-foreground">Actual</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full opacity-30" style={{ background: "oklch(0.554 0.046 257.417)" }} />
        <span className="typography-small text-muted-foreground">Forecast</span>
      </div>
    </div>
  );
}

function LiveRevenueChart({ data }: { data: RevenueDataPoint[] }) {
  if (data.length === 0) return <RevenueChartPlaceholder />;

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div>
      <div className="relative h-64 flex items-end gap-1">
        {data.map((point, i) => {
          const heightPct = Math.max(4, Math.round((point.revenue / maxRevenue) * 100));
          return (
            <div
              key={i}
              title={`${point.label}: $${point.revenue.toFixed(2)}`}
              className={`flex-1 rounded-t-sm transition-all ${point.isPrimary ? "bg-primary opacity-90" : "bg-border"}`}
              style={{ height: `${heightPct}%` }}
            />
          );
        })}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {["", "", "", "", ""].map((_, i) => (
            <div key={i} className="w-full border-t border-border/30" />
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-3 px-1">
        {[data[0], data[Math.floor(data.length / 4)], data[Math.floor(data.length / 2)], data[Math.floor(data.length * 3 / 4)], data[data.length - 1]]
          .filter(Boolean)
          .map((p) => (
            <span key={p.label} className="typography-caption text-muted-foreground">
              {p.label}
            </span>
          ))}
      </div>
    </div>
  );
}

export function RevenueTrendCard() {
  const { data, isLoading } = useRevenueAnalytics();

  return (
    <ChartCard
      title="Revenue Trends"
      description="Hourly revenue for today"
      loading={isLoading}
      actions={<RevenueLegend />}
    >
      <LiveRevenueChart data={data ?? []} />
    </ChartCard>
  );
}
