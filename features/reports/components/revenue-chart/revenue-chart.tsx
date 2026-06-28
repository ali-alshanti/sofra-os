import { ChartCard } from "@/components/shared/chart-card";
import type { RevenuePoint } from "@/features/reports/types";
import { RevenueChartPlaceholder } from "./revenue-chart-placeholder";

// ─── Props ────────────────────────────────────────────────────────────────────

interface RevenueChartProps {
  data:      RevenuePoint[];
  loading?:  boolean;
  empty?:    boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RevenueChart({ data: _data, loading, empty }: RevenueChartProps) {
  return (
    <ChartCard
      title="Revenue Overview"
      description="Actual vs. forecast revenue over the selected period"
      loading={loading}
      empty={empty}
      emptyMessage="No revenue data for the selected period."
    >
      {/*
        Replace <RevenueChartPlaceholder /> with a real chart that consumes
        the `data` prop when a chart library is introduced. The public API
        of this component — data, loading, empty — stays unchanged.
      */}
      <RevenueChartPlaceholder />
    </ChartCard>
  );
}
