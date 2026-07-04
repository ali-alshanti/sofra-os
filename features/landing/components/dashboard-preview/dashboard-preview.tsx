"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MockupFrame } from "@/features/landing/components/mockup-frame";
import { ScreenMockup, type ScreenVariant } from "@/features/landing/components/screen-mockup";

const TABS: ScreenVariant[] = [
  "dashboard",
  "orders",
  "kitchen",
  "menu",
  "inventory",
  "reports",
  "settings",
];

export function DashboardPreview() {
  const t = useTranslations("landing.preview");
  const [active, setActive] = useState<ScreenVariant>("dashboard");

  return (
    <section id="preview" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
        <p className="typography-body-lg mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Tabs
        value={active}
        onValueChange={(v) => setActive(v as ScreenVariant)}
        className="mt-12 items-center"
      >
        <TabsList className="mx-auto flex h-auto flex-wrap justify-center gap-1 bg-muted p-1">
          {TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="px-3.5 py-1.5">
              {t(`tabs.${tab}`)}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <MockupFrame className="mx-auto max-w-5xl shadow-xl">
                <ScreenMockup variant={active} />
              </MockupFrame>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>
    </section>
  );
}
