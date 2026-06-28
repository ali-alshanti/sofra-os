import { Package, TriangleAlert, PackageX, DollarSign } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";

export interface InventoryStats {
  totalItems:      number;
  lowStockItems:   number;
  outOfStockItems: number;
  totalValue:      string;
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
        iconBg="#d5e3fc80"
        iconColor="#003527"
        badge="+2.4%"
        badgeStyle={{ bg: "#b0f0d6", color: "#003527" }}
      />
      <StatCard
        title="Low Stock Items"
        value={String(stats.lowStockItems)}
        icon={TriangleAlert}
        iconBg="#ffddb84d"
        iconColor="#f69f0d"
        badge="Warning"
        badgeStyle={{ bg: "#ffddb8", color: "#653e00" }}
      />
      <StatCard
        title="Out of Stock"
        value={String(stats.outOfStockItems)}
        icon={PackageX}
        iconBg="oklch(0.577 0.245 27.325 / 0.12)"
        iconColor="oklch(0.577 0.245 27.325)"
        badge="Critical"
        badgeStyle={{
          bg:    "oklch(0.577 0.245 27.325 / 0.15)",
          color: "oklch(0.577 0.245 27.325)",
        }}
      />
      <StatCard
        title="Inventory Value"
        value={stats.totalValue}
        icon={DollarSign}
        iconBg="#b0f0d666"
        iconColor="#003527"
        badge="Value"
        badgeStyle={{ bg: "#b0f0d6", color: "#003527" }}
      />
    </div>
  );
}
