import { MoreHorizontal, Eye, Download, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format-date";
import type { Report, ReportType } from "@/features/reports/types";
import { ReportStatusBadge } from "../report-status-badge";

// ─── Report Type label ────────────────────────────────────────────────────────

const TYPE_LABEL: Record<ReportType, string> = {
  revenue:   "Revenue",
  category:  "Category",
  customers: "Customers",
  employees: "Employees",
  inventory: "Inventory",
};

// ─── Actions Menu ─────────────────────────────────────────────────────────────

interface ActionsMenuProps {
  report:       Report;
  onView?:      (id: string) => void;
  onDownload?:  (id: string) => void;
  onDelete?:    (id: string) => void;
}

function ReportActionsMenu({ report, onView, onDownload, onDelete }: ActionsMenuProps) {
  const canDownload = report.status === "ready" && !!report.downloadUrl;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
        >
          <MoreHorizontal size={16} />
          <span className="sr-only">Report actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          className="gap-2"
          onClick={() => onView?.(report.id)}
        >
          <Eye size={14} />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2"
          disabled={!canDownload}
          onClick={() => canDownload && onDownload?.(report.id)}
        >
          <Download size={14} />
          Download
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-destructive focus:text-destructive"
          onClick={() => onDelete?.(report.id)}
        >
          <Trash2 size={14} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── ReportRow ────────────────────────────────────────────────────────────────

export interface ReportRowProps {
  report:      Report;
  onView?:     (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?:   (id: string) => void;
}

export function ReportRow({ report, onView, onDownload, onDelete }: ReportRowProps) {
  const generatedDate =
    report.generatedAt instanceof Date
      ? report.generatedAt
      : new Date(report.generatedAt);

  return (
    <TableRow className="border-border hover:bg-muted/30 transition-colors">
      {/* Report Name */}
      <TableCell className="font-medium text-sm text-foreground">
        {report.name}
      </TableCell>

      {/* Type */}
      <TableCell className="typography-small text-muted-foreground">
        {TYPE_LABEL[report.type]}
      </TableCell>

      {/* Period */}
      <TableCell className="typography-small text-muted-foreground whitespace-nowrap">
        {report.period}
      </TableCell>

      {/* Generated At */}
      <TableCell className="typography-small text-muted-foreground whitespace-nowrap">
        {formatDate(generatedDate)}
      </TableCell>

      {/* Status */}
      <TableCell>
        <ReportStatusBadge status={report.status} />
      </TableCell>

      {/* Actions */}
      <TableCell>
        <ReportActionsMenu
          report={report}
          onView={onView}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}
