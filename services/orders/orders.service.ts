import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { todayStart } from "@/lib/utils/date";
import type { OrderData, OrderStatusValue, OrderStatusFilter } from "@/features/orders/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GetOrdersParams {
  restaurantId: string;
  page?:        number;
  pageSize?:    number;
  search?:      string;
  status?:      OrderStatusFilter;
  tableId?:     string;
  waiterId?:    string;
  orderType?:   string;
  dateFrom?:    string;
  dateTo?:      string;
}

export interface GetOrdersResult {
  orders: OrderData[];
  total:  number;
}

export interface OrdersSummary {
  totalToday:     number;
  pendingCount:   number;
  completedCount: number;
  revenueToday:   number;
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

// UI uses "dine-in" / "takeaway" / "delivery", DB uses "dine_in" etc.
function uiTypeToDb(type: string): "dine_in" | "takeaway" | "delivery" {
  if (type === "dine-in") return "dine_in";
  if (type === "takeaway") return "takeaway";
  return "delivery";
}

function dbStatusToUi(status: string): OrderStatusValue {
  const map: Record<string, OrderStatusValue> = {
    pending:   "pending",
    preparing: "preparing",
    ready:     "ready",
    served:    "served",
    cancelled: "cancelled",
  };
  return map[status] ?? "pending";
}

// ─── getOrders ────────────────────────────────────────────────────────────────

export async function getOrders({
  restaurantId,
  page     = 1,
  pageSize = 10,
  search,
  status,
  tableId,
  waiterId,
  orderType,
  dateFrom,
  dateTo,
}: GetOrdersParams): Promise<GetOrdersResult> {
  const supabase = getSupabaseBrowserClient();
  const from = (page - 1) * pageSize;
  const to   = from + pageSize - 1;

  let query = supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      status,
      type,
      total,
      created_at,
      table_id,
      dining_tables ( number ),
      customers ( full_name, avatar_url ),
      employees ( full_name, avatar_url ),
      order_items ( id )
      `,
      { count: "exact" },
    )
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  // Server-side filters — must come before .range() so count reflects filters
  if (status    && status    !== "all") query = query.eq("status",    status);
  if (tableId   && tableId   !== "all") query = query.eq("table_id",  tableId);
  if (waiterId  && waiterId  !== "all") query = query.eq("waiter_id", waiterId);
  if (orderType && orderType !== "all") query = query.eq("type",      uiTypeToDb(orderType));
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo)   query = query.lte("created_at", dateTo);

  // Server-side search on order_number and customer name
  if (search) {
    query = query.or(
      `order_number.ilike.%${search}%,customers.full_name.ilike.%${search}%`,
    );
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw new Error(error.message);

  return {
    orders: ((data ?? []) as unknown as OrderRow[]).map(mapRowToOrderData),
    total:  count ?? 0,
  };
}

// ─── getOrdersSummary ─────────────────────────────────────────────────────────

export async function getOrdersSummary(restaurantId: string): Promise<OrdersSummary> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("orders")
    .select("status, total")
    .eq("restaurant_id", restaurantId)
    .gte("created_at", todayStart())
    .neq("status", "cancelled");

  if (error) throw new Error(error.message);

  const all = data ?? [];
  return {
    totalToday:     all.length,
    pendingCount:   all.filter((o) => o.status === "pending").length,
    completedCount: all.filter((o) => o.status === "served").length,
    revenueToday:   all
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + Number(o.total), 0),
  };
}

// ─── updateOrderStatus ────────────────────────────────────────────────────────

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatusValue,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (error) throw new Error(error.message);
}

// ─── deleteOrder ──────────────────────────────────────────────────────────────

export async function deleteOrder(orderId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("orders").delete().eq("id", orderId);
  if (error) throw new Error(error.message);
}

// ─── Internal row mapper ──────────────────────────────────────────────────────

interface CustomerRow  { full_name: string; avatar_url: string | null }
interface TableRow     { number: string }
interface EmployeeRow  { full_name: string; avatar_url: string | null }

interface OrderRow {
  id:            string;
  order_number:  string;
  status:        string;
  type:          string;
  total:         number;
  created_at:    string;
  table_id:      string | null;
  dining_tables: TableRow | null;
  customers:     CustomerRow | null;
  employees:     EmployeeRow | null;
  order_items:   { id: string }[];
}

function mapRowToOrderData(row: OrderRow): OrderData {
  const table      = row.dining_tables;
  const tableLabel = table ? `Table ${table.number}` : row.type === "takeaway" ? "Takeaway" : "Delivery";

  return {
    id:          row.order_number ?? row.id.slice(0, 5),
    tableNumber: tableLabel,
    customer:    {
      name:      row.customers?.full_name ?? "Guest",
      avatarSrc: row.customers?.avatar_url ?? undefined,
    },
    waiter: {
      name:      row.employees?.full_name ?? "—",
      avatarSrc: row.employees?.avatar_url ?? undefined,
    },
    itemsCount: (row.order_items ?? []).length,
    total:      Number(row.total),
    status:     dbStatusToUi(row.status),
    createdAt:  row.created_at,
  };
}
