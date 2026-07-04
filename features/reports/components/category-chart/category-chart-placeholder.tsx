"use client";

// Static placeholder — replaced with a real chart library when ready.
// Renders a horizontal bar chart using only CSS — no dependencies.

import { useTranslations } from "next-intl";

const PLACEHOLDER_CATEGORIES = [
  { key: "mains",     percentage: 100, revenue: "$12,400" },
  { key: "beverages", percentage: 72,  revenue: "$8,928"  },
  { key: "starters",  percentage: 55,  revenue: "$6,820"  },
  { key: "desserts",  percentage: 38,  revenue: "$4,712"  },
  { key: "specials",  percentage: 24,  revenue: "$2,976"  },
] as const;

const BAR_COLORS = [
  "oklch(0.596 0.145 163.225)",  // emerald-600
  "oklch(0.696 0.170 162.480)",  // emerald-500
  "oklch(0.765 0.177 163.223)",  // emerald-400
  "oklch(0.845 0.143 164.978)",  // emerald-300
  "oklch(0.704 0.040 256.788)",  // slate-400  — visible on both light and dark
] as const;

export function CategoryChartPlaceholder() {
  const t = useTranslations("reports");

  return (
    <div className="space-y-4">
      {PLACEHOLDER_CATEGORIES.map(({ key, percentage, revenue }, i) => (
        <div key={key} className="space-y-1.5">
          {/* Label row */}
          <div className="flex justify-between items-center">
            <span className="typography-small font-medium text-foreground">
              {t(`categories.${key}`)}
            </span>
            <span className="typography-small text-muted-foreground" dir="ltr">
              {revenue}
            </span>
          </div>

          {/* Bar track */}
          <div className="h-2.5 w-full rounded-full bg-muted/40">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width:      `${percentage}%`,
                background: BAR_COLORS[i] ?? BAR_COLORS[BAR_COLORS.length - 1],
              }}
            />
          </div>
        </div>
      ))}

      {/* Legend */}
      <p className="typography-caption text-muted-foreground pt-2">
        {t("categoryChart.caption")}
      </p>
    </div>
  );
}
