import { Receipt, Flame, CheckCircle, Timer, RefreshCw, SlidersHorizontal, Maximize2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import type { KitchenHeaderProps, KitchenStats } from "./kitchen-header.types";

// ─── Default placeholder stats ────────────────────────────────────────────────

const DEFAULT_STATS: KitchenStats = {
  activeOrders: 18,
  preparing:    12,
  ready:         6,
  avgPrepTime:  "14m",
};

// ─── Action buttons ───────────────────────────────────────────────────────────

function HeaderActions({
  onRefresh,
  onFilter,
  onFullscreen,
}: Pick<KitchenHeaderProps, "onRefresh" | "onFilter" | "onFullscreen">) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh}>
        <RefreshCw size={15} />
        Refresh
      </Button>
      <Button variant="outline" size="sm" className="gap-2" onClick={onFilter}>
        <SlidersHorizontal size={15} />
        Filters
      </Button>
      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onFullscreen}>
        <Maximize2 size={16} />
        <span className="sr-only">Fullscreen</span>
      </Button>
    </div>
  );
}

// ─── KitchenHeader ────────────────────────────────────────────────────────────

export function KitchenHeader({
  stats = DEFAULT_STATS,
  onRefresh,
  onFilter,
  onFullscreen,
}: KitchenHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Page title + actions */}
      <PageHeader
        title="Kitchen Display System"
        description="Live order tracking across all kitchen stations."
        actions={
          <HeaderActions
            onRefresh={onRefresh}
            onFilter={onFilter}
            onFullscreen={onFullscreen}
          />
        }
      />

      {/* KPI row — reuses shared StatCard */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Orders"
          value={String(stats.activeOrders)}
          icon={Receipt}
          iconBg="oklch(0.596 0.145 163.225 / 0.08)"
          iconColor="oklch(0.596 0.145 163.225)"
        />
        <StatCard
          title="Preparing"
          value={String(stats.preparing)}
          icon={Flame}
          iconBg="#ffddb866"
          iconColor="#653e00"
        />
        <StatCard
          title="Ready"
          value={String(stats.ready)}
          icon={CheckCircle}
          iconBg="#b0f0d666"
          iconColor="#2b6954"
        />
        <StatCard
          title="Avg Prep Time"
          value={stats.avgPrepTime}
          icon={Timer}
          iconBg="#d5e3fc"
          iconColor="#57657a"
        />
      </div>
    </div>
  );
}
