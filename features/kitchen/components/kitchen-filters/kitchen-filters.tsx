import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_STATIONS,
  PRIORITY_OPTIONS,
  type KitchenFiltersProps,
  type KitchenPriority,
} from "./kitchen-filters.types";

export function KitchenFilters({
  stations = DEFAULT_STATIONS,
  value,
  onStationChange,
  onPriorityChange,
  onSearchChange,
}: KitchenFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/20 bg-muted/40 px-2 py-2">

      {/* Station tabs */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {stations.map((station) => {
          const active = value.station === station.id;
          return (
            <button
              key={station.id}
              type="button"
              onClick={() => onStationChange?.(station.id)}
              className={cn(
                "whitespace-nowrap rounded-lg px-4 py-2 text-[13px] font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {station.label}
            </button>
          );
        })}
      </div>

      {/* Right — Priority + Search */}
      <div className="flex items-center gap-4 pl-2">
        {/* Priority select */}
        <div
          className="flex items-center gap-2 pr-4"
          style={{ borderRight: "1px solid oklch(0.929 0.013 255.508 / 0.3)" }}
        >
          <span className="text-[13px] text-muted-foreground whitespace-nowrap">
            Priority:
          </span>
          <Select
            value={value.priority}
            onValueChange={(v) => onPriorityChange?.(v as KitchenPriority)}
          >
            <SelectTrigger className="h-8 w-28 border-none bg-transparent shadow-none text-[13px] font-medium text-primary focus:ring-0 p-0 pl-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-[13px]">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search input */}
        <div className="relative w-56">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            placeholder="Search orders or items..."
            aria-label="Search kitchen orders"
            value={value.search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full rounded-lg border border-border/30 bg-card pl-9 pr-3 py-1.5 text-[13px] placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>
    </div>
  );
}
