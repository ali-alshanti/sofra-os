import { cn } from "@/lib/utils";

// ─── Color thresholds (Stitch design) ────────────────────────────────────────

function getBarClass(percentage: number): string {
  if (percentage >= 90) return "bg-primary";        /* green — good attendance */
  if (percentage >= 75) return "bg-[#f69f0d]";      /* amber — on-tertiary-container */
  return "bg-destructive";                           /* red — poor attendance */
}

function getLabelClass(percentage: number): string {
  if (percentage >= 90) return "text-primary";
  if (percentage >= 75) return "text-[#f69f0d]";
  return "text-destructive";
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface AttendanceProgressProps {
  percentage: number;  // 0–100
  showLabel?: boolean;
  className?: string;
}

export function AttendanceProgress({
  percentage,
  showLabel = true,
  className,
}: AttendanceProgressProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div className={cn("flex flex-col gap-1 w-24", className)}>
      {showLabel && (
        <span
          className={cn(
            "text-[10px] font-bold leading-none",
            getLabelClass(clamped),
          )}
        >
          {clamped}%
        </span>
      )}
      <div
        className="w-full h-1 rounded-full overflow-hidden bg-muted"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Attendance rate: ${clamped}%`}
      >
        <div
          className={cn("h-full rounded-full transition-all", getBarClass(clamped))}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
