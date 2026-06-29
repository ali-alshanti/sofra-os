"use client";

import { UtensilsCrossed } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChartCard } from "@/components/shared/chart-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { MenuItemRow, type MenuItemRowData } from "./menu-item-row";
import { useTopSellingItems } from "@/lib/hooks/use-dashboard";
import { formatCurrency } from "@/lib/utils/format-currency";

export function PopularItemsCard() {
  const t   = useTranslations("dashboard.topItems");
  const tc  = useTranslations("common.status");
  const { data, isLoading, error } = useTopSellingItems();

  const rows: MenuItemRowData[] = (data ?? []).map((item) => ({
    name:     item.name,
    category: item.category,
    price:    formatCurrency(item.price),
    orders:   t("orders", { count: item.orderCount }),
    trend:    "",
    trendUp:  true,
    imageSrc: item.imageSrc ?? undefined,
  }));

  return (
    <ChartCard
      title={t("title")}
      loading={isLoading}
      empty={!isLoading && rows.length === 0}
    >
      {error ? (
        <p className="typography-small text-muted-foreground py-4 text-center">
          {tc("error")}
        </p>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title={t("empty")}
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
