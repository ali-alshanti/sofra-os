import { Diamond, Star, Shield, Award } from "lucide-react";
import type { CustomerLoyalty } from "@/features/customers/types";

// ─── Config ───────────────────────────────────────────────────────────────────

const LOYALTY_CONFIG: Record<
  Exclude<CustomerLoyalty, "none">,
  { label: string; bg: string; color: string; Icon: React.ElementType }
> = {
  platinum: {
    label: "Platinum",
    bg:    "oklch(0.845 0.143 164.978 / 0.3)",  /* primary-fixed/30 */
    color: "#0b513d",                            /* on-primary-fixed-variant */
    Icon:  Diamond,
  },
  gold: {
    label: "Gold",
    bg:    "oklch(0.879 0.169 91.605 / 0.4)",   /* tertiary-fixed/40 amber */
    color: "#653e00",                            /* on-tertiary-fixed-variant */
    Icon:  Star,
  },
  silver: {
    label: "Silver",
    bg:    "oklch(0.869 0.022 252.894 / 0.4)",  /* secondary-fixed-dim/40 */
    color: "oklch(0.446 0.043 257.281)",         /* on-secondary-fixed-variant */
    Icon:  Shield,
  },
  bronze: {
    label: "Bronze",
    bg:    "oklch(0.929 0.013 255.508 / 0.5)",  /* surface-variant/50 */
    color: "oklch(0.554 0.046 257.417)",         /* secondary */
    Icon:  Award,
  },
};

// ─── Component ─────────────────────────────────────────────────────────────────

interface LoyaltyBadgeProps {
  loyalty: CustomerLoyalty;
}

export function LoyaltyBadge({ loyalty }: LoyaltyBadgeProps) {
  if (loyalty === "none") return null;

  const { label, bg, color, Icon } = LOYALTY_CONFIG[loyalty];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: bg, color }}
    >
      <Icon size={13} style={{ fill: "currentColor" }} />
      {label}
    </span>
  );
}
