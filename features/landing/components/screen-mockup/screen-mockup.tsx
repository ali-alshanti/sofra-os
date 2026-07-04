import { MockupBar, MockupBlock } from "@/features/landing/components/mockup-frame";

export type ScreenVariant =
  | "dashboard"
  | "orders"
  | "kitchen"
  | "menu"
  | "inventory"
  | "reports"
  | "settings";

interface ScreenMockupProps {
  variant: ScreenVariant;
}

export function ScreenMockup({ variant }: ScreenMockupProps) {
  switch (variant) {
    case "dashboard":
      return (
        <div className="grid gap-3">
          <div className="grid grid-cols-4 gap-3">
            {["var(--chart-1)", "var(--chart-2)", "var(--chart-4)", "var(--chart-5)"].map(
              (color, i) => (
                <div key={i} className="rounded-lg bg-muted p-3">
                  <MockupBar widthClassName="w-1/2" className="mb-2" />
                  <div
                    className="h-6 w-3/4 rounded-md opacity-70"
                    style={{ backgroundColor: color }}
                  />
                </div>
              ),
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <MockupBlock className="col-span-2 h-40" />
            <MockupBlock className="h-40" />
          </div>
        </div>
      );
    case "orders":
      return (
        <div className="grid gap-2">
          <div className="mb-1 grid grid-cols-4 gap-2">
            <MockupBar />
            <MockupBar />
            <MockupBar />
            <MockupBar />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 rounded-lg bg-muted p-2.5">
              <MockupBar widthClassName="w-2/3" />
              <MockupBar widthClassName="w-1/2" />
              <MockupBar widthClassName="w-1/3" />
              <MockupBar widthClassName="w-1/4" />
            </div>
          ))}
        </div>
      );
    case "kitchen":
      return (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border-2 border-primary/40 bg-muted p-3">
              <MockupBar widthClassName="w-2/3" className="mb-2" />
              <MockupBlock className="h-3 mb-1.5 w-full" />
              <MockupBlock className="h-3 w-4/5" />
            </div>
          ))}
        </div>
      );
    case "menu":
      return (
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg bg-muted">
              <MockupBlock className="h-16 rounded-none" />
              <div className="p-2">
                <MockupBar widthClassName="w-full" className="mb-1" />
                <MockupBar widthClassName="w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );
    case "inventory":
      return (
        <div className="grid gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-muted p-2.5">
              <MockupBlock className="size-8 shrink-0" />
              <MockupBar widthClassName="w-1/3" />
              <div className="ms-auto h-5 w-16 rounded-full bg-accent/40" />
            </div>
          ))}
        </div>
      );
    case "reports":
      return (
        <div className="grid gap-3">
          <MockupBlock className="h-32 w-full" />
          <div className="grid grid-cols-3 gap-3">
            <MockupBlock className="h-20" />
            <MockupBlock className="h-20" />
            <MockupBlock className="h-20" />
          </div>
        </div>
      );
    case "settings":
      return (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-muted p-3">
              <MockupBar widthClassName="w-1/3" />
              <div className="h-5 w-9 rounded-full bg-primary/40" />
            </div>
          ))}
        </div>
      );
  }
}
