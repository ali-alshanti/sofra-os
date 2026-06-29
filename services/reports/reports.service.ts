import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils/format-currency";
import type {
  RevenuePoint,
  CategorySales,
  Report,
  ReportType,
  ReportsFiltersValue,
} from "@/features/reports/types";

// ─── Public return types ──────────────────────────────────────────────────────

export interface DashboardReportStats {
  totalRevenue:     string;
  topCategory:      string;
  avgOrderValue:    string;
  reportsGenerated: number;
}

export interface GetGeneratedReportsResult {
  reports: Report[];
  total:   number;
}

// ─── Date range helper ────────────────────────────────────────────────────────

type DateFilters = Pick<ReportsFiltersValue, "period" | "dateFrom" | "dateTo">;

function getDateRange(filters: DateFilters): { from: string; to: string } {
  const now = new Date();
  if (filters.period === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { from: start.toISOString(), to: now.toISOString() };
  }
  if (filters.period === "7d") {
    const from = new Date(now);
    from.setDate(from.getDate() - 7);
    return { from: from.toISOString(), to: now.toISOString() };
  }
  if (filters.period === "custom" && filters.dateFrom && filters.dateTo) {
    return { from: filters.dateFrom, to: filters.dateTo };
  }
  // Default: last 30 days
  const from = new Date(now);
  from.setDate(from.getDate() - 30);
  return { from: from.toISOString(), to: now.toISOString() };
}

// ─── DB → UI mappers ──────────────────────────────────────────────────────────

function formatPeriod(start: string | null, end: string | null): string {
  if (!start) return "—";
  const s   = new Date(start);
  const e   = end ? new Date(end) : null;
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  if (!e || s.toDateString() === e.toDateString()) return fmt(s);
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth())
    return fmt(s);
  return `${fmt(s)} – ${fmt(e)}`;
}

function dbTypeToUi(type: string): ReportType {
  const map: Record<string, ReportType> = {
    sales:     "revenue",
    orders:    "revenue",
    inventory: "inventory",
    staff:     "employees",
    customers: "customers",
  };
  return map[type] ?? "revenue";
}

function dbStatusToUi(status: string): Report["status"] {
  // draft = being prepared, published = ready to download, archived = no longer active
  if (status === "published") return "ready";
  if (status === "draft")     return "generating";
  if (status === "archived")  return "ready";   // archived was published; still downloadable
  return "generating";
}

// ─── getDashboardReports ──────────────────────────────────────────────────────
// KPIs are scoped to the active date range so cards reflect the selected filters.

export async function getDashboardReports(
  restaurantId: string,
  filters: DateFilters,
): Promise<DashboardReportStats> {
  const supabase = getSupabaseBrowserClient();
  const { from, to } = getDateRange(filters);

  const [ordersRes, reportsRes, categoryRes] = await Promise.all([
    supabase
      .from("orders")
      .select("total, status")
      .eq("restaurant_id", restaurantId)
      .neq("status", "cancelled")
      .gte("created_at", from)
      .lte("created_at", to),

    supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId),

    supabase
      .from("order_items")
      .select("total_price, menu_items ( menu_categories ( name ) )")
      .eq("restaurant_id", restaurantId)
      .gte("created_at", from)
      .lte("created_at", to),
  ]);

  if (ordersRes.error)   throw new Error(ordersRes.error.message);
  if (reportsRes.error)  throw new Error(reportsRes.error.message);
  if (categoryRes.error) throw new Error(categoryRes.error.message);

  const orders       = ordersRes.data ?? [];
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  const catMap = new Map<string, number>();
  for (const item of categoryRes.data ?? []) {
    const name =
      (item.menu_items as unknown as { menu_categories: { name: string } | null } | null)
        ?.menu_categories?.name ?? "Uncategorised";
    catMap.set(name, (catMap.get(name) ?? 0) + Number(item.total_price));
  }
  let topCategory = "—";
  let topRevenue  = -1;
  for (const [name, rev] of catMap) {
    if (rev > topRevenue) { topRevenue = rev; topCategory = name; }
  }

  return {
    totalRevenue:     formatCurrency(totalRevenue),
    topCategory,
    avgOrderValue:    formatCurrency(avgOrderValue),
    reportsGenerated: reportsRes.count ?? 0,
  };
}

// ─── getRevenueReport ─────────────────────────────────────────────────────────

export async function getRevenueReport(
  restaurantId: string,
  filters: DateFilters,
): Promise<RevenuePoint[]> {
  const supabase = getSupabaseBrowserClient();
  const { from, to } = getDateRange(filters);

  const { data, error } = await supabase
    .from("orders")
    .select("created_at, total")
    .eq("restaurant_id", restaurantId)
    .neq("status", "cancelled")
    .gte("created_at", from)
    .lte("created_at", to)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const rows = data ?? [];

  if (filters.period === "today") {
    const hourMap = new Map<number, number>();
    for (const row of rows) {
      const h = new Date(row.created_at).getHours();
      hourMap.set(h, (hourMap.get(h) ?? 0) + Number(row.total));
    }
    return Array.from(hourMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([h, actual]) => {
        const d = new Date();
        d.setHours(h, 0, 0, 0);
        return {
          label: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          actual,
        };
      });
  }

  const dayMap = new Map<string, number>();
  for (const row of rows) {
    const d   = new Date(row.created_at);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dayMap.set(key, (dayMap.get(key) ?? 0) + Number(row.total));
  }
  return Array.from(dayMap.entries()).map(([label, actual]) => ({ label, actual }));
}

// ─── getCategorySalesReport ───────────────────────────────────────────────────

export async function getCategorySalesReport(
  restaurantId: string,
  filters: DateFilters,
): Promise<CategorySales[]> {
  const supabase = getSupabaseBrowserClient();
  const { from, to } = getDateRange(filters);

  const { data, error } = await supabase
    .from("order_items")
    .select("total_price, menu_items ( menu_categories ( name ) )")
    .eq("restaurant_id", restaurantId)
    .gte("created_at", from)
    .lte("created_at", to);

  if (error) throw new Error(error.message);

  const catMap = new Map<string, number>();
  for (const item of data ?? []) {
    const name =
      (item.menu_items as unknown as { menu_categories: { name: string } | null } | null)
        ?.menu_categories?.name ?? "Uncategorised";
    catMap.set(name, (catMap.get(name) ?? 0) + Number(item.total_price));
  }

  const sorted = Array.from(catMap.entries()).sort(([, a], [, b]) => b - a);
  const max    = sorted[0]?.[1] ?? 1;

  return sorted.map(([category, revenue]) => ({
    category,
    revenue,
    percentage: Math.round((revenue / max) * 100),
  }));
}

// ─── getTopSellingItemsReport ─────────────────────────────────────────────────

export interface TopSellingItem {
  name:     string;
  quantity: number;
  revenue:  number;
}

export async function getTopSellingItemsReport(
  restaurantId: string,
  filters: DateFilters,
  limit = 10,
): Promise<TopSellingItem[]> {
  const supabase = getSupabaseBrowserClient();
  const { from, to } = getDateRange(filters);

  const { data, error } = await supabase
    .from("order_items")
    .select("item_name, quantity, total_price")
    .eq("restaurant_id", restaurantId)
    .gte("created_at", from)
    .lte("created_at", to);

  if (error) throw new Error(error.message);

  const itemMap = new Map<string, { quantity: number; revenue: number }>();
  for (const row of data ?? []) {
    const existing = itemMap.get(row.item_name) ?? { quantity: 0, revenue: 0 };
    itemMap.set(row.item_name, {
      quantity: existing.quantity + row.quantity,
      revenue:  existing.revenue  + Number(row.total_price),
    });
  }

  return Array.from(itemMap.entries())
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .slice(0, limit)
    .map(([name, { quantity, revenue }]) => ({ name, quantity, revenue }));
}

// ─── getCustomerAnalytics ─────────────────────────────────────────────────────

export interface CustomerAnalytics {
  totalCustomers:  number;
  activeCustomers: number;
  vipCustomers:    number;
  avgSpend:        string;
  returningRate:   number;
}

export async function getCustomerAnalytics(restaurantId: string): Promise<CustomerAnalytics> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("customers")
    .select("status, total_spent, total_visits, loyalty")
    .eq("restaurant_id", restaurantId)
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  const rows           = data ?? [];
  const totalCustomers = rows.length;
  const activeCustomers = rows.filter((c) => c.status === "active" || c.status === "vip").length;
  const vipCustomers    = rows.filter((c) => c.status === "vip").length;
  const totalSpent      = rows.reduce((s, c) => s + Number(c.total_spent), 0);
  const avgSpend        = totalCustomers > 0 ? totalSpent / totalCustomers : 0;
  const returning       = rows.filter((c) => c.total_visits > 1).length;
  const returningRate   = totalCustomers > 0 ? Math.round((returning / totalCustomers) * 100) : 0;

  return {
    totalCustomers,
    activeCustomers,
    vipCustomers,
    avgSpend:     formatCurrency(avgSpend),
    returningRate,
  };
}

// ─── getGeneratedReports ──────────────────────────────────────────────────────

export async function getGeneratedReports(
  restaurantId: string,
  filters: Pick<ReportsFiltersValue, "reportType" | "search">,
  page     = 1,
  pageSize = 10,
): Promise<GetGeneratedReportsResult> {
  const supabase = getSupabaseBrowserClient();
  const from = (page - 1) * pageSize;
  const to   = from + pageSize - 1;

  let query = supabase
    .from("reports")
    .select("id, title, type, status, period_start, period_end, created_at", { count: "exact" })
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  if (filters.reportType && filters.reportType !== "all") {
    const dbTypeMap: Record<string, string> = {
      revenue:   "sales",
      category:  "sales",
      customers: "customers",
      employees: "staff",
      inventory: "inventory",
    };
    const dbType = dbTypeMap[filters.reportType];
    if (dbType) query = query.eq("type", dbType);
  }

  // Server-side title search — applied before pagination so count is accurate
  if (filters.search && filters.search.trim() !== "") {
    query = query.ilike("title", `%${filters.search.trim()}%`);
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw new Error(error.message);

  const reports: Report[] = (data ?? []).map((row) => ({
    id:          row.id,
    name:        row.title,
    type:        dbTypeToUi(row.type),
    status:      dbStatusToUi(row.status),
    period:      formatPeriod(row.period_start, row.period_end),
    generatedAt: row.created_at,
    downloadUrl: (row.status === "published" || row.status === "archived")
      ? `#download-${row.id}`
      : undefined,
  }));

  return { reports, total: count ?? 0 };
}
