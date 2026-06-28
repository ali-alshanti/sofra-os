import { MoreHorizontal, Eye, Printer, XCircle } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/utils/string";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatTime } from "@/lib/utils/format-date";
import type { OrderStatus } from "@/features/orders/components/orders-filters";

// ─── Types ─────────────────────────────────────────────────────────────────────

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
  status: OrderStatus;
  createdAt: Date | string;
}

// ─── Status Badge ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  Exclude<OrderStatus, "all">,
  { label: string; bg: string; color: string }
> = {
  pending:   { label: "Pending",   bg: "oklch(0.962 0.059 95.617 / 0.5)",  color: "oklch(0.414 0.112 45.904)" },
  preparing: { label: "Preparing", bg: "oklch(0.968 0.007 247.896 / 0.8)", color: "oklch(0.446 0.043 257.281)" },
  ready:     { label: "Ready",     bg: "oklch(0.950 0.052 163.051 / 0.6)", color: "oklch(0.362 0.072 165.670)" },
  served:    { label: "Served",    bg: "oklch(0.968 0.007 247.896)",        color: "oklch(0.554 0.046 257.417)" },
  cancelled: { label: "Cancelled", bg: "oklch(0.577 0.245 27.325 / 0.1)",  color: "oklch(0.577 0.245 27.325)" },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  if (status === "all") return null;
  const { label, bg, color } = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full typography-caption font-medium"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}

// ─── Actions Menu ──────────────────────────────────────────────────────────────

function OrderActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreHorizontal size={16} />
          <span className="sr-only">Order actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem className="gap-2">
          <Eye size={14} /> View Details
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Printer size={14} /> Print Receipt
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
          <XCircle size={14} /> Cancel Order
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── OrderRow ─────────────────────────────────────────────────────────────────

interface OrderRowProps {
  order: OrderData;
}

export function OrderRow({ order }: OrderRowProps) {
  const createdDate =
    order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt);

  return (
    <TableRow className="border-border hover:bg-muted/30 transition-colors">
      {/* Order ID */}
      <TableCell className="font-medium text-sm text-foreground">
        #{order.id}
      </TableCell>

      {/* Table */}
      <TableCell className="typography-small text-muted-foreground">
        {order.tableNumber}
      </TableCell>

      {/* Customer */}
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={order.customer.avatarSrc} alt={order.customer.name} />
            <AvatarFallback className="text-[10px] bg-muted">
              {initials(order.customer.name)}
            </AvatarFallback>
          </Avatar>
          <span className="typography-small font-medium text-foreground truncate max-w-30">
            {order.customer.name}
          </span>
        </div>
      </TableCell>

      {/* Waiter */}
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={order.waiter.avatarSrc} alt={order.waiter.name} />
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
              {initials(order.waiter.name)}
            </AvatarFallback>
          </Avatar>
          <span className="typography-small text-foreground truncate max-w-25">
            {order.waiter.name}
          </span>
        </div>
      </TableCell>

      {/* Items Count */}
      <TableCell className="text-center">
        <span className="typography-small font-medium text-foreground">
          {order.itemsCount}
        </span>
      </TableCell>

      {/* Total */}
      <TableCell className="text-right">
        <span className="text-sm font-bold text-foreground">
          {formatCurrency(order.total)}
        </span>
      </TableCell>

      {/* Status */}
      <TableCell>
        <StatusBadge status={order.status} />
      </TableCell>

      {/* Created At */}
      <TableCell className="typography-caption text-muted-foreground whitespace-nowrap">
        {formatTime(createdDate)}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <OrderActionsMenu />
      </TableCell>
    </TableRow>
  );
}
