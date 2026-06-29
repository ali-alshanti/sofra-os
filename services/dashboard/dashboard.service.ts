import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { todayStart, yesterdayStart, yesterdayEnd } from "@/lib/utils/date";
import type {
  DashboardSummary,
  RevenueDataPoint,
  TopSellingItem,
  InventoryAlert,
} from "@/types/dashboard";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

export async function getDashboardSummary(
  restaurantId: string,
  dateRange?: { from: string; to: string },
): Promise<DashboardSummary> {
  const supabase = getSupabaseBrowserClient();
  const rangeFrom = dateRange?.from ?? todayStart();

  const [periodOrders, yesterdayOrders, tables] = await Promise.all([
    supabase
      .from("orders")
      .select("total, status")
      .eq("restaurant_id", restaurantId)
      .neq("status", "cancelled")
      .gte("created_at", rangeFrom),

    supabase
      .from("orders")
      .select("total, status")
      .eq("restaurant_id", restaurantId)
      .neq("status", "cancelled")
      .gte("created_at", yesterdayStart())
      .lte("created_at", yesterdayEnd()),

    supabase
      .from("dining_tables")
      .select("status")
      .eq("restaurant_id", restaurantId)
      .eq("is_active", true),
  ]);

  if (periodOrders.error)    throw new Error(periodOrders.error.message);
  if (yesterdayOrders.error) throw new Error(yesterdayOrders.error.message);
  if (tables.error)          throw new Error(tables.error.message);

  const todayRevenue = (periodOrders.data ?? []).reduce((s, o) => s + Number(o.total), 0);
  const yRevenue     = (yesterdayOrders.data ?? []).reduce((s, o) => s + Number(o.total), 0);
  const todayCount   = (periodOrders.data ?? []).length;
  const yCount       = (yesterdayOrders.data ?? []).length;

  const allTables   = tables.data ?? [];
  const activeCount = allTables.filter((t) => t.status === "occupied").length;
  const totalCount  = allTables.length;
  const occupancy   = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

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

export async function getRevenueAnalytics(
  restaurantId: string,
  dateRange?: { from: string; to: string },
): Promise<RevenueDataPoint[]> {
  const supabase  = getSupabaseBrowserClient();
  const rangeFrom = dateRange?.from ?? todayStart();
  const isToday   = !dateRange || dateRange.from === todayStart();

  const { data, error } = await supabase
    .from("orders")
    .select("created_at, total")
    .eq("restaurant_id", restaurantId)
    .neq("status", "cancelled")
    .gte("created_at", rangeFrom);

  if (error) throw new Error(error.message);

  if (isToday) {
    const currentHr = new Date().getHours();
    const byHour: Record<number, number> = {};
    for (const order of data ?? []) {
      const hr = new Date(order.created_at).getHours();
      byHour[hr] = (byHour[hr] ?? 0) + Number(order.total);
    }
    const START = 8;
    const END   = Math.min(currentHr + 1, 24);
    return Array.from({ length: END - START }, (_, i) => {
      const h = START + i;
      return { hour: h, label: hourLabel(h), revenue: byHour[h] ?? 0, isPrimary: (byHour[h] ?? 0) > 0 };
    });
  }

  // Multi-day view: group by date
  const byDay: Record<string, number> = {};
  for (const order of data ?? []) {
    const day = order.created_at.slice(0, 10);
    byDay[day] = (byDay[day] ?? 0) + Number(order.total);
  }
  const days = Object.keys(byDay).sort();
  return days.map((day, i) => ({
    hour:      i,
    label:     day.slice(5),   // "MM-DD"
    revenue:   byDay[day],
    isPrimary: byDay[day] > 0,
  }));
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

  if (error) throw new Error(error.message);

  const agg: Record<string, { item: TopSellingItem; count: number }> = {};

  for (const row of data ?? []) {
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
          imageSrc:   mi.image_url ?? null,
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
// Returns low/out-of-stock items with a computed stockPercent for the dashboard card.
// Intentionally separate from inventory.getLowStockItems because this shape
// includes stockPercent and is dashboard-specific.

export async function getInventoryAlerts(restaurantId: string, limit = 3): Promise<InventoryAlert[]> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("inventory_items")
    .select("id, name, quantity, unit, reorder_point, status")
    .eq("restaurant_id", restaurantId)
    .in("status", ["low_stock", "out_of_stock"])
    .order("status", { ascending: false })
    .order("quantity", { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map((item) => {
    const qty     = Number(item.quantity);
    const reorder = Number(item.reorder_point);
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
