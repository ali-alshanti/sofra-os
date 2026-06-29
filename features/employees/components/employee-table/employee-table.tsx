import type { ReactNode } from "react";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { EmployeeRow } from "@/features/employees/components/employee-row";
import type { Employee } from "@/features/employees/types";

// ─── Column key order ─────────────────────────────────────────────────────────

const COLUMN_KEYS = [
  { key: "employee",   className: ""     },
  { key: "department", className: "w-32" },
  { key: "role",       className: "w-36" },
  { key: "shift",      className: "w-32" },
  { key: "status",     className: "w-28" },
  { key: "attendance", className: "w-28" },
  { key: "hireDate",   className: "w-28" },
  { key: "actions",    className: "w-12" },
] as const;

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SkeletonRow({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TableRow key={i} className="border-border animate-pulse">
          {COLUMN_KEYS.map((col) => (
            <TableCell key={col.key} className={cn("px-6 py-4", col.className)}>
              {col.key === "employee" ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-28 rounded bg-muted" />
                    <div className="h-2.5 w-16 rounded bg-muted/60" />
                  </div>
                </div>
              ) : col.key === "attendance" ? (
                <div className="space-y-1.5 w-24">
                  <div className="h-2.5 w-8 rounded bg-muted/60" />
                  <div className="h-1 w-full rounded-full bg-muted" />
                </div>
              ) : (
                <div className="h-4 rounded bg-muted" />
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface EmployeeTableProps {
  employees: Employee[];
  loading?: boolean;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  pagination?: ReactNode;
  className?: string;
}

// ─── EmployeeTable ────────────────────────────────────────────────────────────

export function EmployeeTable({
  employees,
  loading = false,
  onView,
  onEdit,
  onDelete,
  pagination,
  className,
}: EmployeeTableProps) {
  const t     = useTranslations("employees.table");
  const tempty = useTranslations("employees.empty");

  const isEmpty = !loading && employees.length === 0;

  const COLUMNS = [
    { key: "employee",   label: t("employee"),   className: ""     },
    { key: "department", label: t("department"), className: "w-32" },
    { key: "role",       label: t("role"),       className: "w-36" },
    { key: "shift",      label: t("shift"),      className: "w-32" },
    { key: "status",     label: t("status"),     className: "w-28" },
    { key: "attendance", label: t("attendance"), className: "w-28" },
    { key: "hireDate",   label: t("hireDate"),   className: "w-28" },
    { key: "actions",    label: "",              className: "w-12" },
  ] as const;

  return (
    <div
      className={cn(
        "bg-card rounded-2xl overflow-hidden shadow-sm border border-border/30",
        className,
      )}
    >
      <Table>
        {/* Header */}
        <TableHeader>
          <TableRow className="bg-muted/40 border-border hover:bg-muted/40">
            {COLUMNS.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  "px-6 py-4 typography-caption uppercase tracking-widest text-muted-foreground font-medium",
                  col.className,
                )}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody className="divide-y divide-border/20">
          {loading ? (
            <SkeletonRow count={5} />
          ) : isEmpty ? (
            <TableRow className="border-0 hover:bg-transparent">
              <TableCell colSpan={COLUMNS.length} className="py-0">
                <EmptyState
                  icon={Users}
                  title={tempty("title")}
                  description={tempty("description")}
                  className="border-0 bg-transparent"
                />
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <EmployeeRow
                key={employee.id}
                employee={employee}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination slot */}
      {pagination && (
        <div className="border-t border-border/30 bg-card px-6 py-4">
          {pagination}
        </div>
      )}
    </div>
  );
}
