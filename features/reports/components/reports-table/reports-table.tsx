import type { ReactNode } from "react";
import { FileBarChart2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import type { Report } from "@/features/reports/types";
import { ReportRow } from "../report-row";
import { ReportsTableHeader, REPORTS_COLUMNS } from "./reports-table-header";

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="animate-pulse border-border">
          {REPORTS_COLUMNS.map((col) => (
            <TableCell key={col.key} className={col.className}>
              <div className="h-4 rounded bg-muted" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReportsTableProps {
  reports:       Report[];
  loading?:      boolean;
  onView?:       (id: string) => void;
  onDownload?:   (id: string) => void;
  onDelete?:     (id: string) => void;
  pagination?:   ReactNode;
  className?:    string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReportsTable({
  reports,
  loading = false,
  onView,
  onDownload,
  onDelete,
  pagination,
  className,
}: ReportsTableProps) {
  const t = useTranslations("reports.empty");

  const isEmpty = !loading && reports.length === 0;

  return (
    <div className={cn("glass-card premium-shadow rounded-2xl overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <Table>
          <ReportsTableHeader />
          <TableBody>
            {loading  && <LoadingRows />}
            {isEmpty  && (
              <TableRow className="border-0 hover:bg-transparent">
                <TableCell colSpan={REPORTS_COLUMNS.length} className="py-8">
                  <EmptyState
                    icon={FileBarChart2}
                    title={t("title")}
                    description={t("description")}
                  />
                </TableCell>
              </TableRow>
            )}
            {!loading && !isEmpty && reports.map((report) => (
              <ReportRow
                key={report.id}
                report={report}
                onView={onView}
                onDownload={onDownload}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="border-t border-border px-6 py-3">{pagination}</div>
      )}
    </div>
  );
}
