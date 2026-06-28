import { CalendarDays } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";
import { KpiSection } from "./components/kpi-section";
import { RevenueTrendCard } from "./components/revenue-trend";
import { PopularItemsCard } from "./components/popular-items";
import { InventoryAlertsCard } from "./components/inventory-alerts";

// ─── Date Range Picker ────────────────────────────────────────────────────────
// Static placeholder — no state, no logic.
// Replace with a controlled component when date filtering is implemented.

const DATE_OPTIONS = ["Today", "Last 7d", "Last 30d"] as const;

function DateRangePicker() {
  return (
    <div className="flex items-center rounded-lg p-1 bg-card border border-border shadow-card">
      {DATE_OPTIONS.map((label, i) => (
        <button
          key={label}
          className={cn(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
            i === 0
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted",
          )}
        >
          {label}
        </button>
      ))}
      <div className="w-px h-4 bg-border mx-2" />
      <button className="px-4 py-1.5 rounded-md text-sm text-muted-foreground flex items-center gap-2 hover:bg-muted transition-colors">
        <CalendarDays size={16} />
        Custom
      </button>
    </div>
  );
}

// ─── Dashboard Feature ────────────────────────────────────────────────────────

export function DashboardFeature() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Executive Overview"
          description="Real-time performance across all floor operations."
          actions={<DateRangePicker />}
        />

        <KpiSection />

        <RevenueTrendCard />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PopularItemsCard />
          <InventoryAlertsCard />
        </div>
      </div>
    </AppShell>
  );
}
