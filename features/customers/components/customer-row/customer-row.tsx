"use client";

import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/utils/string";
import { formatDate } from "@/lib/utils/format-date";
import { formatCurrency } from "@/lib/utils/format-currency";
import { CustomerStatusBadge } from "@/features/customers/components/customer-status-badge";
import { LoyaltyBadge } from "@/features/customers/components/loyalty-badge";
import type { Customer } from "@/features/customers/types";

// ─── Actions menu ─────────────────────────────────────────────────────────────

function CustomerActionsMenu({
  customer,
  onView,
  onEdit,
  onDelete,
}: {
  customer: Customer;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreVertical size={16} />
          <span className="sr-only">Customer actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem className="gap-2" onClick={() => onView?.(customer.id)}>
          <Eye size={14} /> View Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2" onClick={() => onEdit?.(customer.id)}>
          <Pencil size={14} /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-destructive focus:text-destructive"
          onClick={() => onDelete?.(customer.id)}
        >
          <Trash2 size={14} /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── CustomerRow ──────────────────────────────────────────────────────────────

interface CustomerRowProps {
  customer: Customer;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function CustomerRow({ customer, onView, onEdit, onDelete }: CustomerRowProps) {
  const t = useTranslations("customers");

  const joinedDate =
    customer.joinedAt instanceof Date ? customer.joinedAt : new Date(customer.joinedAt);
  const lastVisitDate =
    customer.lastVisit instanceof Date ? customer.lastVisit : new Date(customer.lastVisit);

  return (
    <TableRow className="group border-border hover:bg-primary/5 transition-colors">
      {/* Customer — avatar + name + joined */}
      <TableCell className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0 border-2 border-primary/10">
            <AvatarImage src={customer.avatarSrc} alt={customer.name} />
            <AvatarFallback className="text-xs bg-muted text-muted-foreground">
              {initials(customer.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-bold text-sm text-foreground truncate">{customer.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("joined", { date: formatDate(joinedDate) })}
            </p>
          </div>
        </div>
      </TableCell>

      {/* Contact — phone + email */}
      <TableCell className="px-6 py-4">
        <p className="text-sm text-foreground">{customer.phone}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{customer.email}</p>
      </TableCell>

      {/* Visits */}
      <TableCell className="px-6 py-4">
        <p className="text-sm font-mono text-foreground">{customer.visits}</p>
      </TableCell>

      {/* Last Visit */}
      <TableCell className="px-6 py-4 text-sm text-foreground whitespace-nowrap">
        {formatDate(lastVisitDate, "en-US")}
      </TableCell>

      {/* Total Spent */}
      <TableCell className="px-6 py-4">
        <p className="text-sm font-bold text-primary">
          {formatCurrency(customer.totalSpent)}
        </p>
      </TableCell>

      {/* Loyalty */}
      <TableCell className="px-6 py-4">
        <LoyaltyBadge loyalty={customer.loyalty} />
      </TableCell>

      {/* Status */}
      <TableCell className="px-6 py-4">
        <CustomerStatusBadge status={customer.status} />
      </TableCell>

      {/* Actions */}
      <TableCell className="px-6 py-4 text-center">
        <CustomerActionsMenu
          customer={customer}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}
