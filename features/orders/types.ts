/** The actual status of an order — never includes "all" */
export type OrderStatusValue =
  | "pending"
  | "preparing"
  | "ready"
  | "served"
  | "cancelled";

/** Status value used in filter controls — extends with "all" sentinel */
export type OrderStatusFilter = "all" | OrderStatusValue;

export type OrderType = "all" | "dine-in" | "takeaway" | "delivery";

export interface OrderData {
  id: string;
  tableNumber: string;
  customer: {
    name: string;
    avatarSrc?: string;
  };
  waiter: {
    name: string;
    avatarSrc?: string;
  };
  itemsCount: number;
  total: number;
  status: OrderStatusValue;
  createdAt: Date | string;
}
