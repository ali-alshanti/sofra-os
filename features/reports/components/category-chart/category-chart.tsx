"use client";

import { useTranslations } from "next-intl";
import { ChartCard } from "@/components/shared/chart-card";
import type { CategorySales } from "@/features/reports/types";
import { CategoryChartPlaceholder } from "./category-chart-placeholder";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CategoryChartProps {
  /** Chart data — consumed once a chart library is introduced */
  data:     CategorySales[];
  loading?: boolean;
  empty?:   boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CategoryChart({ loading, empty }: CategoryChartProps) {
  const t = useTranslations("reports.categoryChart");

  return (
    <ChartCard
      title={t("title")}
      description={t("description")}
      loading={loading}
      empty={empty}
      emptyMessage={t("empty")}
    >
      {/* Replace with a real chart consuming the `data` prop when a chart library is added */}
      <CategoryChartPlaceholder />
    </ChartCard>
  );
}
