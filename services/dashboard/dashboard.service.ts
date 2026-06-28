import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type {
  DashboardSummary,
  RevenueDataPoint,
  TopSellingItem,
  InventoryAlert,
} from "@/types/dashboard";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayStart(): string {
  return new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
}

function yesterdayStart(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function yesterdayEnd(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

function pct(a: number, b: number): number | null {
  if (b === 0) return null;
  return Math.round(((a - b) / b) * 100);
}

function hourLabel(h: number): string {
  const ampm = h >= 12 ? "PM" : "AM";
  const hr   = h % 12 === 0 ? 12 : h % 12;
  return `${String(hr).padStart(2, "0")}:00 ${ampm}`;
}

// ─── getDashboardSummary ──────────────────────────────────────────────────────

export async function getDashboardSummary(restaurantId: string): Promise<DashboardSummary> {
  const supabase = getSupabaseBrowserClient();

  const [todayOrders, yesterdayOrders, tables] = await Promise.all([
    // Orders today
    supabase
      .from("orders")
      .select("total, status")
      .eq("restaurant_id", restaurantId)
      .neq("status", "cancelled")
      .gte("created_at", todayStart()),

    // Orders yesterday (for comparison)
    supabase
      .from("orders")
      .select("total, status")
      .eq("restaurant_id", restaurantId)
      .neq("status", "cancelled")
      .gte("created_at", yesterdayStart())
      .lte("created_at", yesterdayEnd()),

    // Dining tables
    supabase
      .from("dining_tables")
      .select("status")
      .eq("restaurant_id", restaurantId)
      .eq("is_active", true),
  ]);

  const todayRevenue = (todayOrders.data ?? []).reduce((s, o) => s + Number(o.total), 0);
  const yRevenue     = (yesterdayOrders.data ?? []).reduce((s, o) => s + Number(o.total), 0);
  const todayCount   = (todayOrders.data ?? []).length;
  const yCount       = (yesterdayOrders.data ?? []).length;

  const allTables    = tables.data ?? [];
  const activeCount  = allTables.filter((t) => t.status === "occupied").length;
  const totalCount   = allTables.length;
  const occupancy    = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

  // Rough kitchen load from order count relative to capacity
  let kitchenStatus: DashboardSummary["kitchenStatus"] = "optimal";
  if (occupancy > 80) kitchenStatus = "busy";
  else if (occupancy > 55) kitchenStatus = "moderate";

  return {
    revenueToday:         todayRevenue,
    revenueChangePercent: pct(todayRevenue, yRevenue),
    ordersToday:          todayCount,
    ordersChangePercent:  pct(todayCount, yCount),
    activeTablesCount:    activeCount,
    totalTablesCount:     totalCount,
    occupancyPercent:     occupancy,
    kitchenStatus,
  };
}

// ─── getRevenueAnalytics ──────────────────────────────────────────────────────

export async function getRevenueAnalytics(restaurantId: string): Promise<RevenueDataPoint[]> {
  const supabase  = getSupabaseBrowserClient();
  const now       = new Date();
  const currentHr = now.getHours();

  const { data, error } = await supabase
    .from("orders")
    .select("created_at, total")
    .eq("restaurant_id", restaurantId)
    .neq("status", "cancelled")
    .gte("created_at", todayStart());

  if (error || !data) return [];

  // Bucket revenue by hour
  const byHour: Record<number, number> = {};
  for (const order of data) {
    const hr = new Date(order.created_at).getHours();
    byHour[hr] = (byHour[hr] ?? 0) + Number(order.total);
  }

  // Return operating hours 8 AM – current hour + 1
  const START = 8;
  const END   = Math.min(currentHr + 1, 24);
  return Array.from({ length: END - START }, (_, i) => {
    const h = START + i;
    return {
      hour:      h,
      label:     hourLabel(h),
      revenue:   byHour[h] ?? 0,
      isPrimary: (byHour[h] ?? 0) > 0,
    };
  });
}

// ─── getTopSellingItems ───────────────────────────────────────────────────────

export async function getTopSellingItems(restaurantId: string, limit = 4): Promise<TopSellingItem[]> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("order_items")
    .select(`
      quantity,
      menu_item:menu_items (
        id,
        name,
        price,
        image_url,
        category:menu_categories ( name )
      ),
      order:orders!inner ( restaurant_id, status, created_at )
    `)
    .eq("order.restaurant_id", restaurantId)
    .neq("order.status", "cancelled")
    .gte("order.created_at", todayStart());

  if (error || !data) return [];

  // Aggregate by menu item
  const agg: Record<string, { item: TopSellingItem; count: number }> = {};

  for (const row of data) {
    const mi = row.menu_item as {
      id: string; name: string; price: number;
      image_url: string | null;
      category: { name: string } | null;
    } | null;

    if (!mi) continue;

    if (!agg[mi.id]) {
      agg[mi.id] = {
        count: 0,
        item: {
          menuItemId: mi.id,
          name:       mi.name,
          category:   mi.category?.name ?? "Uncategorized",
          price:      Number(mi.price),
          orderCount: 0,
          imageSrc:   mi.image_url,
        },
      };
    }
    agg[mi.id].count += Number(row.quantity);
  }

  return Object.values(agg)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(({ item, count }) => ({ ...item, orderCount: count }));
}

// ─── getInventoryAlerts ───────────────────────────────────────────────────────

export async function getInventoryAlerts(restaurantId: string, limit = 3): Promise<InventoryAlert[]> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("inventory_items")
    .select("id, name, quantity, unit, reorder_point, status")
    .eq("restaurant_id", restaurantId)
    .in("status", ["low_stock", "out_of_stock"])
    .order("status", { ascending: false }) // out_of_stock first
    .order("quantity", { ascending: true })
    .limit(limit);

  if (error || !data) return [];

  return data.map((item) => {
    const qty     = Number(item.quantity);
    const reorder = Number(item.reorder_point);
    // Stock percent relative to reorder point (0% = at or below, 100% = 2× reorder)
    const stockPercent = reorder > 0
      ? Math.min(100, Math.round((qty / (reorder * 2)) * 100))
      : 0;

    return {
      id:           item.id,
      name:         item.name,
      quantity:     qty,
      unit:         item.unit,
      reorderPoint: reorder,
      stockPercent,
      status:       item.status as InventoryAlert["status"],
    };
  });
}
