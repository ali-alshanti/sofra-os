"use client";

import { UtensilsCrossed } from "lucide-react";
import { ChartCard } from "@/components/shared/chart-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { MenuItemRow, type MenuItemRowData } from "./menu-item-row";
import { useTopSellingItems } from "@/lib/hooks/use-dashboard";
import { formatCurrency } from "@/lib/utils/format-currency";

export function PopularItemsCard() {
  const { data, isLoading, error } = useTopSellingItems();

  const rows: MenuItemRowData[] = (data ?? []).map((item) => ({
    name:     item.name,
    category: item.category,
    price:    formatCurrency(item.price),
    orders:   `${item.orderCount} orders`,
    trend:    "",
    trendUp:  true,
    imageSrc: item.imageSrc ?? undefined,
  }));

  return (
    <ChartCard
      title="Popular Items"
      loading={isLoading}
      empty={!isLoading && rows.length === 0}
      actions={
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
          View Analytics
        </Button>
      }
    >
      {error ? (
        <p className="typography-small text-muted-foreground py-4 text-center">
          Failed to load popular items.
        </p>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No orders yet today"
          description="Popular items will appear once orders are placed."
          className="border-0 bg-transparent py-8"
        />
      ) : (
        <div className="space-y-1">
          {rows.map((item) => (
            <MenuItemRow key={item.name} item={item} />
          ))}
        </div>
      )}
    </ChartCard>
  );
}
