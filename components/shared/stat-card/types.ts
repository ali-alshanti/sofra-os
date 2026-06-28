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

export interface StatCardProps {
  title: string;
  value: string;
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
