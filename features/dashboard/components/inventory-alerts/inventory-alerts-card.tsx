import { ChartCard } from "@/components/shared/chart-card";
import { InventoryAlertItem, type InventoryAlertItemData } from "./inventory-alert-item";

const ALERTS: InventoryAlertItemData[] = [
  {
    name: "Truffle Oil (Signature)",
    amount: "1.2L left",
    reorderPoint: "Reorder point: 5.0L",
    stockPercent: 15,
    severity: "critical",
  },
  {
    name: "Atlantic Salmon",
    amount: "4.5kg left",
    reorderPoint: "Reorder point: 12.0kg",
    stockPercent: 32,
    severity: "warning",
  },
  {
    name: "Champagne Vintage",
    amount: "8 bottles left",
    reorderPoint: "Reorder point: 24 bottles",
    stockPercent: 40,
    severity: "warning",
  },
];

const criticalCount = ALERTS.filter((a) => a.severity === "critical").length;

function CriticalBadge({ count }: { count: number }) {
  return (
    <span
      className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wide"
      style={{
        background: "oklch(0.577 0.245 27.325 / 0.1)",
        color: "oklch(0.577 0.245 27.325)",
      }}
    >
      {count} CRITICAL
    </span>
  );
}

export function InventoryAlertsCard() {
  return (
    <ChartCard
      title="Inventory Alerts"
      actions={<CriticalBadge count={criticalCount} />}
    >
      <div className="space-y-6">
        {ALERTS.map((alert) => (
          <InventoryAlertItem key={alert.name} item={alert} />
        ))}
      </div>
    </ChartCard>
  );
}
