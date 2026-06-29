"use client";

import { Package } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChartCard } from "@/components/shared/chart-card";
import { EmptyState } from "@/components/shared/empty-state";
import { InventoryAlertItem } from "./inventory-alert-item";
import { useInventoryAlerts } from "@/lib/hooks/use-dashboard";
import type { InventoryAlertItemData } from "./inventory-alert-item";

function CriticalBadge({ count, label }: { count: number; label: string }) {
  if (count === 0) return null;
  return (
    <span
      className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wide"
      style={{
        background: "oklch(0.577 0.245 27.325 / 0.1)",
        color:      "oklch(0.577 0.245 27.325)",
      }}
    >
      {count} {label}
    </span>
  );
}

export function InventoryAlertsCard() {
  const t   = useTranslations("dashboard.inventory");
  const tc  = useTranslations("common.status");
  const { data, isLoading, error } = useInventoryAlerts();

  const alerts: InventoryAlertItemData[] = (data ?? []).map((alert) => ({
    name:         alert.name,
    amount:       t("unit", { quantity: alert.quantity, unit: alert.unit }),
    reorderPoint: t("reorder", { point: alert.reorderPoint, unit: alert.unit }),
    stockPercent: alert.stockPercent,
    severity:     alert.status === "out_of_stock" ? "critical" : "warning",
  }));

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;

  return (
    <ChartCard
      title={t("title")}
      loading={isLoading}
      actions={<CriticalBadge count={criticalCount} label={t("critical")} />}
    >
      {error ? (
        <p className="typography-small text-muted-foreground py-4 text-center">
          {tc("error")}
        </p>
      ) : alerts.length === 0 ? (
        <EmptyState
          icon={Package}
          title={t("empty")}
          className="border-0 bg-transparent py-8"
        />
      ) : (
        <div className="space-y-6">
          {alerts.map((alert) => (
            <InventoryAlertItem key={alert.name} item={alert} />
          ))}
        </div>
      )}
    </ChartCard>
  );
}
