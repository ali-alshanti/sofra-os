import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatRelativeDate } from "@/lib/utils/format-date";
import { InventoryStatusBadge } from "@/features/inventory/components/inventory-status-badge";
import type { InventoryItem, InventoryStatus } from "@/features/inventory/types";

// ─── Quantity color per status ────────────────────────────────────────────────

const QUANTITY_COLOR: Record<InventoryStatus, string> = {
  in_stock:     "text-foreground",
  low_stock:    "text-[#f69f0d]",
  out_of_stock: "text-destructive",
};

// ─── Category badge ───────────────────────────────────────────────────────────

function CategoryBadge({ name }: { name: string }) {
  return (
    <span className="px-2 py-1 bg-muted rounded text-xs font-medium text-foreground">
      {name}
    </span>
  );
}

// ─── Actions menu ─────────────────────────────────────────────────────────────

function InventoryActionsMenu({
  item,
  onView,
  onEdit,
  onDelete,
}: {
  item: InventoryItem;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreVertical size={16} />
          <span className="sr-only">Item actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem className="gap-2" onClick={() => onView?.(item.id)}>
          <Eye size={14} /> View Details
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2" onClick={() => onEdit?.(item.id)}>
          <Pencil size={14} /> Edit Item
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-destructive focus:text-destructive"
          onClick={() => onDelete?.(item.id)}
        >
          <Trash2 size={14} /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── InventoryRow ─────────────────────────────────────────────────────────────

interface InventoryRowProps {
  item: InventoryItem;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function InventoryRow({ item, onView, onEdit, onDelete }: InventoryRowProps) {
  const updatedDate =
    item.lastUpdated instanceof Date ? item.lastUpdated : new Date(item.lastUpdated);

  return (
    <TableRow className="group border-border hover:bg-primary/[0.02] transition-colors">
      {/* Item — thumbnail + name */}
      <TableCell className="py-4 px-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-muted">
            {item.imageSrc && (
              <img
                src={item.imageSrc}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className="font-bold text-sm text-foreground">{item.name}</span>
        </div>
      </TableCell>

      {/* SKU */}
      <TableCell className="py-4 px-3 text-[14px] text-muted-foreground font-mono">
        {item.sku}
      </TableCell>

      {/* Category */}
      <TableCell className="py-4 px-3">
        <CategoryBadge name={item.category.name} />
      </TableCell>

      {/* Supplier */}
      <TableCell className="py-4 px-3 text-sm text-foreground">
        {item.supplier.name}
      </TableCell>

      {/* Quantity + Unit */}
      <TableCell className="py-4 px-3">
        <span className={cn("font-bold text-sm", QUANTITY_COLOR[item.status])}>
          {item.quantity}
        </span>{" "}
        <span className="text-xs text-muted-foreground font-normal">{item.unit}</span>
      </TableCell>

      {/* Reorder point */}
      <TableCell className="py-4 px-3 text-[14px] text-muted-foreground font-mono">
        {item.reorderPoint}
      </TableCell>

      {/* Status */}
      <TableCell className="py-4 px-3">
        <InventoryStatusBadge status={item.status} />
      </TableCell>

      {/* Last Updated */}
      <TableCell className="py-4 px-3 text-xs text-muted-foreground whitespace-nowrap">
        {formatRelativeDate(updatedDate)}
      </TableCell>

      {/* Actions */}
      <TableCell className="py-4 px-3 text-right">
        <InventoryActionsMenu
          item={item}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}
