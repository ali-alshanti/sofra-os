import { cn } from "@/lib/utils";

interface MockupFrameProps {
  className?: string;
  children: React.ReactNode;
}

export function MockupFrame({ className, children }: MockupFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-(--shadow-overlay)",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
        <div className="ms-3 h-5 flex-1 max-w-xs rounded-md bg-background/80" />
      </div>
      <div className="bg-background p-4">{children}</div>
    </div>
  );
}

export function MockupBar({
  widthClassName = "w-full",
  className,
}: {
  widthClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("h-3 rounded-full bg-foreground/12", widthClassName, className)} />
  );
}

export function MockupBlock({ className }: { className?: string }) {
  return <div className={cn("rounded-lg bg-foreground/12", className)} />;
}
