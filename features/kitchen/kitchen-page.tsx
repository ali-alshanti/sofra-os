"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KitchenHeader }  from "./components/kitchen-header";
import { KitchenFilters, DEFAULT_KITCHEN_FILTERS, type KitchenFiltersValue, type KitchenPriority } from "./components/kitchen-filters";
import { KitchenBoard }  from "./components/kitchen-board";
import type { TicketStatus } from "./components/kitchen-ticket";
import { useKitchenOrders, useKitchenStats, useAdvanceKitchenOrderStatus } from "@/lib/hooks/use-kitchen";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

export function KitchenFeature() {
  const [filters, setFilters] = useState<KitchenFiltersValue>(DEFAULT_KITCHEN_FILTERS);
  const queryClient           = useQueryClient();

  // ─── Data ──────────────────────────────────────────────────────────────────
  const { data: allOrders = [], isLoading: ordersLoading } = useKitchenOrders();
  const { data: stats }                                    = useKitchenStats();
  const advanceStatus                                      = useAdvanceKitchenOrderStatus();

  // ─── Client-side filter (station, priority, search) ────────────────────────
  const filteredOrders = allOrders.filter((order) => {
    if (filters.station  !== "all" && order.station.toLowerCase() !== filters.station)  return false;
    if (filters.priority !== "all" && order.priority !== filters.priority)              return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!order.orderNumber.toLowerCase().includes(q) &&
          !order.items.some((i) => i.name.toLowerCase().includes(q))) return false;
    }
    return true;
  });

  const columns = (["pending", "preparing", "ready", "completed"] as TicketStatus[]).map(
    (status) => ({ status, orders: filteredOrders.filter((o) => o.status === status) }),
  );

  function handleAction(orderId: string, currentStatus: TicketStatus) {
    advanceStatus.mutate({ orderId, status: currentStatus });
  }

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.kitchen.all });
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <KitchenHeader
          stats={stats}
          onRefresh={handleRefresh}
          onFilter={() => undefined}
          onFullscreen={() => undefined}
        />

        <KitchenFilters
          value={filters}
          onStationChange={(s) => setFilters((f) => ({ ...f, station: s }))}
          onPriorityChange={(p) => setFilters((f) => ({ ...f, priority: p as KitchenPriority }))}
          onSearchChange={(q) => setFilters((f) => ({ ...f, search: q }))}
        />

        <KitchenBoard
          columns={columns}
          loading={ordersLoading}
          onAction={handleAction}
        />
      </div>
    </AppShell>
  );
}
