import type { ReactNode } from "react";
import { Package } from "lucide-react";
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
import { InventoryRow } from "@/features/inventory/components/inventory-row";
import type { InventoryItem } from "@/features/inventory/types";

// ─── Column definitions ────────────────────────────────────────────────────────

const COLUMNS = [
  { key: "item",        label: "Item",         className: ""              },
  { key: "sku",         label: "SKU",          className: "w-[110px]"    },
  { key: "category",    label: "Category",     className: "w-[120px]"    },
  { key: "supplier",    label: "Supplier",     className: ""              },
  { key: "quantity",    label: "Quantity",     className: "w-[110px]"    },
  { key: "reorder",     label: "Reorder Level",className: "w-[120px]"   },
  { key: "status",      label: "Status",       className: "w-[140px]"    },
  { key: "lastUpdated", label: "Last Updated", className: "w-[140px]"    },
  { key: "actions",     label: "",             className: "w-[48px]"     },
] as const;

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <TableRow className="border-border animate-pulse">
      {COLUMNS.map((col) => (
        <TableCell key={col.key} className={cn("py-4 px-6", col.className)}>
          <div className="h-4 rounded bg-muted" />
        </TableCell>
      ))}
    </TableRow>
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface InventoryTableProps {
  items: InventoryItem[];
  loading?: boolean;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  /** Inject a shared Pagination component */
  pagination?: ReactNode;
  className?: string;
}

// ─── InventoryTable ───────────────────────────────────────────────────────────

export function InventoryTable({
  items,
  loading = false,
  onView,
  onEdit,
  onDelete,
  pagination,
  className,
}: InventoryTableProps) {
  const isEmpty = !loading && items.length === 0;

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl overflow-hidden shadow-sm",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <Table>
          {/* Header */}
          <TableHeader>
            <TableRow className="bg-muted/40 border-border hover:bg-muted/40">
              {COLUMNS.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "py-4 px-6 typography-caption uppercase tracking-widest text-muted-foreground font-medium",
                    col.className,
                  )}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody className="divide-y divide-border">
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
                    icon={Package}
                    title="No inventory items found"
                    description="Try adjusting your filters or add a new item."
                    className="border-0 bg-transparent"
                  />
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <InventoryRow
                  key={item.id}
                  item={item}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination slot */}
      {pagination && (
        <div className="border-t border-border px-6 py-4">{pagination}</div>
      )}
    </div>
  );
}
