import type { ReactNode } from "react";
import { Package } from "lucide-react";
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
import { InventoryRow } from "@/features/inventory/components/inventory-row";
import type { InventoryItem } from "@/features/inventory/types";

// ─── Column key order (widths preserved) ─────────────────────────────────────

const COLUMN_KEYS = [
  { key: "item",        className: ""     },
  { key: "sku",         className: "w-24" },
  { key: "category",    className: "w-28" },
  { key: "supplier",    className: ""     },
  { key: "quantity",    className: "w-24" },
  { key: "reorder",     className: "w-24" },
  { key: "status",      className: "w-32" },
  { key: "lastUpdated", className: "w-28" },
  { key: "actions",     className: "w-10" },
] as const;

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SkeletonRow({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TableRow key={i} className="border-border animate-pulse">
          {COLUMN_KEYS.map((col) => (
            <TableCell key={col.key} className={cn("py-4 px-3", col.className)}>
              <div className="h-4 rounded bg-muted" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface InventoryTableProps {
  items: InventoryItem[];
  loading?: boolean;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
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
  const t      = useTranslations("inventory.table");
  const tempty = useTranslations("inventory.empty");

  const isEmpty = !loading && items.length === 0;

  const COLUMNS = [
    { key: "item",        label: t("item"),     className: ""     },
    { key: "sku",         label: t("sku"),      className: "w-24" },
    { key: "category",    label: t("category"), className: "w-28" },
    { key: "supplier",    label: t("supplier"), className: ""     },
    { key: "quantity",    label: t("quantity"), className: "w-24" },
    { key: "reorder",     label: t("reorder"),  className: "w-24" },
    { key: "status",      label: t("status"),   className: "w-32" },
    { key: "lastUpdated", label: t("updated"),  className: "w-28" },
    { key: "actions",     label: "",            className: "w-10" },
  ] as const;

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl overflow-hidden shadow-sm",
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
                    "py-4 px-3 typography-caption uppercase tracking-widest text-muted-foreground font-medium",
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
              <SkeletonRow count={5} />
            ) : isEmpty ? (
              <TableRow className="border-0 hover:bg-transparent">
                <TableCell colSpan={COLUMNS.length} className="py-0">
                  <EmptyState
                    icon={Package}
                    title={tempty("title")}
                    description={tempty("description")}
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

      {/* Pagination slot */}
      {pagination && (
        <div className="border-t border-border px-6 py-4">{pagination}</div>
      )}
    </div>
  );
}
