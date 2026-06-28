import { cn } from "@/lib/utils";
import type { EmployeeStatus } from "@/features/employees/types";

const STATUS_CONFIG: Record<
  EmployeeStatus,
  { label: string; className: string }
> = {
  on_shift: {
    label: "On Shift",
    className: "bg-primary/10 text-primary",
  },
  break: {
    label: "Break",
    className: "bg-[#ffddb8]/30 text-[#653e00]",
  },
  off_shift: {
    label: "Off Shift",
    className: "bg-muted text-muted-foreground",
  },
  on_leave: {
    label: "On Leave",
    className: "bg-secondary/20 text-secondary-foreground",
  },
};

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus;
  className?: string;
}

export function EmployeeStatusBadge({ status, className }: EmployeeStatusBadgeProps) {
  const { label, className: statusClass } = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        statusClass,
        className,
      )}
    >
      {label}
    </span>
  );
}
