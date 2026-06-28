import { Package, TriangleAlert, PackageX, DollarSign } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";

export interface InventoryStats {
  totalItems:     number;
  lowStockItems:  number;
  outOfStockItems: number;
  totalValue:     string; // pre-formatted, e.g. "$18,450.00"
}

interface InventorySummaryProps {
  stats: InventoryStats;
}

export function InventorySummary({ stats }: InventorySummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Items"
        value={String(stats.totalItems)}
        icon={Package}
        iconBg="#d5e3fc"
        iconColor="#003527"
        trend={{ value: "+2.4%", direction: "up" }}
      />
      <StatCard
        title="Low Stock Items"
        value={String(stats.lowStockItems)}
        icon={TriangleAlert}
        iconBg="oklch(0.962 0.059 95.617 / 0.3)"
        iconColor="#f69f0d"
        badge="Warning"
      />
      <StatCard
        title="Out of Stock"
        value={String(stats.outOfStockItems)}
        icon={PackageX}
        iconBg="oklch(0.577 0.245 27.325 / 0.12)"
        iconColor="oklch(0.577 0.245 27.325)"
        trend={{ value: "", direction: "down" }}
        description="critical"
      />
      <StatCard
        title="Total Value"
        value={stats.totalValue}
        icon={DollarSign}
        iconBg="#b0f0d6"
        iconColor="#003527"
      />
    </div>
  );
}
