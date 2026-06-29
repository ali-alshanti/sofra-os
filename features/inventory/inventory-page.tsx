"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AppShell }   from "@/components/layout/app-shell";
import { Pagination } from "@/components/shared/pagination";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { InventoryHeader }  from "./components/inventory-header";
import { InventorySummary } from "./components/inventory-summary";
import { InventoryFilters } from "./components/inventory-filters";
import { InventoryTable }   from "./components/inventory-table";
import {
  DEFAULT_INVENTORY_FILTERS,
  type InventoryFiltersValue,
  type InventoryStatus,
} from "./types";
import {
  useInventoryItems,
  useInventorySummary,
  useInventoryCategories,
  useSuppliers,
  useDeleteInventoryItem,
} from "@/lib/hooks/use-inventory";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

const PAGE_SIZE = 10;

export function InventoryFeature() {
  const t = useTranslations("inventory");

  const [filters, setFilters]               = useState<InventoryFiltersValue>(DEFAULT_INVENTORY_FILTERS);
  const [currentPage, setCurrentPage]       = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const queryClient                         = useQueryClient();

  const { data: summary, isLoading: summaryLoading } = useInventorySummary();
  const { data: categories = [] }                    = useInventoryCategories();
  const { data: suppliers  = [] }                    = useSuppliers();

  const { data: itemsData, isLoading: itemsLoading } = useInventoryItems({
    page:       currentPage,
    pageSize:   PAGE_SIZE,
    search:     filters.search     || undefined,
    categoryId: filters.categoryId !== "all" ? filters.categoryId : undefined,
    supplierId: filters.supplierId !== "all" ? filters.supplierId : undefined,
    status:     filters.status     !== "all" ? filters.status     : undefined,
  });

  const deleteItem = useDeleteInventoryItem();

  const items      = itemsData?.items  ?? [];
  const totalItems = itemsData?.total  ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all });
  }

  function handleConfirmDelete() {
    if (!pendingDeleteId) return;
    deleteItem.mutate(pendingDeleteId, {
      onSettled: () => setPendingDeleteId(null),
    });
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <InventoryHeader
          onRefresh={handleRefresh}
          onExport={() => undefined}
          onAddItem={() => undefined}
        />

        <InventorySummary
          stats={
            summaryLoading || !summary
              ? { totalItems: 0, lowStockItems: 0, outOfStockItems: 0, totalValue: "$0.00" }
              : summary
          }
        />

        <InventoryFilters
          value={filters}
          categories={categories}
          suppliers={suppliers}
          disabled={itemsLoading}
          onSearchChange={(s) => { setFilters((f) => ({ ...f, search: s })); setCurrentPage(1); }}
          onCategoryChange={(c) => { setFilters((f) => ({ ...f, categoryId: c })); setCurrentPage(1); }}
          onSupplierChange={(s) => { setFilters((f) => ({ ...f, supplierId: s })); setCurrentPage(1); }}
          onStatusChange={(st) => { setFilters((f) => ({ ...f, status: st as InventoryStatus | "all" })); setCurrentPage(1); }}
        />

        <InventoryTable
          items={items}
          loading={itemsLoading}
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
          title="Delete Item"
          description="This will permanently remove the inventory item and cannot be undone."
          confirmLabel="Delete"
          loading={deleteItem.isPending}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AppShell>
  );
}
