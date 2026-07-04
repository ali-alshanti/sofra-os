"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";

export function WhySofraSection() {
  const t = useTranslations("landing.whyUs");
  const traditionalItems = t.raw("traditional.items") as string[];
  const sofraItems = t.raw("sofra.items") as string[];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
        <p className="typography-body-lg mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="h-full border-border/80 p-6">
            <h3 className="text-lg font-semibold text-muted-foreground">
              {t("traditional.title")}
            </h3>
            <ul className="mt-5 space-y-3">
              {traditionalItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="h-full border-primary/30 bg-primary/[0.03] p-6 ring-1 ring-primary/20">
            <h3 className="text-lg font-semibold text-primary">{t("sofra.title")}</h3>
            <ul className="mt-5 space-y-3">
              {sofraItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
