import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ORDERS_COLUMNS = [
  { key: "orderId",   label: "Order ID",   className: "w-[110px]" },
  { key: "table",     label: "Table",      className: "w-[90px]"  },
  { key: "customer",  label: "Customer",   className: ""          },
  { key: "waiter",    label: "Waiter",     className: ""          },
  { key: "items",     label: "Items",      className: "w-[70px] text-center" },
  { key: "total",     label: "Total",      className: "w-[100px] text-right" },
  { key: "status",    label: "Status",     className: "w-[120px]" },
  { key: "createdAt", label: "Created At", className: "w-[130px]" },
  { key: "actions",   label: "",           className: "w-[48px]"  },
] as const;

export type OrderColumnKey = (typeof ORDERS_COLUMNS)[number]["key"];

export function OrdersTableHeader() {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent border-border">
        {ORDERS_COLUMNS.map((col) => (
          <TableHead
            key={col.key}
            className={`typography-caption uppercase tracking-widest text-muted-foreground font-medium ${col.className}`}
          >
            {col.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
