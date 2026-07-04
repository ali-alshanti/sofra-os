"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection() {
  const t = useTranslations("landing.faq");
  const items = t.raw("items") as FaqItem[];

  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
        <p className="typography-body-lg mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Accordion type="single" collapsible className="mt-10">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
