import { cn } from "@/lib/utils";
import type { PageHeaderProps } from "./types";

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-6", className)}>
      <div className="space-y-1 min-w-0">
        <h1 className="text-foreground">{title}</h1>
        {subtitle && (
          <p className="typography-body-lg text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-3">{actions}</div>
      )}
    </div>
  );
}
