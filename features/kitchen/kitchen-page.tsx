"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KitchenHeader } from "./components/kitchen-header";
import { KitchenFilters, DEFAULT_KITCHEN_FILTERS, type KitchenFiltersValue, type KitchenPriority } from "./components/kitchen-filters";
import { KitchenBoard, PLACEHOLDER_ORDERS } from "./components/kitchen-board";
import type { TicketStatus } from "./components/kitchen-ticket";

export function KitchenFeature() {
  const [filters, setFilters] = useState<KitchenFiltersValue>(DEFAULT_KITCHEN_FILTERS);

  function handleAction(id: string, status: TicketStatus) {
    // Placeholder — will call API to advance ticket status
    console.log("advance", id, status);
  }

  const filteredOrders = PLACEHOLDER_ORDERS.filter((order) => {
    if (filters.station  !== "all" && order.station.toLowerCase() !== filters.station) return false;
    if (filters.priority !== "all" && order.priority !== filters.priority) return false;
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

  return (
    <AppShell>
      <div className="space-y-6">
        <KitchenHeader
          onRefresh={() => console.log("refresh")}
          onFilter={() => console.log("filter")}
          onFullscreen={() => console.log("fullscreen")}
        />

        <KitchenFilters
          value={filters}
          onStationChange={(s) => setFilters((f) => ({ ...f, station: s }))}
          onPriorityChange={(p) => setFilters((f) => ({ ...f, priority: p as KitchenPriority }))}
          onSearchChange={(q) => setFilters((f) => ({ ...f, search: q }))}
        />

        <KitchenBoard
          columns={columns}
          onAction={handleAction}
        />
      </div>
    </AppShell>
  );
}
