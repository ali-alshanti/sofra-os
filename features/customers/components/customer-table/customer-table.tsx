"use client";

import type { ReactNode } from "react";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { CustomerRow } from "@/features/customers/components/customer-row";
import type { Customer } from "@/features/customers/types";

// ─── Column keys ──────────────────────────────────────────────────────────────

const COLUMN_KEYS = ["customer", "contact", "visits", "lastVisit", "totalSpent", "loyalty", "status", "actions"] as const;

const COLUMN_WIDTHS: Record<(typeof COLUMN_KEYS)[number], string> = {
  customer:   "",
  contact:    "",
  visits:     "w-20",
  lastVisit:  "w-32",
  totalSpent: "w-32",
  loyalty:    "w-32",
  status:     "w-28",
  actions:    "w-16 text-center",
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SkeletonRow({ colCount }: { colCount: number }) {
  return (
    <TableRow className="border-border animate-pulse">
      {Array.from({ length: colCount }).map((_, i) => (
        <TableCell key={i} className="px-6 py-4">
          <div className="h-4 rounded bg-muted" />
        </TableCell>
      ))}
    </TableRow>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CustomerTableProps {
  customers:  Customer[];
  loading?:   boolean;
  onView?:    (id: string) => void;
  onEdit?:    (id: string) => void;
  onDelete?:  (id: string) => void;
  pagination?: ReactNode;
  className?: string;
}

// ─── CustomerTable ────────────────────────────────────────────────────────────

export function CustomerTable({
  customers,
  loading = false,
  onView,
  onEdit,
  onDelete,
  pagination,
  className,
}: CustomerTableProps) {
  const t  = useTranslations("customers.table");
  const te = useTranslations("customers.empty");

  const isEmpty = !loading && customers.length === 0;

  return (
    <div className={cn("glass-card rounded-2xl overflow-hidden shadow-sm", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 border-border hover:bg-muted/40">
            {COLUMN_KEYS.map((key) => (
              <TableHead
                key={key}
                className={cn(
                  "px-6 py-4 typography-caption uppercase tracking-widest text-muted-foreground font-medium",
                  COLUMN_WIDTHS[key],
                )}
              >
                {t(key)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-border/20">
          {loading ? (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} colCount={COLUMN_KEYS.length} />
              ))}
            </>
          ) : isEmpty ? (
            <TableRow className="border-0 hover:bg-transparent">
              <TableCell colSpan={COLUMN_KEYS.length} className="py-0">
                <EmptyState
                  icon={Users}
                  title={te("title")}
                  description={te("description")}
                  className="border-0 bg-transparent"
                />
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <CustomerRow
                key={customer.id}
                customer={customer}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>

      {pagination && (
        <div className="border-t border-border/30 px-6 py-4">{pagination}</div>
      )}
    </div>
  );
}
