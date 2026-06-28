import { cn } from "@/lib/utils";

export interface LegendItem {
  key: string;
  label: string;
  color: string;
}

export const DEFAULT_TABLE_LEGEND: LegendItem[] = [
  { key: "available",      label: "Available",       color: "#d5e3fc" },
  { key: "occupied",       label: "Occupied",        color: "#2b6954" },
  { key: "reserved",       label: "Reserved",        color: "#ffb95f" },
  { key: "cleaning",       label: "Cleaning",        color: "oklch(0.929 0.013 255.508)" },
  { key: "out_of_service", label: "Out of Service",  color: "oklch(0.577 0.245 27.325)" },
];

interface StatusLegendProps {
  statuses?: LegendItem[];
  className?: string;
}

export function StatusLegend({
  statuses = DEFAULT_TABLE_LEGEND,
  className,
}: StatusLegendProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-6", className)}>
      {statuses.map((item) => (
        <div key={item.key} className="flex items-center gap-2">
          <span
            className="block h-3 w-3 rounded-full shrink-0"
            style={{ background: item.color }}
            aria-hidden="true"
          />
          <span className="typography-small text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
