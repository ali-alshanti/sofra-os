import type { ReactNode } from "react";
import { Users } from "lucide-react";
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

// ─── Columns ──────────────────────────────────────────────────────────────────

const COLUMNS = [
  { key: "customer",   label: "Customer",    className: ""         },
  { key: "contact",    label: "Contact",     className: ""         },
  { key: "visits",     label: "Visits",      className: "w-20"     },
  { key: "lastVisit",  label: "Last Visit",  className: "w-32"     },
  { key: "totalSpent", label: "Total Spent", className: "w-32"     },
  { key: "loyalty",    label: "Loyalty",     className: "w-32"     },
  { key: "status",     label: "Status",      className: "w-28"     },
  { key: "actions",    label: "Actions",     className: "w-16 text-center" },
] as const;

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <TableRow className="border-border animate-pulse">
      {COLUMNS.map((col) => (
        <TableCell key={col.key} className={cn("px-6 py-4", col.className)}>
          {col.key === "customer" ? (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-28 rounded bg-muted" />
                <div className="h-2.5 w-20 rounded bg-muted/60" />
              </div>
            </div>
          ) : col.key === "contact" ? (
            <div className="space-y-1.5">
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-2.5 w-32 rounded bg-muted/60" />
            </div>
          ) : (
            <div className="h-4 rounded bg-muted" />
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface CustomerTableProps {
  customers: Customer[];
  loading?: boolean;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
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
  const isEmpty = !loading && customers.length === 0;

  return (
    <div
      className={cn(
        "glass-card rounded-2xl overflow-hidden shadow-sm",
        className,
      )}
    >
      <Table>
        {/* Header */}
        <TableHeader>
          <TableRow className="bg-muted/40 border-border hover:bg-muted/40">
            {COLUMNS.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  "px-6 py-4 typography-caption uppercase tracking-widest text-muted-foreground font-medium",
                  col.className,
                )}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody className="divide-y divide-border/20">
          {loading ? (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </>
          ) : isEmpty ? (
            <TableRow className="border-0 hover:bg-transparent">
              <TableCell colSpan={COLUMNS.length} className="py-0">
                <EmptyState
                  icon={Users}
                  title="No customers found"
                  description="Try adjusting your filters or add a new customer."
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

      {/* Pagination slot */}
      {pagination && (
        <div className="border-t border-border/30 px-6 py-4">{pagination}</div>
      )}
    </div>
  );
}
