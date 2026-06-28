"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { CategorySidebar, type CategoryItemData } from "./components/category-sidebar";
import { MenuCard, type MenuItem } from "./components/menu-card";
import { AddMenuCard } from "./components/add-menu-card";

// ─── Placeholder Data ─────────────────────────────────────────────────────────

const CATEGORIES: CategoryItemData[] = [
  { id: "appetizers", name: "Appetizers", count: 12 },
  { id: "mains",      name: "Mains",      count: 24 },
  { id: "desserts",   name: "Desserts",   count: 8  },
  { id: "drinks",     name: "Drinks",     count: 16 },
];

const MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Saffron Sea Bass",
    description: "Wild-caught bass with aromatic saffron-infused arborio rice and spring greens.",
    price: 34.00,
    category: "mains",
    available: true,
    badge: "Best Seller",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMvSr46b0xgOg-jJriXLR9U2xLNEqf_oBtpSJ9-lmnVY4ZRBhiQJWVLRfGOrJb0qLh_kYJSsPWhNBprEIyr0I_JCEk8dm8BLYYcDlmt1jppjXDpM05mQhE3HE-xmSIuGAZJ8Zit8VKZvgnpELL6dQFIvX6RdrtNHhpydNN8ET6gOPKTGABt5vt72WLXAj4a3uhSqSDKtaHZojj36geS6eK_qlwM-C2mKa_Mg97xWa78vqVEWNF_-zrM18fWZYWrj80ikXFZlD6qA",
  },
  {
    id: "2",
    name: "Wagyu Ribeye",
    description: "12oz A5 Wagyu beef aged for 45 days, served with truffle butter bone marrow.",
    price: 85.00,
    category: "mains",
    available: true,
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgCeW9nSGsCTQEtSUUmVOh-u5WXrEHIGh3_B9ZqW38S4DCBYYk0mpGxkURiePt8jE_zTCeAdsAl4maCcU0MbIrwVt6oQOk23EOJQVkbMxB3Hrbd8Ss4U6JBjdDF_QzIknoUDnvmfpcTsp88huF9d3jtmY-uccn3OLvzJWd1JAnaoWOlkXVlS0EEzdEqvv5Emy8uBKv3iauxMRH7vvGrp6vPhlF8VO_d3igU4KnXm3RIcCcoh3SysipmSARZbyoEiy72cUfYrLzCg",
  },
  {
    id: "3",
    name: "Wild Boar Ragu",
    description: "Slow-simmered Tuscan ragu with hand-cut wide ribbons of egg pasta.",
    price: 28.00,
    category: "mains",
    available: true,
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3z4cVRbG_2qeOcKp8fIFRwpBrtKVT3JQmTZ3tUlBt3AhLDQSmzaKiBoEUbQkUbYp67STfl6oQ4AweDaIMVs0T0Re0CWPXYw6IK4orz6HzrGsanzTMms4aQJ0-H_y7uLxYlEzf5h791jprYFFz5Od_hl7vygx12zVriJRIzFpzVjaxaV6FeNdYfL6_pGZ59Kp1ExD9hErtbOYCwtqfJVbVNlpGD301LagKYyRqSxJX79kyxoIRUp1etcWg_07i5z0wDIIUSaG_Nw",
  },
  {
    id: "4",
    name: "Roasted Cauliflower",
    description: "Zatar spiced cauliflower with tahini emulsion and mint oil.",
    price: 22.00,
    category: "mains",
    available: false,
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxPdsLTfmcrL4F6pFnqOySX9QBgjHju5zzIkcwjuOAvr7d7nEQQLmZVC5EbZXo277QKKZjrsuyWfxR-AZfQabGWbUYdRbEVUmcYD8VjZwE6LUdwgoLge3-qjBsufwq289bF2vk-6vbWqlJ3WzgRW0wH4AXzz8a1CViRm2JtVc1nG5xtI0dZQSS-v4NCykqQx_LSPW5c1qjiVbq5t-Jh4lCqjF8c0ypJWBchwoT62BCO8uPT2uH9H3XDCtM6_ocm-IX-3yFEBMpcg",
  },
  {
    id: "5",
    name: "Crispy Sliders",
    description: "Buttermilk fried chicken on toasted brioche with honey-habanero glaze.",
    price: 18.00,
    category: "mains",
    available: true,
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhrzPLsWphyUtBuE5EM3ooaW2NM1cBUq6boKyflgrtjiNwIYXIT27mjM51yIIPtl1809pV4TsbrL9wBVS78UPMuxiCkFaKWknnHZkYXwfCN4U2s5x-Ng6vcNq61CAYGbwDOmImsX9mzpYHdV4l7SiMqe2xifrBm4Y4LKFvArUDcZim5sJ-OJGzvi2vGJq65GS62eCHgv3j9wtFygX4XGWOmvAICc2exrtaJykAQPNNnns1az1sjjmEx-gpFZO0CqTpt_o2K-XF3w",
  },
];

// ─── Responsive grid shared between cards and AddMenuCard ─────────────────────

const GRID_CLASSES = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

// ─── Menu Feature ─────────────────────────────────────────────────────────────

export function MenuFeature() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[1].id);
  const [items, setItems] = useState<MenuItem[]>(MENU_ITEMS);

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategory);
  const filteredItems = items.filter((item) => item.category === selectedCategory);

  function handleAvailabilityChange(id: string, available: boolean) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available } : item)),
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">

        {/* Page Header */}
        <PageHeader
          title="Menu & Categories"
          subtitle="Manage your restaurant offerings and organizational structure."
          actions={
            <Button size="sm" className="gap-2">
              <Plus size={16} />
              Add Item
            </Button>
          }
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">

          {/* Category Sidebar */}
          <CategorySidebar
            categories={CATEGORIES}
            selectedId={selectedCategory}
            onCategoryChange={setSelectedCategory}
            className="self-start md:sticky md:top-20"
          />

          {/* Right section */}
          <section className="space-y-6 min-w-0">
            {/* Section header */}
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <h3 className="text-[24px] font-medium leading-[1.4] text-foreground">
                {activeCategory?.name}{" "}
                <span className="text-base font-normal text-muted-foreground ml-2">
                  ({activeCategory?.count} Items)
                </span>
              </h3>
            </div>

            {/*
              AddMenuCard must share the same grid as MenuCard
              (Stitch design: it's the last cell in the product grid).
              MenuGrid creates its own grid wrapper, so we render
              MenuCard + AddMenuCard together here.
            */}
            <div className={GRID_CLASSES}>
              {filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAvailabilityChange={handleAvailabilityChange}
                />
              ))}
              <AddMenuCard />
            </div>
          </section>

        </div>
      </div>
    </AppShell>
  );
}
