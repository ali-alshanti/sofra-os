import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { TableStatus } from "../table-card/table-card.types";

export interface LegendItem {
  key: TableStatus;
  color: string;
}

export const DEFAULT_TABLE_LEGEND: LegendItem[] = [
  { key: "available",      color: "#d5e3fc" },
  { key: "occupied",       color: "#2b6954" },
  { key: "reserved",       color: "#ffb95f" },
  { key: "cleaning",       color: "oklch(0.929 0.013 255.508)" },
  { key: "out_of_service", color: "oklch(0.577 0.245 27.325)" },
];

interface StatusLegendProps {
  statuses?: LegendItem[];
  className?: string;
}

export function StatusLegend({
  statuses = DEFAULT_TABLE_LEGEND,
  className,
}: StatusLegendProps) {
  const t = useTranslations("tables.status");

  return (
    <div className={cn("flex flex-wrap items-center gap-6", className)}>
      {statuses.map((item) => (
        <div key={item.key} className="flex items-center gap-2">
          <span
            className="block h-3 w-3 rounded-full shrink-0"
            style={{ background: item.color }}
            aria-hidden="true"
          />
          <span className="typography-small text-muted-foreground">{t(item.key)}</span>
        </div>
      ))}
    </div>
  );
}
