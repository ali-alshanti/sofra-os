"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  DollarSign,
  Plus,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import {
  OrdersFilters,
  DEFAULT_FILTERS,
  type OrdersFiltersValue,
} from "./components/orders-filters";
import { OrdersTable } from "./components/orders-table";
import { OrderRow, type OrderData } from "./components/order-row";
import { OrdersPagination } from "./components/orders-pagination";

// ─── Orders KPI Data ──────────────────────────────────────────────────────────

const ORDERS_KPI = [
  {
    title: "Total Orders",
    value: "142",
    icon: ShoppingBag,
    iconBg: "#d5e3fc",
    iconColor: "#515f74",
    trend: { value: "+8%", direction: "up" as const },
    description: "vs yesterday",
  },
  {
    title: "Pending",
    value: "18",
    icon: Clock,
    iconBg: "#ffddb8",
    iconColor: "#442800",
    badge: "Needs attention",
  },
  {
    title: "Completed",
    value: "113",
    icon: CheckCircle,
    iconBg: "#b0f0d6",
    iconColor: "#003527",
    trend: { value: "+5%", direction: "up" as const },
  },
  {
    title: "Revenue Today",
    value: "$6,248.00",
    icon: DollarSign,
    iconBg: "#b0f0d6",
    iconColor: "#003527",
    trend: { value: "+12%", direction: "up" as const },
  },
] as const;

// ─── Placeholder Orders ───────────────────────────────────────────────────────

const PLACEHOLDER_ORDERS: OrderData[] = [
  {
    id: "10041",
    tableNumber: "Table 4",
    customer: { name: "James Carter" },
    waiter:   { name: "Alex M." },
    itemsCount: 3,
    total: 124.0,
    status: "preparing",
    createdAt: new Date(Date.now() - 12 * 60 * 1000),
  },
  {
    id: "10040",
    tableNumber: "Table 7",
    customer: { name: "Maria Lopez" },
    waiter:   { name: "Sarah K." },
    itemsCount: 5,
    total: 210.5,
    status: "ready",
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
  },
  {
    id: "10039",
    tableNumber: "Table 2",
    customer: { name: "David Chen" },
    waiter:   { name: "Omar R." },
    itemsCount: 2,
    total: 68.0,
    status: "served",
    createdAt: new Date(Date.now() - 48 * 60 * 1000),
  },
  {
    id: "10038",
    tableNumber: "Table 9",
    customer: { name: "Priya Nair" },
    waiter:   { name: "Alex M." },
    itemsCount: 4,
    total: 155.75,
    status: "pending",
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "10037",
    tableNumber: "Takeaway",
    customer: { name: "Luca Ferrari" },
    waiter:   { name: "Sarah K." },
    itemsCount: 1,
    total: 32.0,
    status: "cancelled",
    createdAt: new Date(Date.now() - 70 * 60 * 1000),
  },
];

// ─── Orders Feature ───────────────────────────────────────────────────────────

export function OrdersFeature() {
  const [filters, setFilters] = useState<OrdersFiltersValue>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  function handleFilterChange(patch: Partial<OrdersFiltersValue>) {
    setFilters((prev) => ({ ...prev, ...patch }));
    setCurrentPage(1);
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }

  return (
    <AppShell>
      <div className="space-y-6">

        {/* Page Header */}
        <PageHeader
          title="Orders"
          description="Manage and track all restaurant orders in real time."
          actions={
            <Button size="sm" className="gap-2">
              <Plus size={16} />
              New Order
            </Button>
          }
        />

        {/* KPI Section */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ORDERS_KPI.map((kpi) => (
            <StatCard key={kpi.title} {...kpi} />
          ))}
        </div>

        {/* Filters */}
        <OrdersFilters
          value={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Table + Pagination */}
        <OrdersTable
          footer={
            <OrdersPagination
              currentPage={currentPage}
              totalPages={15}
              totalItems={142}
              pageSize={10}
              itemLabel="orders"
              onPageChange={setCurrentPage}
            />
          }
        >
          {PLACEHOLDER_ORDERS.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </OrdersTable>

      </div>
    </AppShell>
  );
}
