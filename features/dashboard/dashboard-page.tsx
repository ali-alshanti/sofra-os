"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { DateRangePicker, type DateRangePreset } from "@/components/shared/date-range-picker";
import { KpiSection } from "./components/kpi-section";
import { RevenueTrendCard } from "./components/revenue-trend";
import { PopularItemsCard } from "./components/popular-items";
import { InventoryAlertsCard } from "./components/inventory-alerts";

export function DashboardFeature() {
  const t = useTranslations("dashboard");
  const [activePreset, setActivePreset] = useState<DateRangePreset | null>("Today");

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title={t("title")}
          description={t("description")}
          actions={
            <DateRangePicker
              activePreset={activePreset}
              onPresetChange={setActivePreset}
              onCustomClick={() => setActivePreset(null)}
            />
          }
        />

        <KpiSection preset={activePreset ?? "Today"} />
        <RevenueTrendCard preset={activePreset ?? "Today"} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PopularItemsCard />
          <InventoryAlertsCard />
        </div>
      </div>
    </AppShell>
  );
}
