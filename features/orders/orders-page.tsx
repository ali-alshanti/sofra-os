"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  DollarSign,
  Plus,
} from "lucide-react";
import { AppShell }    from "@/components/layout/app-shell";
import { PageHeader }  from "@/components/shared/page-header";
import { StatCard }    from "@/components/shared/stat-card";
import { Button }      from "@/components/ui/button";
import { Pagination }  from "@/components/shared/pagination";
import {
  OrdersFilters,
  DEFAULT_FILTERS,
  type OrdersFiltersValue,
} from "./components/orders-filters";
import { OrdersTable } from "./components/orders-table";
import { OrderRow }    from "./components/order-row";
import { useOrders, useOrdersSummary } from "@/lib/hooks/use-orders";
import { formatCurrency } from "@/lib/utils/format-currency";

const PAGE_SIZE = 10;

export function OrdersFeature() {
  const [filters, setFilters]       = useState<OrdersFiltersValue>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Data ──────────────────────────────────────────────────────────────────
  const { data: summary, isLoading: summaryLoading } = useOrdersSummary();

  const { data: ordersData, isLoading: ordersLoading } = useOrders({
    page:      currentPage,
    pageSize:  PAGE_SIZE,
    search:    filters.search || undefined,
    status:    filters.status !== "all" ? filters.status : undefined,
    tableId:   filters.tableId  !== "all" ? filters.tableId  : undefined,
    waiterId:  filters.waiterId !== "all" ? filters.waiterId : undefined,
    orderType: filters.orderType !== "all" ? filters.orderType : undefined,
    dateFrom:  filters.dateFrom || undefined,
    dateTo:    filters.dateTo   || undefined,
  });

  const orders    = ordersData?.orders ?? [];
  const totalItems = ordersData?.total  ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  // ─── Filter handlers ────────────────────────────────────────────────────────
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
          <StatCard
            loading={summaryLoading}
            title="Total Orders"
            value={summary ? String(summary.totalToday) : "0"}
            icon={ShoppingBag}
            iconBg="#d5e3fc"
            iconColor="#515f74"
            description="today"
          />
          <StatCard
            loading={summaryLoading}
            title="Pending"
            value={summary ? String(summary.pendingCount) : "0"}
            icon={Clock}
            iconBg="#ffddb8"
            iconColor="#442800"
            badge={summary && summary.pendingCount > 0 ? "Needs attention" : undefined}
          />
          <StatCard
            loading={summaryLoading}
            title="Completed"
            value={summary ? String(summary.completedCount) : "0"}
            icon={CheckCircle}
            iconBg="#b0f0d6"
            iconColor="#003527"
          />
          <StatCard
            loading={summaryLoading}
            title="Revenue Today"
            value={summary ? formatCurrency(summary.revenueToday) : "$0.00"}
            icon={DollarSign}
            iconBg="#b0f0d6"
            iconColor="#003527"
          />
        </div>

        {/* Filters */}
        <OrdersFilters
          value={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          loading={ordersLoading}
        />

        {/* Table + Pagination */}
        <OrdersTable
          loading={ordersLoading}
          emptyMessage={
            filters.search || filters.status !== "all"
              ? "No orders match your filters."
              : "No orders today. Orders will appear here once placed."
          }
          footer={
            totalPages > 1 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={PAGE_SIZE}
                itemLabel="orders"
                onPageChange={setCurrentPage}
              />
            ) : undefined
          }
        >
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </OrdersTable>

      </div>
    </AppShell>
  );
}
