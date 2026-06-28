import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  InventoryCategory,
  Supplier,
  InventoryStatus,
  InventoryFiltersValue,
} from "@/features/inventory/types";

// ─── Static options ───────────────────────────────────────────────────────────

const STOCK_STATUS_OPTIONS: { value: InventoryStatus | "all"; label: string }[] = [
  { value: "all",          label: "Stock: All Status" },
  { value: "in_stock",     label: "In Stock"          },
  { value: "low_stock",    label: "Low Stock"         },
  { value: "out_of_stock", label: "Out of Stock"      },
];

// ─── Props ─────────────────────────────────────────────────────────────────────

interface InventoryFiltersProps {
  value: InventoryFiltersValue;
  categories?: InventoryCategory[];
  suppliers?: Supplier[];
  onSearchChange?: (search: string) => void;
  onCategoryChange?: (categoryId: string) => void;
  onSupplierChange?: (supplierId: string) => void;
  onStatusChange?: (status: InventoryStatus | "all") => void;
  disabled?: boolean;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function InventoryFilters({
  value,
  categories = [],
  suppliers = [],
  onSearchChange,
  onCategoryChange,
  onSupplierChange,
  onStatusChange,
  disabled = false,
  className,
}: InventoryFiltersProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl p-4",
        "flex flex-col lg:flex-row items-center gap-4",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      {/* Search */}
      <div className="relative flex-1 w-full lg:w-auto">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="Search inventory by name, SKU or brand..."
          aria-label="Search inventory"
          value={value.search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full pl-11 h-11 bg-background text-sm"
          disabled={disabled}
        />
      </div>

      {/* Select group */}
      <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
        {/* Category */}
        <Select
          value={value.categoryId}
          onValueChange={onCategoryChange}
          disabled={disabled}
        >
          <SelectTrigger className="h-11 w-[170px] bg-background text-sm">
            <SelectValue placeholder="Category: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Category: All</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Supplier */}
        <Select
          value={value.supplierId}
          onValueChange={onSupplierChange}
          disabled={disabled}
        >
          <SelectTrigger className="h-11 w-[170px] bg-background text-sm">
            <SelectValue placeholder="Supplier: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Supplier: All</SelectItem>
            {suppliers.map((sup) => (
              <SelectItem key={sup.id} value={sup.id}>
                {sup.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Stock Status */}
        <Select
          value={value.status}
          onValueChange={(v) => onStatusChange?.(v as InventoryStatus | "all")}
          disabled={disabled}
        >
          <SelectTrigger className="h-11 w-[170px] bg-background text-sm">
            <SelectValue placeholder="Stock: All Status" />
          </SelectTrigger>
          <SelectContent>
            {STOCK_STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
