"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AppShell }   from "@/components/layout/app-shell";
import { Pagination } from "@/components/shared/pagination";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CustomerHeader }  from "./components/customer-header";
import { CustomerSummary } from "./components/customer-summary";
import { CustomerFilters } from "./components/customer-filters";
import { CustomerTable }   from "./components/customer-table";
import {
  DEFAULT_CUSTOMER_FILTERS,
  type CustomerFiltersValue,
  type CustomerSegment,
  type CustomerLoyaltyFilter,
  type CustomerStatus,
} from "./types";
import { useCustomers, useCustomerSummary, useDeleteCustomer } from "@/lib/hooks/use-customers";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

const PAGE_SIZE = 10;

export function CustomersFeature() {
  const t = useTranslations("customers");

  const [filters, setFilters]             = useState<CustomerFiltersValue>(DEFAULT_CUSTOMER_FILTERS);
  const [currentPage, setCurrentPage]     = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const queryClient                       = useQueryClient();

  const { data: summary, isLoading: summaryLoading } = useCustomerSummary();

  const { data: customersData, isLoading: customersLoading } = useCustomers({
    page:     currentPage,
    pageSize: PAGE_SIZE,
    search:   filters.search  || undefined,
    segment:  filters.segment !== "all" ? filters.segment : undefined,
    loyalty:  filters.loyalty !== "all" ? filters.loyalty : undefined,
    status:   filters.status  !== "all" ? filters.status  : undefined,
  });

  const deleteCustomer = useDeleteCustomer();

  const customers  = customersData?.customers ?? [];
  const totalItems = customersData?.total     ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customers.all });
  }

  function handleConfirmDelete() {
    if (!pendingDeleteId) return;
    deleteCustomer.mutate(pendingDeleteId, {
      onSettled: () => setPendingDeleteId(null),
    });
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <CustomerHeader
          onRefresh={handleRefresh}
          onExport={() => undefined}
          onAddCustomer={() => undefined}
        />

        <CustomerSummary
          stats={
            summaryLoading || !summary
              ? { totalCustomers: 0, vipCustomers: 0, activeToday: 0, avgSpend: "$0.00" }
              : summary
          }
        />

        <CustomerFilters
          value={filters}
          disabled={customersLoading}
          onSearchChange={(s) => { setFilters(f => ({ ...f, search: s })); setCurrentPage(1); }}
          onSegmentChange={(seg) => { setFilters(f => ({ ...f, segment: seg as CustomerSegment })); setCurrentPage(1); }}
          onLoyaltyChange={(loy) => { setFilters(f => ({ ...f, loyalty: loy as CustomerLoyaltyFilter })); setCurrentPage(1); }}
          onStatusChange={(st) => { setFilters(f => ({ ...f, status: st as CustomerStatus | "all" })); setCurrentPage(1); }}
        />

        <CustomerTable
          customers={customers}
          loading={customersLoading}
          onView={() => undefined}
          onEdit={() => undefined}
          onDelete={(id) => setPendingDeleteId(id)}
          pagination={
            totalPages > 1 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={PAGE_SIZE}
                itemLabel={t("title").toLowerCase()}
                onPageChange={setCurrentPage}
              />
            ) : undefined
          }
        />

        <ConfirmDialog
          open={!!pendingDeleteId}
          onOpenChange={(open) => { if (!open) setPendingDeleteId(null); }}
          title="Delete Customer"
          description="This action cannot be undone. The customer profile will be permanently removed."
          confirmLabel="Delete"
          loading={deleteCustomer.isPending}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AppShell>
  );
}
