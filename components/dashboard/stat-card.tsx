import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TrendDirection = "up" | "down" | "neutral";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    direction: TrendDirection;
  };
}

const TREND_CONFIG: Record<
  TrendDirection,
  { icon: LucideIcon; className: string }
> = {
  up:      { icon: TrendingUp,   className: "text-emerald-600 dark:text-emerald-400" },
  down:    { icon: TrendingDown, className: "text-destructive" },
  neutral: { icon: Minus,        className: "text-muted-foreground" },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatCardProps) {
  const trendConfig = trend ? TREND_CONFIG[trend.direction] : null;
  const TrendIcon = trendConfig?.icon;

  return (
    <Card className="shadow-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="typography-small font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>

        {(trend || description) && (
          <div className="mt-4 flex items-center gap-1.5">
            {trend && TrendIcon && trendConfig && (
              <span
                className={cn(
                  "flex items-center gap-0.5 typography-small font-medium",
                  trendConfig.className,
                )}
              >
                <TrendIcon className="h-3.5 w-3.5" />
                {trend.value}
              </span>
            )}
            {description && (
              <span className="typography-small text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
