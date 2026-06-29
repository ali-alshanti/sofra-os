"use client";

import { useTranslations } from "next-intl";
import { ChartCard } from "@/components/shared/chart-card";
import type { RevenuePoint } from "@/features/reports/types";
import { RevenueChartPlaceholder } from "./revenue-chart-placeholder";

// ─── Props ────────────────────────────────────────────────────────────────────

interface RevenueChartProps {
  /** Chart data — consumed once a chart library is introduced */
  data:     RevenuePoint[];
  loading?: boolean;
  empty?:   boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RevenueChart({ loading, empty }: RevenueChartProps) {
  const t = useTranslations("reports.revenue");

  return (
    <ChartCard
      title={t("title")}
      description={t("description")}
      loading={loading}
      empty={empty}
      emptyMessage={t("empty")}
    >
      {/* Replace with a real chart consuming the `data` prop when a chart library is added */}
      <RevenueChartPlaceholder />
    </ChartCard>
  );
}
