"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Pagination } from "@/components/shared/pagination";
import { InventoryHeader } from "./components/inventory-header";
import { InventorySummary, type InventoryStats } from "./components/inventory-summary";
import { InventoryFilters } from "./components/inventory-filters";
import { InventoryTable } from "./components/inventory-table";
import {
  DEFAULT_INVENTORY_FILTERS,
  type InventoryFiltersValue,
  type InventoryItem,
  type InventoryStatus,
} from "./types";

// ─── Placeholder Data ─────────────────────────────────────────────────────────

const PLACEHOLDER_ITEMS: InventoryItem[] = [
  {
    id: "1", name: "Avocado Hass Premium", sku: "SKU-29384",
    category: { id: "produce", name: "Produce" },
    supplier: { id: "fc", name: "Fresh Connect" },
    quantity: 142, unit: "units", reorderPoint: 40,
    status: "in_stock", lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkjfIzByZ9E3PnvM1LDZAPAbYXpyzrT66V9zRExVSJGeb5NJ_zQIbdKCZY-Zx_tIkur7O8guqNyKMa7nJr2uqU7PhXmJGVFCyQDN8bNMIHfAOWanMiKfJuEpRbW7kaCvpli2P74n7rkdQO_l95k2mK_r4tG37bWSKY7Ea3tHTpaDCIjfZR82THfsQczqC0XxzXYhj94Rgl16Ya8yu8N9lIp0skvRWIO7nZXDtvmFh9LWlKhQZU3wm7sukYKEMBhsqdIhIu5DCizg",
  },
  {
    id: "2", name: "Olive Oil EV (5L)", sku: "SKU-88219",
    category: { id: "pantry", name: "Pantry" },
    supplier: { id: "sysco", name: "Sysco Foods" },
    quantity: 8, unit: "units", reorderPoint: 10,
    status: "low_stock", lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ9MJ42kXw86MSzB42FQwXtnnexdir5n3s_LvLZrHvG-swOuEax4KIGVJcxKPnGyYUTLVXybWxjoSAtWSOiI-rJlDChtIkEik8xFrispUPOscmsUGPXKeHfwTXKGOtH62ohz99Z98egil03hIpivUg3rYj1bHJKYneHaUO9bkKDPjlB9PczUeU_5LtU8Rk5UBxWZ3-DSsZKbqJdMxW7sJVsLGMgAm0WU9_mjCYlOR3Y1MQbAw5Y8Fhtjr_RZicv8QUoX7aUFWC1A",
  },
  {
    id: "3", name: "Wild Sea Bass (Whole)", sku: "SKU-44102",
    category: { id: "seafood", name: "Seafood" },
    supplier: { id: "gc", name: "Global Catch Co." },
    quantity: 0, unit: "kg", reorderPoint: 15,
    status: "out_of_stock", lastUpdated: new Date(Date.now() - 13 * 60 * 60 * 1000),
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBREap0rFfZBfLdZX2Dl5GSakCH8_Hoq9TtSLddCH9BrkrEFre8mswaWgXQQW2HiH4HBrz2QcUwP7Xws0IChd1CfsSlkjbnFC6dxZ3BFcsxxlsAJGPDoW9K5dklcGI9gCzRmYZUxRg1tLloEByBJ01MYbcpNUA7kgJOafuC6a7Asgu8gYDBol4Jf6W0RFkFqKoILg_U3nLJmU_groLoz1RY1lz-DX5iaIrMQJvIAbO9E3RtkYY1osdWmt-r_IPyjIAyv5dzl-iCsw",
  },
  {
    id: "4", name: "Wagyu Striploin A5", sku: "SKU-00127",
    category: { id: "meat", name: "Meat" },
    supplier: { id: "pc", name: "Prime Cuts Inc." },
    quantity: 24, unit: "kg", reorderPoint: 10,
    status: "in_stock", lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000),
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaHCYI22eXkdzVSXmyUcnnxU5cQyTDwwrepba8Xo9Wds1L2aBlBtDRKF4QQmUTsUocdx8CTKRsjVjeJNgBHfuVZNtHPda9HvbnR_o7v9Rtt-bEQBTMMsKZ4Tdo__cimGQTL3In9Bk94wzDCPrc3SnwrsKkg50knHdEThBsbBfhxy2KmjpQqRo_4QYX2ol0y7pcscC5-m4oRWJiUap4nfdDjQ9Ajk7kQNLpuM4dqqvYdHfKjmAo8Yg-x-EdKTPsKfiWf0sSzKYQXg",
  },
];

const PLACEHOLDER_STATS: InventoryStats = {
  totalItems:      482,
  lowStockItems:   12,
  outOfStockItems: 5,
  totalValue:      "$18,450.00",
};

const PLACEHOLDER_CATEGORIES = [
  { id: "produce", name: "Produce" },
  { id: "pantry",  name: "Pantry"  },
  { id: "seafood", name: "Seafood" },
  { id: "meat",    name: "Meat"    },
  { id: "dairy",   name: "Dairy"   },
  { id: "drinks",  name: "Beverages" },
];

const PLACEHOLDER_SUPPLIERS = [
  { id: "fc",    name: "Fresh Connect"  },
  { id: "sysco", name: "Sysco Foods"    },
  { id: "gc",    name: "Global Catch Co." },
  { id: "pc",    name: "Prime Cuts Inc." },
  { id: "wd",    name: "Wine Direct"    },
];

// ─── Inventory Feature ────────────────────────────────────────────────────────

export function InventoryFeature() {
  const [filters, setFilters] = useState<InventoryFiltersValue>(DEFAULT_INVENTORY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  // Client-side filter for placeholder data only — replaced by API query later
  const filteredItems = PLACEHOLDER_ITEMS.filter((item) => {
    if (filters.categoryId !== "all" && item.category.id !== filters.categoryId) return false;
    if (filters.supplierId !== "all" && item.supplier.id !== filters.supplierId) return false;
    if (filters.status     !== "all" && item.status !== filters.status) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.sku.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <InventoryHeader
          onRefresh={() => undefined}
          onExport={() => undefined}
          onAddItem={() => undefined}
        />

        <InventorySummary stats={PLACEHOLDER_STATS} />

        <InventoryFilters
          value={filters}
          categories={PLACEHOLDER_CATEGORIES}
          suppliers={PLACEHOLDER_SUPPLIERS}
          onSearchChange={(s) => { setFilters((f) => ({ ...f, search: s })); setCurrentPage(1); }}
          onCategoryChange={(c) => { setFilters((f) => ({ ...f, categoryId: c })); setCurrentPage(1); }}
          onSupplierChange={(s) => { setFilters((f) => ({ ...f, supplierId: s })); setCurrentPage(1); }}
          onStatusChange={(st) => { setFilters((f) => ({ ...f, status: st as InventoryStatus | "all" })); setCurrentPage(1); }}
        />

        <InventoryTable
          items={filteredItems}
          onView={(id) => undefined}
          onEdit={(id) => undefined}
          onDelete={(id) => undefined}
          pagination={
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(482 / 10)}
              totalItems={482}
              pageSize={10}
              itemLabel="items"
              onPageChange={setCurrentPage}
            />
          }
        />
      </div>
    </AppShell>
  );
}
