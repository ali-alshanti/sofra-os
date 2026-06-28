"use client";

import { CreditCard, ShoppingBag, Table2, Gauge } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { useDashboardSummary } from "@/lib/hooks/use-dashboard";
import { formatCurrency } from "@/lib/utils/format-currency";

export function KpiSection() {
  const { data, isLoading } = useDashboardSummary();

  const revenueChange = data?.revenueChangePercent != null
    ? { value: `${data.revenueChangePercent > 0 ? "+" : ""}${data.revenueChangePercent}%`, direction: data.revenueChangePercent >= 0 ? "up" as const : "down" as const }
    : undefined;

  const ordersChange = data?.ordersChangePercent != null
    ? { value: `${data.ordersChangePercent > 0 ? "+" : ""}${data.ordersChangePercent}%`, direction: data.ordersChangePercent >= 0 ? "up" as const : "down" as const }
    : undefined;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        loading={isLoading}
        title="Revenue"
        value={data ? formatCurrency(data.revenueToday) : "$0.00"}
        icon={CreditCard}
        iconBg="#b0f0d6"
        iconColor="#003527"
        trend={revenueChange}
      />
      <StatCard
        loading={isLoading}
        title="Orders Today"
        value={data ? String(data.ordersToday) : "0"}
        icon={ShoppingBag}
        iconBg="#d5e3fc"
        iconColor="#515f74"
        trend={ordersChange}
        description="vs yesterday"
      />
      <StatCard
        loading={isLoading}
        title="Active Tables"
        value={data ? `${data.activeTablesCount}/${data.totalTablesCount}` : "0/0"}
        icon={Table2}
        iconBg="#ffddb8"
        iconColor="#442800"
        badge={data ? `${data.occupancyPercent}% Occ.` : undefined}
      />
      <StatCard
        loading={isLoading}
        title="Kitchen Load"
        value={data ? (data.kitchenStatus === "optimal" ? "Optimal" : data.kitchenStatus === "moderate" ? "Moderate" : "Busy") : "—"}
        icon={Gauge}
        iconBg="#064e3b"
        iconColor="#80bea6"
        pulse={data?.kitchenStatus === "optimal"}
        pulseLabel={data?.kitchenStatus === "optimal" ? "Normal" : undefined}
        badge={data?.kitchenStatus !== "optimal" ? (data?.kitchenStatus === "busy" ? "High" : "Moderate") : undefined}
      />
    </div>
  );
}
