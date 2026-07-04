"use client";

import { Loader2, type LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface FormDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional icon shown centered above the title */
  icon?:        LucideIcon;
  title:        string;
  description?: string;
  /** Form body content */
  children:     React.ReactNode;
  onSubmit:     (e: React.FormEvent) => void;
  onCancel?:    () => void;
  submitLabel:  string;
  cancelLabel:  string;
  submitDisabled?: boolean;
  loading?:     boolean;
  maxWidth?:    "sm" | "md" | "lg";
  className?:   string;
}

const MAX_WIDTH: Record<NonNullable<FormDialogProps["maxWidth"]>, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Shared modal shell for every "create/edit" form dialog in the app.
 * Pages supply their own body (children) and submit logic; this component
 * owns the Dialog shell, header layout, and footer button/loading state.
 */
export function FormDialog({
  open,
  onOpenChange,
  icon: Icon,
  title,
  description,
  children,
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel,
  submitDisabled = false,
  loading = false,
  maxWidth = "md",
  className,
}: FormDialogProps) {
  function handleCancel() {
    onCancel?.();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(MAX_WIDTH[maxWidth], className)}>
        <DialogHeader className={Icon ? "items-center text-center sm:items-center sm:text-center" : undefined}>
          {Icon && (
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-5" />
            </div>
          )}
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-4 pt-2">
          {children}

          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={loading || submitDisabled}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
