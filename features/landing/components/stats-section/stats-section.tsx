"use client";

import { useTranslations } from "next-intl";
import { useCountUp } from "@/features/landing/lib/use-count-up";

const STATS = [
  { key: "ordersProcessed", target: 250000, suffix: "+" },
  { key: "restaurantsManaged", target: 1200, suffix: "+" },
  { key: "avgResponseTime", target: 120, suffix: "ms", prefix: "<" },
  { key: "customerSatisfaction", target: 98, suffix: "%" },
] as const;

function StatTile({
  labelKey,
  target,
  prefix,
  suffix,
}: {
  labelKey: (typeof STATS)[number]["key"];
  target: number;
  prefix?: string;
  suffix: string;
}) {
  const t = useTranslations("landing.stats");
  const { ref, value } = useCountUp(target);

  return (
    <div className="text-center">
      <div ref={ref as React.RefObject<HTMLDivElement>} className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl">
        {prefix}
        {value.toLocaleString()}
        {suffix}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{t(labelKey)}</p>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="border-y border-border bg-muted/30 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 sm:grid-cols-4">
        {STATS.map((stat) => (
          <StatTile
            key={stat.key}
            labelKey={stat.key}
            target={stat.target}
            prefix={"prefix" in stat ? stat.prefix : undefined}
            suffix={stat.suffix}
          />
        ))}
      </div>
    </section>
  );
}
