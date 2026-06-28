import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function QuickActionCard({
  icon: Icon,
  title,
  description,
  className,
}: QuickActionCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer shadow-card transition-shadow hover:shadow-elevated",
        className,
      )}
    >
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="typography-small text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
