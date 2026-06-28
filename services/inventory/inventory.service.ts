import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils/format-currency";
import type {
  InventoryItem,
  InventoryCategory,
  Supplier,
  InventoryStatus,
  InventoryUnit,
} from "@/features/inventory/types";
import type { InventoryStats } from "@/features/inventory/components/inventory-summary";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GetInventoryItemsParams {
  restaurantId: string;
  page?:        number;
  pageSize?:    number;
  search?:      string;
  categoryId?:  string;
  supplierId?:  string;
  status?:      InventoryStatus | "all";
}

export interface GetInventoryItemsResult {
  items: InventoryItem[];
  total: number;
}

// ─── getInventoryCategories ───────────────────────────────────────────────────

export async function getInventoryCategories(restaurantId: string): Promise<InventoryCategory[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("inventory_categories")
    .select("id, name")
    .eq("restaurant_id", restaurantId)
    .order("name");

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─── getSuppliers ─────────────────────────────────────────────────────────────

export async function getSuppliers(restaurantId: string): Promise<Supplier[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("suppliers")
    .select("id, name")
    .eq("restaurant_id", restaurantId)
    .eq("is_active", true)
    .order("name");

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─── getInventoryItems ────────────────────────────────────────────────────────

export async function getInventoryItems({
  restaurantId,
  page     = 1,
  pageSize = 10,
  search,
  categoryId,
  supplierId,
  status,
}: GetInventoryItemsParams): Promise<GetInventoryItemsResult> {
  const supabase = getSupabaseBrowserClient();
  const from = (page - 1) * pageSize;
  const to   = from + pageSize - 1;

  let query = supabase
    .from("inventory_items")
    .select(
      `
      id,
      name,
      sku,
      unit,
      quantity,
      reorder_point,
      cost_per_unit,
      status,
      updated_at,
      inventory_categories ( id, name ),
      suppliers ( id, name )
      `,
      { count: "exact" },
    )
    .eq("restaurant_id", restaurantId)
    .order("name")
    .range(from, to);

  if (categoryId && categoryId !== "all") query = query.eq("category_id", categoryId);
  if (supplierId && supplierId !== "all") query = query.eq("supplier_id", supplierId);
  if (status     && status     !== "all") query = query.eq("status", status);

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  let rows = (data ?? []) as unknown as InventoryRow[];

  // Client-side search on name + sku (pg_trgm FTS in next milestone)
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.sku ?? "").toLowerCase().includes(q),
    );
  }

  return { items: rows.map(mapRowToItem), total: count ?? 0 };
}

// ─── getInventorySummary ──────────────────────────────────────────────────────

export async function getInventorySummary(restaurantId: string): Promise<InventoryStats> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("inventory_items")
    .select("status, quantity, cost_per_unit")
    .eq("restaurant_id", restaurantId);

  if (error) throw new Error(error.message);

  const all = data ?? [];
  const totalValue = all.reduce(
    (s, i) => s + Number(i.quantity) * Number(i.cost_per_unit),
    0,
  );

  return {
    totalItems:      all.length,
    lowStockItems:   all.filter((i) => i.status === "low_stock").length,
    outOfStockItems: all.filter((i) => i.status === "out_of_stock").length,
    totalValue:      formatCurrency(totalValue),
  };
}

// ─── getLowStockItems ─────────────────────────────────────────────────────────

export async function getLowStockItems(restaurantId: string, limit = 5): Promise<InventoryItem[]> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("inventory_items")
    .select(
      `id, name, sku, unit, quantity, reorder_point, cost_per_unit, status, updated_at,
       inventory_categories ( id, name ),
       suppliers ( id, name )`,
    )
    .eq("restaurant_id", restaurantId)
    .in("status", ["low_stock", "out_of_stock"])
    .order("status", { ascending: false })
    .order("quantity", { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as InventoryRow[]).map(mapRowToItem);
}

// ─── updateInventoryItem ──────────────────────────────────────────────────────

export async function updateInventoryItem(
  itemId: string,
  patch: Partial<{
    name: string; sku: string; unit: string;
    quantity: number; reorder_point: number;
    cost_per_unit: number; status: InventoryStatus;
    category_id: string; supplier_id: string;
  }>,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("inventory_items")
    .update(patch)
    .eq("id", itemId);
  if (error) throw new Error(error.message);
}

// ─── deleteInventoryItem ──────────────────────────────────────────────────────

export async function deleteInventoryItem(itemId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("inventory_items")
    .delete()
    .eq("id", itemId);
  if (error) throw new Error(error.message);
}

// ─── Internal mapper ──────────────────────────────────────────────────────────

interface InventoryRow {
  id:               string;
  name:             string;
  sku:              string | null;
  unit:             string;
  quantity:         number;
  reorder_point:    number;
  cost_per_unit:    number;
  status:           string;
  updated_at:       string;
  inventory_categories: { id: string; name: string } | null;
  suppliers:        { id: string; name: string } | null;
}

function mapRowToItem(row: InventoryRow): InventoryItem {
  return {
    id:           row.id,
    name:         row.name,
    sku:          row.sku ?? "",
    unit:         row.unit as InventoryUnit,
    quantity:     Number(row.quantity),
    reorderPoint: Number(row.reorder_point),
    status:       row.status as InventoryStatus,
    lastUpdated:  row.updated_at,
    category: {
      id:   row.inventory_categories?.id   ?? "",
      name: row.inventory_categories?.name ?? "Uncategorized",
    },
    supplier: {
      id:   row.suppliers?.id   ?? "",
      name: row.suppliers?.name ?? "Unknown",
    },
  };
}
