"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  const t = useTranslations("landing.finalCta");

  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card px-8 py-16 text-center shadow-(--shadow-elevated)"
      >
        <h2 className="mx-auto max-w-xl text-3xl font-bold sm:text-4xl">{t("headline")}</h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="h-11 px-6 text-base">
            <Link href="/dashboard">{t("primaryCta")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-11 px-6 text-base">
            <Link href="/login">{t("secondaryCta")}</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
