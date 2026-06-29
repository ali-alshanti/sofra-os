"use client";

import { useState } from "react";
import { Plus, UtensilsCrossed } from "lucide-react";
import { useTranslations } from "next-intl";
import { AppShell }   from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button }     from "@/components/ui/button";
import { CategorySidebar } from "./components/category-sidebar";
import { MenuCard }        from "./components/menu-card";
import { AddMenuCard }     from "./components/add-menu-card";
import { useMenuCategories, useMenuItems, useUpdateMenuItemAvailability } from "@/lib/hooks/use-menu";

const GRID_CLASSES = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

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
        <div className="pt-2 flex justify-between border-t border-border/20">
          <div className="h-3 w-20 rounded bg-muted/60" />
          <div className="h-5 w-10 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function MenuFeature() {
  const t  = useTranslations("menu");
  const ta = useTranslations("common.actions");

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: categories = [], isLoading: catsLoading } = useMenuCategories();
  const activeCategoryId = selectedCategory || categories[0]?.id || "";

  const { data: items = [], isLoading: itemsLoading } = useMenuItems(
    activeCategoryId || undefined,
  );

  const updateAvailability = useUpdateMenuItemAvailability();
  const activeCategory     = categories.find((c) => c.id === activeCategoryId);

  function handleAvailabilityChange(itemId: string, available: boolean) {
    updateAvailability.mutate({ itemId, available });
  }

  return (
    <AppShell>
      <div className="space-y-6">

        <PageHeader
          title={t("title")}
          description={t("empty.title")}
          actions={
            <Button size="sm" className="gap-2">
              <Plus size={16} />
              {t("actions.add")}
            </Button>
          }
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">

          <CategorySidebar
            categories={catsLoading ? [] : categories}
            selectedId={activeCategoryId}
            onCategoryChange={setSelectedCategory}
            className="self-start md:sticky md:top-20"
          />

          <section className="space-y-6 min-w-0">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <h3 className="text-[24px] font-medium leading-[1.4] text-foreground">
                {activeCategory?.name ?? t("categories.all")}{" "}
                {!itemsLoading && (
                  <span className="text-base font-normal text-muted-foreground ml-2">
                    ({items.length} {ta("filter")})
                  </span>
                )}
              </h3>
            </div>

            {itemsLoading ? (
              <div className={GRID_CLASSES}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <MenuCardSkeleton key={i} />
                ))}
                <AddMenuCard />
              </div>
            ) : items.length === 0 && !catsLoading ? (
              <div className={GRID_CLASSES}>
                <div className="col-span-full">
                  <EmptyState
                    icon={UtensilsCrossed}
                    title={t("empty.category")}
                    description={t("empty.description")}
                  />
                </div>
                <AddMenuCard />
              </div>
            ) : (
              <div className={GRID_CLASSES}>
                {items.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onAvailabilityChange={handleAvailabilityChange}
                  />
                ))}
                <AddMenuCard />
              </div>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
