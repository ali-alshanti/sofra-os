import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { todayStart } from "@/lib/utils/date";
import type {
  KitchenOrder,
  TicketStatus,
  TicketPriority,
  KitchenOrderType,
  OrderItem,
} from "@/features/kitchen/components/kitchen-ticket";
import type { KitchenStats } from "@/features/kitchen/components/kitchen-header";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function twoHoursAgo(): string {
  return new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
}

function elapsedDisplay(createdAt: string): string {
  const diffMin = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function derivePriority(createdAt: string): TicketPriority {
  const mins = (Date.now() - new Date(createdAt).getTime()) / 60000;
  if (mins > 15) return "urgent";
  if (mins > 8)  return "high";
  return "normal";
}

function clearedDisplay(updatedAt: string): string {
  const mins = Math.round((Date.now() - new Date(updatedAt).getTime()) / 60000);
  return `${mins}m ago`;
}

function dbTypeToUi(type: string): KitchenOrderType {
  if (type === "dine_in") return "dine-in";
  return type as KitchenOrderType;
}

function dbStatusToTicket(status: string): TicketStatus | null {
  const map: Record<string, TicketStatus> = {
    pending:   "pending",
    preparing: "preparing",
    ready:     "ready",
    served:    "completed",
  };
  return map[status] ?? null;
}

// ─── getKitchenOrders ─────────────────────────────────────────────────────────

export async function getKitchenOrders(restaurantId: string): Promise<KitchenOrder[]> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      type,
      status,
      created_at,
      updated_at,
      dining_tables ( number ),
      order_items (
        id,
        item_name,
        quantity,
        status,
        notes,
        kitchen_station
      )
    `)
    .eq("restaurant_id", restaurantId)
    .in("status", ["pending", "preparing", "ready", "served"])
    .gte("created_at", todayStart())
    .or(`status.neq.served,and(status.eq.served,updated_at.gte.${twoHoursAgo()})`)
    .order("created_at");

  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as DbOrder[]).reduce<KitchenOrder[]>((acc, order) => {
    const ticketStatus = dbStatusToTicket(order.status);
    if (!ticketStatus) return acc;

    const items   = (order.order_items ?? []) as DbOrderItem[];
    const station = items.find((i) => i.kitchen_station)?.kitchen_station ?? "General";

    const kitchenItems: OrderItem[] = items.map((i) => ({
      quantity: i.quantity,
      name:     i.item_name,
      modifier: i.notes ?? undefined,
      done:     i.status === "ready" || i.status === "served",
    }));

    const tableNum = order.dining_tables?.number
      ? `T${order.dining_tables.number}`
      : order.type === "takeaway" ? "Takeaway" : "Delivery";

    acc.push({
      id:          order.id,
      orderNumber: `#${order.order_number ?? order.id.slice(0, 6).toUpperCase()}`,
      tableNumber: tableNum,
      orderType:   dbTypeToUi(order.type),
      elapsedTime: elapsedDisplay(order.created_at),
      priority:    derivePriority(order.created_at),
      status:      ticketStatus,
      items:       kitchenItems,
      station,
      clearedAt:   ticketStatus === "completed" ? clearedDisplay(order.updated_at) : undefined,
    });

    return acc;
  }, []);
}

// ─── advanceKitchenOrderStatus ────────────────────────────────────────────────

export async function advanceKitchenOrderStatus(
  orderId: string,
  currentStatus: TicketStatus,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  type DbStatus = "pending" | "preparing" | "ready" | "served" | "cancelled";
  const nextStatus: Record<TicketStatus, DbStatus | null> = {
    pending:   "preparing",
    preparing: "ready",
    ready:     "served",
    completed: null,
  };

  const next = nextStatus[currentStatus];
  if (!next) return;

  const { error } = await supabase
    .from("orders")
    .update({ status: next })
    .eq("id", orderId);

  if (error) throw new Error(error.message);
}

// ─── getKitchenStats ──────────────────────────────────────────────────────────

export async function getKitchenStats(restaurantId: string): Promise<KitchenStats> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("orders")
    .select("status, created_at, updated_at")
    .eq("restaurant_id", restaurantId)
    .in("status", ["pending", "preparing", "ready", "served"])
    .gte("created_at", todayStart());

  if (error) throw new Error(error.message);

  const all = data ?? [];
  const completedToday = all.filter((o) => o.status === "served" || o.status === "ready");
  const avgMin = completedToday.length > 0
    ? Math.round(
        completedToday.reduce(
          (s, o) => s + (new Date(o.updated_at).getTime() - new Date(o.created_at).getTime()) / 60000,
          0,
        ) / completedToday.length,
      )
    : 0;

  return {
    activeOrders: all.filter((o) => o.status !== "served").length,
    preparing:    all.filter((o) => o.status === "preparing").length,
    ready:        all.filter((o) => o.status === "ready").length,
    avgPrepTime:  avgMin > 0 ? `${avgMin}m` : "—",
  };
}

// ─── Internal DB row types ────────────────────────────────────────────────────

interface DbOrder {
  id:           string;
  order_number: string | null;
  type:         string;
  status:       string;
  created_at:   string;
  updated_at:   string;
  dining_tables: { number: string } | null;
  order_items:   DbOrderItem[];
}

interface DbOrderItem {
  id:              string;
  item_name:       string;
  quantity:        number;
  status:          string;
  notes:           string | null;
  kitchen_station: string | null;
}
