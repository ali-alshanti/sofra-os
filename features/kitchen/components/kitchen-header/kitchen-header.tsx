"use client";

import { Receipt, Flame, CheckCircle, Timer, RefreshCw, SlidersHorizontal, Maximize2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import type { KitchenHeaderProps } from "./kitchen-header.types";

function HeaderActions({
  onRefresh,
  onFilter,
  onFullscreen,
  tRefresh,
  tFilters,
}: Pick<KitchenHeaderProps, "onRefresh" | "onFilter" | "onFullscreen"> & {
  tRefresh: string;
  tFilters: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh}>
        <RefreshCw size={15} />
        {tRefresh}
      </Button>
      <Button variant="outline" size="sm" className="gap-2" onClick={onFilter}>
        <SlidersHorizontal size={15} />
        {tFilters}
      </Button>
      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onFullscreen}>
        <Maximize2 size={16} />
        <span className="sr-only">Fullscreen</span>
      </Button>
    </div>
  );
}

export function KitchenHeader({ stats, isLoading = false, onRefresh, onFilter, onFullscreen }: KitchenHeaderProps) {
  const t  = useTranslations("kitchen");
  const tc = useTranslations("common.actions");

  // Show skeleton only while actively loading; show "—" when query is disabled or has no data
  const loading = isLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <HeaderActions
            onRefresh={onRefresh}
            onFilter={onFilter}
            onFullscreen={onFullscreen}
            tRefresh={tc("refresh")}
            tFilters={tc("filter")}
          />
        }
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard loading={loading} title={t("stats.active")}    value={stats ? String(stats.activeOrders) : "—"} icon={Receipt}     iconBg="oklch(0.596 0.145 163.225 / 0.08)" iconColor="oklch(0.596 0.145 163.225)" />
        <StatCard loading={loading} title={t("stats.preparing")} value={stats ? String(stats.preparing)    : "—"} icon={Flame}       iconBg="#ffddb866" iconColor="#653e00" />
        <StatCard loading={loading} title={t("stats.ready")}     value={stats ? String(stats.ready)        : "—"} icon={CheckCircle} iconBg="#b0f0d666" iconColor="#2b6954" />
        <StatCard loading={loading} title={t("stats.avgTime")}   value={stats?.avgPrepTime                 ?? "—"} icon={Timer}       iconBg="#d5e3fc"   iconColor="#57657a" />
      </div>
    </div>
  );
}
