import type { InventoryStatus } from "@/features/inventory/types";

// ─── Configuration map ────────────────────────────────────────────────────────
// Colors from Stitch Inventory design tokens

const STATUS_CONFIG: Record<
  InventoryStatus,
  { label: string; dot: string; bg: string; color: string }
> = {
  in_stock: {
    label: "In Stock",
    dot:   "#2b6954",                          /* primary emerald */
    bg:    "oklch(0.845 0.143 164.978 / 0.2)", /* primary-fixed-dim/20 */
    color: "#0b513d",                          /* on-primary-fixed-variant */
  },
  low_stock: {
    label: "Low Stock",
    dot:   "#653e00",                          /* on-tertiary-fixed-variant */
    bg:    "oklch(0.879 0.169 91.605 / 0.2)", /* tertiary-fixed-dim/20 */
    color: "#653e00",
  },
  out_of_stock: {
    label: "Out of Stock",
    dot:   "oklch(0.577 0.245 27.325)",        /* error / on-error-container */
    bg:    "oklch(0.577 0.245 27.325 / 0.12)", /* error-container/20 */
    color: "oklch(0.577 0.245 27.325)",
  },
};

// ─── Component ─────────────────────────────────────────────────────────────────

interface InventoryStatusBadgeProps {
  status: InventoryStatus;
}

export function InventoryStatusBadge({ status }: InventoryStatusBadgeProps) {
  const { label, dot, bg, color } = STATUS_CONFIG[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold"
      style={{ background: bg, color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: dot }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
