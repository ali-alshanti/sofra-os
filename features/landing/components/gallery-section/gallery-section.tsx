"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MockupFrame } from "@/features/landing/components/mockup-frame";
import { ScreenMockup, type ScreenVariant } from "@/features/landing/components/screen-mockup";
import { cn } from "@/lib/utils";

const DEVICES: { key: "desktop" | "laptop" | "tablet"; variant: ScreenVariant; span: string }[] = [
  { key: "desktop", variant: "dashboard", span: "sm:col-span-2" },
  { key: "laptop", variant: "reports", span: "" },
  { key: "tablet", variant: "menu", span: "" },
];

export function GallerySection() {
  const t = useTranslations("landing.gallery");
  const [open, setOpen] = useState<ScreenVariant | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
        <p className="typography-body-lg mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {DEVICES.map((device, i) => (
          <motion.button
            key={device.key}
            type="button"
            onClick={() => setOpen(device.variant)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className={cn("text-start", device.span)}
          >
            <div className="mb-2 text-sm font-medium text-muted-foreground">{t(device.key)}</div>
            <MockupFrame className="cursor-zoom-in shadow-(--shadow-card) transition-shadow hover:shadow-(--shadow-elevated)">
              <ScreenMockup variant={device.variant} />
            </MockupFrame>
          </motion.button>
        ))}
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-4xl p-0">
          <DialogTitle className="sr-only">
            {open ? t(DEVICES.find((d) => d.variant === open)?.key ?? "desktop") : ""}
          </DialogTitle>
          {open && (
            <MockupFrame className="border-0 shadow-none">
              <ScreenMockup variant={open} />
            </MockupFrame>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
