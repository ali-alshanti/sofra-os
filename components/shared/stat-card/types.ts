import type { LucideIcon } from "lucide-react";

export type TrendDirection = "up" | "down" | "neutral";

export interface StatCardTrend {
  value: string;
  direction: TrendDirection;
}

/** Custom colors for a styled pill badge */
export interface StatCardBadgeStyle {
  bg: string;
  color: string;
}

export type StatCardVariant = "default" | "compact";

export interface StatCardProps {
  /**
   * "default" — full card with icon container, 32px value, top-right indicator.
   * "compact" — no icon, 24px value, label-above layout (Employee KPIs style).
   */
  variant?: StatCardVariant;
  title: string;
  value: string;
  /** Optional CSS color override for the value text */
  valueColor?: string;
  description?: string;
  icon?: LucideIcon;
  /** CSS color string for the icon container background */
  iconBg?: string;
  /** CSS color string for the icon itself */
  iconColor?: string;
  /** Percentage trend with direction */
  trend?: StatCardTrend;
  /** Plain text badge label */
  badge?: string;
  /** When provided with badge, renders a colored pill instead of plain text */
  badgeStyle?: StatCardBadgeStyle;
  /** Animated pulse dot — for live/real-time states */
  pulse?: boolean;
  pulseLabel?: string;
  loading?: boolean;
  className?: string;
}
