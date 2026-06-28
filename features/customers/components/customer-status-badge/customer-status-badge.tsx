import type { CustomerStatus } from "@/features/customers/types";

const STATUS_CONFIG: Record<
  CustomerStatus,
  { label: string; bg: string; color: string }
> = {
  vip: {
    label: "VIP",
    bg:    "oklch(0.879 0.169 91.605 / 0.3)",  /* tertiary-fixed/30 amber */
    color: "#2a1700",                           /* on-tertiary-fixed */
  },
  active: {
    bg:    "oklch(0.845 0.143 164.978 / 0.2)", /* primary-fixed/20 */
    color: "#0b513d",                           /* on-primary-fixed-variant */
    label: "Active",
  },
  inactive: {
    bg:    "oklch(0.929 0.013 255.508 / 0.4)", /* surface-variant/40 */
    color: "oklch(0.554 0.046 257.417)",        /* secondary / outline */
    label: "Inactive",
  },
};

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
}

export function CustomerStatusBadge({ status }: CustomerStatusBadgeProps) {
  const { label, bg, color } = STATUS_CONFIG[status];

  return (
    <span
      className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}
