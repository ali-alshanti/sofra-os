import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  CustomerFiltersValue,
  CustomerSegment,
  CustomerLoyaltyFilter,
  CustomerStatus,
} from "@/features/customers/types";

// ─── Static options ───────────────────────────────────────────────────────────

const SEGMENT_OPTIONS: { value: CustomerSegment | "all"; label: string }[] = [
  { value: "all",     label: "Customer Type" },
  { value: "regular", label: "Regular"       },
  { value: "vip",     label: "VIP"           },
];

const LOYALTY_OPTIONS: { value: CustomerLoyaltyFilter; label: string }[] = [
  { value: "all",      label: "Loyalty Level" },
  { value: "platinum", label: "Platinum"      },
  { value: "gold",     label: "Gold"          },
  { value: "silver",   label: "Silver"        },
  { value: "bronze",   label: "Bronze"        },
];

const STATUS_OPTIONS: { value: CustomerStatus | "all"; label: string }[] = [
  { value: "all",      label: "Visit Status" },
  { value: "active",   label: "Active"       },
  { value: "vip",      label: "VIP"          },
  { value: "inactive", label: "Inactive"     },
];

// ─── Props ─────────────────────────────────────────────────────────────────────

interface CustomerFiltersProps {
  value: CustomerFiltersValue;
  onSearchChange?: (search: string) => void;
  onSegmentChange?: (segment: CustomerSegment) => void;
  onLoyaltyChange?: (loyalty: CustomerLoyaltyFilter) => void;
  onStatusChange?: (status: CustomerStatus | "all") => void;
  disabled?: boolean;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function CustomerFilters({
  value,
  onSearchChange,
  onSegmentChange,
  onLoyaltyChange,
  onStatusChange,
  disabled = false,
  className,
}: CustomerFiltersProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-4",
        "flex flex-wrap items-center gap-4",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      {/* Search */}
      <div className="relative flex-1 min-w-[300px]">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
        />
        <Input
          type="search"
          placeholder="Search by name, email, or phone..."
          aria-label="Search customers"
          value={value.search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full pl-10 h-10 bg-background text-sm"
          disabled={disabled}
        />
      </div>

      {/* Selects + filter button */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Segment */}
        <Select
          value={value.segment}
          onValueChange={(v) => onSegmentChange?.(v as CustomerSegment)}
          disabled={disabled}
        >
          <SelectTrigger className="h-10 w-40 bg-background text-sm">
            <SelectValue placeholder="Customer Type" />
          </SelectTrigger>
          <SelectContent>
            {SEGMENT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Loyalty */}
        <Select
          value={value.loyalty}
          onValueChange={(v) => onLoyaltyChange?.(v as CustomerLoyaltyFilter)}
          disabled={disabled}
        >
          <SelectTrigger className="h-10 w-40 bg-background text-sm">
            <SelectValue placeholder="Loyalty Level" />
          </SelectTrigger>
          <SelectContent>
            {LOYALTY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={value.status}
          onValueChange={(v) => onStatusChange?.(v as CustomerStatus | "all")}
          disabled={disabled}
        >
          <SelectTrigger className="h-10 w-40 bg-background text-sm">
            <SelectValue placeholder="Visit Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter icon button */}
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0"
          disabled={disabled}
          aria-label="Advanced filters"
        >
          <SlidersHorizontal size={16} />
        </Button>
      </div>
    </div>
  );
}
