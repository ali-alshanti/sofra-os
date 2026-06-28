import type { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SettingsSectionCardProps {
  title:        string;
  description?: string;
  children:     ReactNode;
  /** Optional footer slot — use for per-section Save or helper text */
  footer?:      ReactNode;
  className?:   string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SettingsSectionCard({
  title,
  description,
  children,
  footer,
  className,
}: SettingsSectionCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle className="text-base font-semibold text-foreground">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="typography-small text-muted-foreground mt-0.5">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-5 pb-6 space-y-5">
        {children}
      </CardContent>

      {footer && (
        <CardFooter className="border-t border-border/60 bg-muted/30 px-6 py-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
