import { UtensilsCrossed } from "lucide-react";
import { MenuCard } from "@/features/menu/components/menu-card";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import type { MenuItem, MenuCardProps } from "@/features/menu/components/menu-card";

// ─── Loading skeleton ──────────────────────────────────────────────────────────

function MenuCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card overflow-hidden animate-pulse">
      <div className="h-48 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="h-5 w-14 rounded bg-muted" />
        </div>
        <div className="h-3 w-full rounded bg-muted/60" />
        <div className="h-3 w-4/5 rounded bg-muted/60" />
        <div className="pt-2 flex justify-between items-center border-t border-border/20">
          <div className="h-3 w-20 rounded bg-muted/60" />
          <div className="h-5 w-10 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────────

type MenuCardCallbacks = Pick<
  MenuCardProps,
  "onAvailabilityChange" | "onEdit" | "onDuplicate" | "onDelete"
>;

interface MenuGridProps extends MenuCardCallbacks {
  items: MenuItem[];
  loading?: boolean;
  className?: string;
}

// ─── MenuGrid ─────────────────────────────────────────────────────────────────

const GRID_CLASSES =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export function MenuGrid({
  items,
  loading = false,
  onAvailabilityChange,
  onEdit,
  onDuplicate,
  onDelete,
  className,
}: MenuGridProps) {
  if (loading) {
    return (
      <div className={cn(GRID_CLASSES, className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <MenuCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={UtensilsCrossed}
        title="No items in this category"
        description="Add your first menu item to get started."
        className={className}
      />
    );
  }

  return (
    <div className={cn(GRID_CLASSES, className)}>
      {items.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          onAvailabilityChange={onAvailabilityChange}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
