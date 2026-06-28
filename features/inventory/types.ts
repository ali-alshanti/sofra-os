// ─── Primitives ────────────────────────────────────────────────────────────────

export type InventoryStatus = "in_stock" | "low_stock" | "out_of_stock";

export type InventoryUnit =
  | "kg"
  | "units"
  | "liters"
  | "pieces"
  | "bottles"
  | "g"
  | "ml";

// ─── Entities ──────────────────────────────────────────────────────────────────

export interface InventoryCategory {
  id: string;
  name: string; // e.g. "Produce", "Pantry", "Seafood", "Meat"
}

export interface Supplier {
  id: string;
  name: string; // e.g. "Fresh Connect", "Sysco Foods"
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  imageSrc?: string;
  category: InventoryCategory;
  supplier: Supplier;
  quantity: number;
  unit: InventoryUnit;
  reorderPoint: number;
  status: InventoryStatus;
  lastUpdated: Date | string;
}

// ─── Filter value ─────────────────────────────────────────────────────────────

export interface InventoryFiltersValue {
  search:     string;
  categoryId: string;
  supplierId: string;
  status:     InventoryStatus | "all";
}

export const DEFAULT_INVENTORY_FILTERS: InventoryFiltersValue = {
  search:     "",
  categoryId: "all",
  supplierId: "all",
  status:     "all",
};
