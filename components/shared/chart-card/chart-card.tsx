import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  className?: string;
}

function ChartCardSkeleton() {
  return (
    <div className="glass-card premium-shadow rounded-[16px] p-6 animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <div className="h-5 w-36 rounded bg-muted" />
          <div className="h-3 w-52 rounded bg-muted/60" />
        </div>
        <div className="h-5 w-24 rounded bg-muted" />
      </div>
      <div className="h-64 rounded-lg bg-muted/40" />
    </div>
  );
}

export function ChartCard({
  title,
  description,
  actions,
  children,
  footer,
  loading = false,
  empty = false,
  emptyMessage = "No data available.",
  className,
}: ChartCardProps) {
  if (loading) return <ChartCardSkeleton />;

  return (
    <div className={cn("glass-card premium-shadow rounded-[16px] p-6", className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="space-y-0.5 min-w-0">
          <h4 className="text-[24px] font-medium leading-[1.4] text-foreground">
            {title}
          </h4>
          {description && (
            <p className="typography-small text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>

      {/* Chart area */}
      {empty ? (
        <div className="flex items-center justify-center rounded-lg bg-muted/20 py-16">
          <p className="typography-small text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        children
      )}

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-4 border-t border-border">{footer}</div>
      )}
    </div>
  );
}
