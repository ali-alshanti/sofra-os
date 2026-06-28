import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { MenuItem } from "@/features/menu/components/menu-card";
import type { CategoryItemData } from "@/features/menu/components/category-sidebar";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GetMenuItemsParams {
  restaurantId: string;
  categoryId?:  string;   // undefined = all categories
  search?:      string;
  includeUnavailable?: boolean;
}

// ─── getCategories ────────────────────────────────────────────────────────────

export async function getCategories(restaurantId: string): Promise<CategoryItemData[]> {
  const supabase = getSupabaseBrowserClient();

  // Fetch categories and active item counts in parallel
  const [catResult, countResult] = await Promise.all([
    supabase
      .from("menu_categories")
      .select("id, name, display_order")
      .eq("restaurant_id", restaurantId)
      .eq("is_active", true)
      .order("display_order"),

    supabase
      .from("menu_items")
      .select("category_id")
      .eq("restaurant_id", restaurantId)
      .is("deleted_at", null),
  ]);

  if (catResult.error) throw new Error(catResult.error.message);

  // Build count map from items
  const countMap: Record<string, number> = {};
  for (const item of countResult.data ?? []) {
    if (item.category_id) {
      countMap[item.category_id] = (countMap[item.category_id] ?? 0) + 1;
    }
  }

  return (catResult.data ?? []).map((cat) => ({
    id:    cat.id,
    name:  cat.name,
    count: countMap[cat.id] ?? 0,
  }));
}

// ─── getMenuItems ─────────────────────────────────────────────────────────────

export async function getMenuItems({
  restaurantId,
  categoryId,
  search,
  includeUnavailable = true,
}: GetMenuItemsParams): Promise<MenuItem[]> {
  const supabase = getSupabaseBrowserClient();

  let query = supabase
    .from("menu_items")
    .select(`
      id,
      name,
      description,
      price,
      image_url,
      status,
      display_order,
      is_featured,
      category_id,
      menu_categories ( id, name )
    `)
    .eq("restaurant_id", restaurantId)
    .is("deleted_at", null)
    .order("display_order");

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (!includeUnavailable) {
    query = query.eq("status", "available");
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  let items = (data ?? []) as unknown as MenuItemRow[];

  // Client-side search (server-side FTS via pg_trgm in future)
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.description ?? "").toLowerCase().includes(q),
    );
  }

  return items.map(mapRowToMenuItem);
}

// ─── updateMenuItemAvailability ───────────────────────────────────────────────

export async function updateMenuItemAvailability(
  itemId: string,
  available: boolean,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("menu_items")
    .update({ status: available ? "available" : "unavailable" })
    .eq("id", itemId);
  if (error) throw new Error(error.message);
}

// ─── updateMenuItem ───────────────────────────────────────────────────────────

export async function updateMenuItem(
  itemId: string,
  patch: Partial<{ name: string; description: string; price: number; image_url: string; status: string }>,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("menu_items")
    .update(patch)
    .eq("id", itemId);
  if (error) throw new Error(error.message);
}

// ─── deleteMenuItem (soft) ────────────────────────────────────────────────────

export async function deleteMenuItem(itemId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("menu_items")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", itemId);
  if (error) throw new Error(error.message);
}

// ─── Internal row mapper ──────────────────────────────────────────────────────

interface MenuItemRow {
  id:           string;
  name:         string;
  description:  string | null;
  price:        number;
  image_url:    string | null;
  status:       string;
  display_order: number;
  is_featured:  boolean;
  category_id:  string | null;
  menu_categories: { id: string; name: string } | null;
}

function mapRowToMenuItem(row: MenuItemRow): MenuItem {
  return {
    id:          row.id,
    name:        row.name,
    description: row.description ?? "",
    price:       Number(row.price),
    imageSrc:    row.image_url ?? undefined,
    category:    row.category_id ?? "",
    available:   row.status === "available",
    badge:       row.is_featured ? "Best Seller" : undefined,
  };
}
