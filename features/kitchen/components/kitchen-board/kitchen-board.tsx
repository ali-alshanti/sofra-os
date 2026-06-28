import { cn } from "@/lib/utils";
import { KitchenColumn } from "@/features/kitchen/components/kitchen-column";
import type { KitchenOrder, TicketStatus } from "@/features/kitchen/components/kitchen-ticket";

// ─── Placeholder data ─────────────────────────────────────────────────────────

export const PLACEHOLDER_ORDERS: KitchenOrder[] = [
  {
    id: "1", orderNumber: "#ORD-9021", tableNumber: "T4",
    orderType: "dine-in", elapsedTime: "12:45",
    priority: "urgent", status: "pending", station: "Grill",
    items: [
      { quantity: 2, name: "Wagyu Ribeye", modifier: "Med Rare" },
      { quantity: 1, name: "Saffron Sea Bass" },
    ],
    note: "No nuts in salad",
  },
  {
    id: "2", orderNumber: "#ORD-9025", tableNumber: "T12",
    orderType: "dine-in", elapsedTime: "04:20",
    priority: "normal", status: "pending", station: "Pizza",
    items: [
      { quantity: 3, name: "Truffle Pasta" },
      { quantity: 1, name: "Margherita", modifier: "Extra Basil" },
    ],
  },
  {
    id: "3", orderNumber: "#ORD-8998", tableNumber: "T2",
    orderType: "dine-in", elapsedTime: "08:12",
    priority: "high", status: "preparing", station: "Grill",
    items: [
      { quantity: 2, name: "Grilled Octopus", done: true },
      { quantity: 1, name: "Garden Salad", done: false },
    ],
  },
  {
    id: "4", orderNumber: "#ORD-9004", tableNumber: "T9",
    orderType: "delivery", elapsedTime: "03:55",
    priority: "normal", status: "preparing", station: "Fryer",
    items: [
      { quantity: 4, name: "Crispy Chicken Wings", done: false },
    ],
  },
  {
    id: "5", orderNumber: "#ORD-8982", tableNumber: "T6",
    orderType: "dine-in", elapsedTime: "00:00",
    priority: "normal", status: "ready", station: "Grill",
    items: [
      { quantity: 1, name: "Lamb Chops", done: true },
      { quantity: 2, name: "Hummus Plate", done: true },
    ],
  },
  {
    id: "6", orderNumber: "#ORD-8977", tableNumber: "T1",
    orderType: "dine-in", elapsedTime: "00:00",
    priority: "normal", status: "completed", station: "Grill",
    items: [], clearedAt: "12m ago",
  },
  {
    id: "7", orderNumber: "#ORD-8975", tableNumber: "T4",
    orderType: "dine-in", elapsedTime: "00:00",
    priority: "normal", status: "completed", station: "Pizza",
    items: [], clearedAt: "18m ago",
  },
];

// ─── Column definition ────────────────────────────────────────────────────────

const COLUMN_ORDER: { status: TicketStatus; title: string }[] = [
  { status: "pending",   title: "Pending"   },
  { status: "preparing", title: "Preparing" },
  { status: "ready",     title: "Ready"     },
  { status: "completed", title: "Completed" },
];

// ─── Props ─────────────────────────────────────────────────────────────────────

interface ColumnData {
  status: TicketStatus;
  orders: KitchenOrder[];
}

interface KitchenBoardProps {
  columns?: ColumnData[];
  loading?: boolean;
  onAction?: (id: string, status: TicketStatus) => void;
  className?: string;
}

function buildDefaultColumns(): ColumnData[] {
  return COLUMN_ORDER.map(({ status }) => ({
    status,
    orders: PLACEHOLDER_ORDERS.filter((o) => o.status === status),
  }));
}

// ─── KitchenBoard ─────────────────────────────────────────────────────────────

export function KitchenBoard({
  columns = buildDefaultColumns(),
  loading = false,
  onAction,
  className,
}: KitchenBoardProps) {
  return (
    <div
      className={cn(
        "flex gap-6 overflow-x-auto pb-4",
        "grid-cols-1 sm:grid-cols-2 xl:flex",
        className,
      )}
    >
      {COLUMN_ORDER.map(({ status, title }) => {
        const col = columns.find((c) => c.status === status);
        return (
          <KitchenColumn
            key={status}
            title={title}
            status={status}
            orders={col?.orders ?? []}
            loading={loading}
            onAction={onAction}
          />
        );
      })}
    </div>
  );
}
