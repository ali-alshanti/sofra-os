import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  /** Label for the items being paginated, e.g. "orders", "items" */
  itemLabel?: string;
  className?: string;
}

function getPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "items",
  className,
}: PaginationProps) {
  const t = useTranslations("common.pagination");

  const firstItem = (currentPage - 1) * pageSize + 1;
  const lastItem  = Math.min(currentPage * pageSize, totalItems);
  const pages     = getPageRange(currentPage, totalPages);

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <p className="typography-small text-muted-foreground whitespace-nowrap">
        {t("showing", { from: firstItem, to: lastItem, total: totalItems, label: itemLabel })}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost" size="icon" className="h-8 w-8"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label={t("previous")}
        >
          <ChevronLeft size={16} />
        </Button>

        {pages.map((page, i) =>
          page === "…" ? (
            <span key={`ellipsis-${i}`} className="w-8 text-center typography-small text-muted-foreground select-none">
              …
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "ghost"}
              size="icon"
              className={cn("h-8 w-8 text-sm", page === currentPage && "pointer-events-none")}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="ghost" size="icon" className="h-8 w-8"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label={t("next")}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
