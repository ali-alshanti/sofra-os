"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  ChefHat,
  Package,
  UtensilsCrossed,
  CalendarClock,
  Users,
  UserCog,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES: { key: string; icon: LucideIcon }[] = [
  { key: "dashboard", icon: LayoutDashboard },
  { key: "orders", icon: ShoppingCart },
  { key: "kitchen", icon: ChefHat },
  { key: "inventory", icon: Package },
  { key: "menu", icon: UtensilsCrossed },
  { key: "reservations", icon: CalendarClock },
  { key: "customers", icon: Users },
  { key: "employees", icon: UserCog },
  { key: "reports", icon: BarChart3 },
  { key: "settings", icon: Settings },
];

export function FeaturesGrid() {
  const t = useTranslations("landing.features");

  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
        <p className="typography-body-lg mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full border-border/80 p-6 transition-shadow hover:shadow-(--shadow-elevated)">
                <CardContent className="px-0">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-base font-semibold">{t(`${feature.key}.title`)}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {t(`${feature.key}.description`)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
