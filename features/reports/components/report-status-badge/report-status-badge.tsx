import type { ReportStatus } from "@/features/reports/types";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ReportStatus,
  { label: string; bg: string; color: string }
> = {
  generating: {
    label: "Generating",
    bg:    "oklch(0.828 0.189 84.429 / 0.15)",
    color: "oklch(0.414 0.112 45.904)",
  },
  ready: {
    label: "Ready",
    bg:    "oklch(0.845 0.143 164.978 / 0.25)",
    color: "oklch(0.362 0.072 165.670)",
  },
  failed: {
    label: "Failed",
    bg:    "oklch(0.577 0.245 27.325 / 0.10)",
    color: "oklch(0.577 0.245 27.325)",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface ReportStatusBadgeProps {
  status: ReportStatus;
}

export function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  const { label, bg, color } = STATUS_CONFIG[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full typography-caption font-medium"
      style={{ background: bg, color }}
    >
      {/* Pulse dot for in-progress state */}
      {status === "generating" && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: color }}
        />
      )}
      {label}
    </span>
  );
}
