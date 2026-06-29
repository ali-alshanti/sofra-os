"use client";

import { useTranslations } from "next-intl";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ORDERS_COLUMN_KEYS = [
  "order", "table", "customer", "waiter", "items", "total", "status", "time", "actions",
] as const;

export type OrderColumnKey = (typeof ORDERS_COLUMN_KEYS)[number];

const COLUMN_WIDTHS: Record<OrderColumnKey, string> = {
  order:    "w-[110px]",
  table:    "w-[90px]",
  customer: "",
  waiter:   "",
  items:    "w-[70px] text-center",
  total:    "w-[100px] text-right",
  status:   "w-[120px]",
  time:     "w-[130px]",
  actions:  "w-[48px]",
};

export function OrdersTableHeader() {
  const t = useTranslations("orders.table");

  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent border-border">
        {ORDERS_COLUMN_KEYS.map((key) => (
          <TableHead
            key={key}
            className={`typography-caption uppercase tracking-widest text-muted-foreground font-medium ${COLUMN_WIDTHS[key]}`}
          >
            {key === "actions" ? "" : t(key)}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
