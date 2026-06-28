import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatCardProps, TrendDirection } from "./types";

// ─── Trend config ─────────────────────────────────────────────────────────────

const TREND_ICON: Record<TrendDirection, React.ElementType> = {
  up:      TrendingUp,
  down:    TrendingDown,
  neutral: Minus,
};

const TREND_STYLE: Record<TrendDirection, { bg: string; color: string }> = {
  up:      { bg: "oklch(0.845 0.143 164.978 / 0.5)", color: "oklch(0.262 0.051 172.552)" },
  down:    { bg: "oklch(0.577 0.245 27.325 / 0.12)", color: "oklch(0.577 0.245 27.325)" },
  neutral: { bg: "oklch(0.929 0.013 255.508)",       color: "oklch(0.554 0.046 257.417)" },
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="glass-card premium-shadow rounded-2xl p-6 flex flex-col justify-between min-h-35 animate-pulse border border-border">
      <div className="flex justify-between items-start">
        <div className="w-9 h-9 rounded-lg bg-muted" />
        <div className="w-14 h-5 rounded-full bg-muted" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-7 w-32 rounded bg-muted" />
      </div>
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  badge,
  badgeStyle,
  pulse = false,
  pulseLabel,
  loading = false,
  className,
}: StatCardProps) {
  if (loading) return <StatCardSkeleton />;

  const TrendIcon = trend ? TREND_ICON[trend.direction] : null;
  const trendStyle = trend ? TREND_STYLE[trend.direction] : null;

  return (
    <div
      className={cn(
        "glass-card premium-shadow rounded-2xl p-6",
        "flex flex-col justify-between min-h-35",
        "border border-border transition-all hover:border-primary/40",
        className,
      )}
    >
      {/* Top row — icon + right indicator */}
      <div className="flex justify-between items-start gap-3">
        {/* Icon container */}
        {Icon && (
          <div
            className="p-3 rounded-xl shrink-0"
            style={{
              background: iconBg ?? "var(--muted)",
              color:      iconColor ?? "var(--muted-foreground)",
            }}
          >
            <Icon size={22} />
          </div>
        )}

        {/* Right indicator: trend badge, plain badge, or pulse */}
        <div className="ml-auto">
          {trend && TrendIcon && trendStyle ? (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[13px] font-medium tracking-[0.02em]"
              style={{ background: trendStyle.bg, color: trendStyle.color }}
            >
              {trend.value}
              <TrendIcon size={14} />
            </span>
          ) : pulse ? (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {pulseLabel && (
                <span className="text-[13px] tracking-[0.02em] text-muted-foreground">
                  {pulseLabel}
                </span>
              )}
            </div>
          ) : badge && badgeStyle ? (
            <span
              className="text-xs font-bold px-2 py-1 rounded-full"
              style={{ background: badgeStyle.bg, color: badgeStyle.color }}
            >
              {badge}
            </span>
          ) : badge ? (
            <span className="text-[13px] tracking-[0.02em] text-muted-foreground">
              {badge}
            </span>
          ) : null}
        </div>
      </div>

      {/* Bottom row — label + value + description */}
      <div className="mt-4">
        <p className="typography-caption uppercase tracking-widest text-muted-foreground">
          {title}
        </p>
        <p className="mt-1 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-foreground">
          {value}
        </p>
        {description && (
          <p className="typography-small text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
