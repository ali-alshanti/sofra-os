import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Insight } from "@/features/reports/types";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface InsightCardProps {
  insight:   Insight;
  /** Icon to represent this insight visually */
  icon:      LucideIcon;
  /** Background color of the icon container */
  iconBg?:   string;
  /** Icon stroke color */
  iconColor?: string;
  /** Called when the card or its CTA is clicked */
  onClick?:  () => void;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InsightCard({
  insight,
  icon: Icon,
  iconBg    = "oklch(0.596 0.145 163.225 / 0.08)",
  iconColor = "oklch(0.596 0.145 163.225)",
  onClick,
  className,
}: InsightCardProps) {
  return (
    <div
      className={cn(
        "glass-card premium-shadow rounded-2xl p-5",
        "border border-border",
        "flex flex-col gap-4",
        "transition-all hover:border-primary/40",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: iconBg, color: iconColor }}
      >
        <Icon size={20} />
      </div>

      {/* Text */}
      <div className="flex-1 space-y-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-snug">
          {insight.headline}
        </p>
        <p className="typography-small text-muted-foreground leading-relaxed">
          {insight.body}
        </p>
      </div>

      {/* CTA */}
      {insight.cta && (
        <div className="pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-0 text-primary hover:bg-transparent hover:text-primary/80 text-xs font-medium"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = insight.cta!.href;
            }}
          >
            {insight.cta.label}
            <ArrowUpRight size={13} />
          </Button>
        </div>
      )}
    </div>
  );
}
