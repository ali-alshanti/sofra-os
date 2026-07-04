import { AlertTriangle, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";

export type AlertSeverity = "critical" | "warning";

export interface InventoryAlertItemData {
  id: string;
  name: string;
  amount: string;
  reorderPoint: string;
  stockPercent: number;
  severity: AlertSeverity;
}

interface InventoryAlertItemProps {
  item: InventoryAlertItemData;
}

const SEVERITY_STYLE: Record<AlertSeverity, { color: string; Icon: React.ElementType }> = {
  critical: {
    color: "oklch(0.577 0.245 27.325)",   /* red-600 / destructive */
    Icon: AlertTriangle,
  },
  warning: {
    color: "#f69f0d",                      /* amber — from Stitch design */
    Icon: AlertCircle,
  },
};

export function InventoryAlertItem({ item }: InventoryAlertItemProps) {
  const t = useTranslations("dashboard.inventory");
  const { color, Icon } = SEVERITY_STYLE[item.severity];

  return (
    <div className="space-y-2">
      {/* Alert header */}
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Icon size={18} style={{ color }} className="shrink-0" />
          <p className="typography-small font-bold text-foreground truncate">{item.name}</p>
        </div>
        <span
          className="typography-small font-bold shrink-0"
          style={{ color }}
        >
          {item.amount}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full overflow-hidden bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${item.stockPercent}%`, background: color }}
        />
      </div>

      {/* Footer — reorder point + action */}
      <div className="flex justify-between items-center">
        <p className="typography-caption text-muted-foreground">{item.reorderPoint}</p>
        <Button variant="outline" size="sm" className="text-xs h-7 px-3" asChild>
          <Link href={{ pathname: "/inventory", query: { search: item.name } }}>
            {t("orderNow")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
