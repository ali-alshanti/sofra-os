"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Users, ShoppingCart, ChefHat, CreditCard, BarChart3, ArrowRight } from "lucide-react";

const STEPS = [
  { key: "customers", icon: Users },
  { key: "orders", icon: ShoppingCart },
  { key: "kitchen", icon: ChefHat },
  { key: "payments", icon: CreditCard },
  { key: "reports", icon: BarChart3 },
] as const;

export function WorkflowSection() {
  const t = useTranslations("landing.workflow");

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
        <p className="typography-body-lg mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex w-36 flex-col items-center gap-2 rounded-xl border border-border bg-card px-4 py-5 text-center shadow-(--shadow-card)"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <span className="text-sm font-medium">{t(`steps.${step.key}`)}</span>
              </motion.div>

              {i < STEPS.length - 1 && (
                <ArrowRight className="hidden size-5 shrink-0 text-muted-foreground rtl:rotate-180 sm:block" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
