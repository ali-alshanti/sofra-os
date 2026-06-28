import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];

  return [1, "…", current - 1, current, current + 1, "…", total];
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function OrdersPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: OrdersPaginationProps) {
  const firstItem = (currentPage - 1) * pageSize + 1;
  const lastItem  = Math.min(currentPage * pageSize, totalItems);
  const pages     = getPageRange(currentPage, totalPages);

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {/* Results summary */}
      <p className="typography-small text-muted-foreground whitespace-nowrap">
        Showing{" "}
        <span className="font-medium text-foreground">
          {firstItem}–{lastItem}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground">{totalItems}</span> orders
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </Button>

        {/* Page numbers */}
        {pages.map((page, i) =>
          page === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 text-center typography-small text-muted-foreground select-none"
            >
              …
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "ghost"}
              size="icon"
              className={cn(
                "h-8 w-8 text-sm",
                page === currentPage && "pointer-events-none",
              )}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Button>
          ),
        )}

        {/* Next */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
