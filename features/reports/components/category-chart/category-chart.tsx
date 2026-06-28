import { ChartCard } from "@/components/shared/chart-card";
import type { CategorySales } from "@/features/reports/types";
import { CategoryChartPlaceholder } from "./category-chart-placeholder";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CategoryChartProps {
  data:     CategorySales[];
  loading?: boolean;
  empty?:   boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CategoryChart({ data: _data, loading, empty }: CategoryChartProps) {
  return (
    <ChartCard
      title="Revenue by Category"
      description="Contribution of each menu category to total revenue"
      loading={loading}
      empty={empty}
      emptyMessage="No category data for the selected period."
    >
      {/*
        Replace <CategoryChartPlaceholder /> with a real chart that consumes
        the `data` prop when a chart library is introduced. The public API
        of this component — data, loading, empty — stays unchanged.
      */}
      <CategoryChartPlaceholder />
    </ChartCard>
  );
}
