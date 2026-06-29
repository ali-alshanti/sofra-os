"use client";

import { MoreHorizontal, Eye, Printer, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
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
import type { OrderStatusValue, OrderData } from "@/features/orders/types";

export type { OrderData };

// ─── Status Badge ──────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<OrderStatusValue, { bg: string; color: string }> = {
  pending:   { bg: "oklch(0.962 0.059 95.617 / 0.5)",  color: "oklch(0.414 0.112 45.904)" },
  preparing: { bg: "oklch(0.968 0.007 247.896 / 0.8)", color: "oklch(0.446 0.043 257.281)" },
  ready:     { bg: "oklch(0.950 0.052 163.051 / 0.6)", color: "oklch(0.362 0.072 165.670)" },
  served:    { bg: "oklch(0.968 0.007 247.896)",        color: "oklch(0.554 0.046 257.417)" },
  cancelled: { bg: "oklch(0.577 0.245 27.325 / 0.1)",  color: "oklch(0.577 0.245 27.325)" },
};

function StatusBadge({ status }: { status: OrderStatusValue }) {
  const t = useTranslations("orders.status");
  const { bg, color } = STATUS_COLORS[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full typography-caption font-medium"
      style={{ background: bg, color }}
    >
      {t(status)}
    </span>
  );
}

// ─── Actions Menu ──────────────────────────────────────────────────────────────

function OrderActionsMenu({ orderId, onDelete }: { orderId: string; onDelete?: (id: string) => void }) {
  const t = useTranslations("orders.actions");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreHorizontal size={16} />
          <span className="sr-only">{t("view")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem className="gap-2">
          <Eye size={14} /> {t("view")}
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Printer size={14} /> {t("printReceipt")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-destructive focus:text-destructive"
          onClick={() => onDelete?.(orderId)}
        >
          <XCircle size={14} /> {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── OrderRow ─────────────────────────────────────────────────────────────────

interface OrderRowProps {
  order:    OrderData;
  onDelete?: (id: string) => void;
}

export function OrderRow({ order, onDelete }: OrderRowProps) {
  const createdDate =
    order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt);

  return (
    <TableRow className="border-border hover:bg-muted/30 transition-colors">
      <TableCell className="font-medium text-sm text-foreground">
        #{order.id}
      </TableCell>

      <TableCell className="typography-small text-muted-foreground">
        {order.tableNumber}
      </TableCell>

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

      <TableCell className="text-center">
        <span className="typography-small font-medium text-foreground">
          {order.itemsCount}
        </span>
      </TableCell>

      <TableCell className="text-right">
        <span className="text-sm font-bold text-foreground">
          {formatCurrency(order.total)}
        </span>
      </TableCell>

      <TableCell>
        <StatusBadge status={order.status} />
      </TableCell>

      <TableCell className="typography-caption text-muted-foreground whitespace-nowrap">
        {formatTime(createdDate)}
      </TableCell>

      <TableCell>
        <OrderActionsMenu orderId={order.id} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
}
