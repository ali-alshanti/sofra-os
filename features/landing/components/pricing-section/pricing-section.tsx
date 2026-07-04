"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PLANS = ["starter", "professional", "enterprise"] as const;

export function PricingSection() {
  const t = useTranslations("landing.pricing");

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
        <p className="typography-body-lg mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan, i) => {
          const isFeatured = plan === "professional";
          const features = t.raw(`${plan}.features`) as string[];

          return (
            <motion.div
              key={plan}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative"
            >
              {isFeatured && (
                <Badge className="absolute -top-3 inset-s-7 z-10 bg-primary text-primary-foreground">
                  {t("mostPopular")}
                </Badge>
              )}

              <Card
                className={cn(
                  "flex h-full flex-col p-7",
                  isFeatured
                    ? "border-primary/40 shadow-(--shadow-elevated) ring-2 ring-primary/30 lg:scale-[1.03]"
                    : "border-border/80",
                )}
              >
                <h3 className="text-lg font-semibold">{t(`${plan}.name`)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(`${plan}.description`)}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-extrabold">{t(`${plan}.price`)}</span>
                  {plan !== "enterprise" && (
                    <span className="text-sm text-muted-foreground">{t("perMonth")}</span>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button asChild className="mt-7 w-full" variant={isFeatured ? "default" : "outline"}>
                  <Link href="/login">{t("cta")}</Link>
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
