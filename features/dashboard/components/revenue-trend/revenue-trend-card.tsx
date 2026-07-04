"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChartCard } from "@/components/shared/chart-card";
import { useRevenueAnalytics } from "@/lib/hooks/use-dashboard";
import { RevenueChartPlaceholder } from "./revenue-chart-placeholder";
import type { RevenueDataPoint } from "@/types/dashboard";
import { presetToDateRange, type DateRange } from "@/lib/utils/date";
import { formatCurrencyCompact, formatCurrency } from "@/lib/utils/format-currency";
import { cn } from "@/lib/utils";

function RevenueLegend() {
  const t = useTranslations("dashboard.revenue");

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full" style={{ background: "oklch(0.596 0.145 163.225)" }} />
        <span className="typography-small text-muted-foreground">{t("actual")}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full opacity-30" style={{ background: "oklch(0.554 0.046 257.417)" }} />
        <span className="typography-small text-muted-foreground">{t("forecast")}</span>
      </div>
    </div>
  );
}

// Round a max value up to a "clean" gridline ceiling (e.g. 213 → 250, 1,840 → 2,000).
function niceCeiling(value: number): number {
  if (value <= 0) return 10;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const steps = [1, 2, 2.5, 5, 10];
  for (const step of steps) {
    const candidate = step * magnitude;
    if (candidate >= value) return candidate;
  }
  return 10 * magnitude;
}

function LiveRevenueChart({ data, hint }: { data: RevenueDataPoint[]; hint: string }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (data.length === 0) return <RevenueChartPlaceholder />;

  const rawMax = Math.max(...data.map((d) => d.revenue), 0);
  const axisMax = niceCeiling(rawMax || 10);
  const gridSteps = [1, 0.75, 0.5, 0.25, 0];
  const hovered = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div dir="ltr">
      <div className="relative h-64 flex items-end gap-1 ps-14">
        {/* Y-axis gridlines + labels */}
        <div className="absolute inset-0 start-0 flex flex-col justify-between pointer-events-none">
          {gridSteps.map((step) => (
            <div key={step} className="w-full flex items-center gap-2">
              <span className="typography-caption text-muted-foreground w-11 shrink-0 text-end -translate-y-1/2">
                {formatCurrencyCompact(axisMax * step)}
              </span>
              <div className="flex-1 border-t border-border/40" />
            </div>
          ))}
        </div>

        {/* Bars */}
        {data.map((point, i) => {
          const heightPct = Math.max(2, Math.round((point.revenue / axisMax) * 100));
          const isHovered = hoverIndex === i;
          return (
            <div
              key={i}
              className="relative flex-1 h-full flex items-end"
              onPointerEnter={() => setHoverIndex(i)}
              onPointerLeave={() => setHoverIndex((cur) => (cur === i ? null : cur))}
              onFocus={() => setHoverIndex(i)}
              onBlur={() => setHoverIndex((cur) => (cur === i ? null : cur))}
              tabIndex={0}
              role="img"
              aria-label={`${point.label}: ${formatCurrency(point.revenue)}`}
            >
              <div
                className={cn(
                  "w-full rounded-t-sm transition-[height,opacity]",
                  point.isPrimary ? "bg-primary" : "bg-border",
                  point.isPrimary && !isHovered && "opacity-90",
                  isHovered && "opacity-100 ring-2 ring-primary/40",
                )}
                style={{ height: `${heightPct}%` }}
              />

              {/* Hover tooltip */}
              {isHovered && (
                <div
                  className="absolute bottom-full mb-2 start-1/2 -translate-x-1/2 z-10 whitespace-nowrap rounded-lg bg-popover px-2.5 py-1.5 shadow-md ring-1 ring-foreground/10 pointer-events-none"
                >
                  <div className="text-sm font-semibold text-foreground">
                    {formatCurrency(point.revenue)}
                  </div>
                  <div className="typography-caption text-muted-foreground">
                    {point.label}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-3 ps-14">
        {[data[0], data[Math.floor(data.length / 4)], data[Math.floor(data.length / 2)], data[Math.floor(data.length * 3 / 4)], data[data.length - 1]]
          .filter(Boolean)
          .map((p, i) => (
            <span key={i} className="typography-caption text-muted-foreground">
              {p.label}
            </span>
          ))}
      </div>

      {hovered === null && (
        <p className="mt-2 typography-caption text-muted-foreground/70 text-center">
          {hint}
        </p>
      )}
    </div>
  );
}

interface RevenueTrendCardProps {
  dateRange?: DateRange;
  preset?:    "Today" | "Last 7d" | "Last 30d" | null;
}

export function RevenueTrendCard({ dateRange = presetToDateRange("Today"), preset = "Today" }: RevenueTrendCardProps) {
  const t = useTranslations("dashboard.revenue");
  const { data, isLoading } = useRevenueAnalytics(dateRange);

  const description =
    preset === "Last 7d"  ? t("descLast7d")  :
    preset === "Last 30d" ? t("descLast30d") :
    preset === null       ? t("descCustom")  :
    t("description");

  return (
    <ChartCard
      title={t("title")}
      description={description}
      loading={isLoading}
      actions={<RevenueLegend />}
    >
      <LiveRevenueChart data={data ?? []} hint={t("hoverHint")} />
    </ChartCard>
  );
}
