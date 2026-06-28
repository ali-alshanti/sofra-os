import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { OrdersTableHeader, ORDERS_COLUMNS } from "./orders-table-header";

// ─── Slots ─────────────────────────────────────────────────────────────────────

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="animate-pulse border-border">
          {ORDERS_COLUMNS.map((col) => (
            <TableCell key={col.key} className={col.className}>
              <div className="h-4 rounded bg-muted" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <TableRow className="border-0 hover:bg-transparent">
      <TableCell
        colSpan={ORDERS_COLUMNS.length}
        className="py-16 text-center"
      >
        <p className="typography-small text-muted-foreground">{message}</p>
      </TableCell>
    </TableRow>
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface OrdersTableProps {
  /** Rendered rows — accepts <OrderRow /> components once that ticket is built */
  children?: ReactNode;
  loading?: boolean;
  /** Pass to override the default empty message */
  emptyMessage?: string;
  /** Footer slot — use for pagination */
  footer?: ReactNode;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function OrdersTable({
  children,
  loading = false,
  emptyMessage = "No orders found.",
  footer,
  className,
}: OrdersTableProps) {
  const isEmpty =
    !loading &&
    (children === undefined ||
      children === null ||
      (Array.isArray(children) && children.length === 0));

  return (
    <div className={cn("glass-card premium-shadow rounded-[16px] overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <Table>
          <OrdersTableHeader />
          <TableBody>
            {loading  ? <LoadingRows />                     : null}
            {isEmpty  ? <EmptyRow message={emptyMessage} /> : null}
            {!loading && !isEmpty ? children               : null}
          </TableBody>
        </Table>
      </div>

      {/* Pagination or summary slot */}
      {footer && (
        <div className="border-t border-border px-6 py-3">{footer}</div>
      )}
    </div>
  );
}
