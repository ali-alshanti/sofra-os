export type TicketStatus   = "pending" | "preparing" | "ready" | "completed";
export type TicketPriority = "urgent" | "high" | "normal";
export type KitchenOrderType = "dine-in" | "takeaway" | "delivery";

export interface OrderItem {
  quantity: number;
  name: string;
  /** Modifier or cook preference, e.g. "Med Rare", "Extra Basil" */
  modifier?: string;
  /** True when the item is done (shown in preparing state) */
  done?: boolean;
}

export interface KitchenOrder {
  id: string;
  orderNumber: string;
  tableNumber: string;
  orderType: KitchenOrderType;
  /** Elapsed time as display string, e.g. "12:45" */
  elapsedTime: string;
  priority: TicketPriority;
  status: TicketStatus;
  items: OrderItem[];
  note?: string;
  /** Kitchen station name, e.g. "Grill", "Fryer" */
  station: string;
  /** Only shown in completed state, e.g. "12m ago" */
  clearedAt?: string;
}

export interface KitchenTicketProps {
  order: KitchenOrder;
  onAction?: (id: string, status: TicketStatus) => void;
  className?: string;
}
