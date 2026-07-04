import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
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
import { UserRow } from "@/features/users/components/user-row";
import type { AppUser } from "@/features/users/types";

const COLUMN_KEYS = [
  { key: "user", className: "" },
  { key: "email", className: "w-56" },
  { key: "phone", className: "w-36" },
  { key: "role", className: "w-40" },
  { key: "status", className: "w-28" },
  { key: "lastLogin", className: "w-40" },
  { key: "createdAt", className: "w-32" },
  { key: "actions", className: "w-12" },
] as const;

function SkeletonRow({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TableRow key={i} className="border-border animate-pulse">
          {COLUMN_KEYS.map((col) => (
            <TableCell key={col.key} className={cn("px-6 py-4", col.className)}>
              {col.key === "user" ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
                  <div className="h-3.5 w-28 rounded bg-muted" />
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

interface UserTableProps {
  users: AppUser[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  pagination?: ReactNode;
  className?: string;
}

export function UserTable({ users, loading = false, onEdit, onToggleStatus, pagination, className }: UserTableProps) {
  const t = useTranslations("users.table");
  const tempty = useTranslations("users.empty");

  const isEmpty = !loading && users.length === 0;

  const COLUMNS = [
    { key: "user", label: t("user"), className: "" },
    { key: "email", label: t("email"), className: "w-56" },
    { key: "phone", label: t("phone"), className: "w-36" },
    { key: "role", label: t("role"), className: "w-40" },
    { key: "status", label: t("status"), className: "w-28" },
    { key: "lastLogin", label: t("lastLogin"), className: "w-40" },
    { key: "createdAt", label: t("createdAt"), className: "w-32" },
    { key: "actions", label: "", className: "w-12" },
  ] as const;

  return (
    <div className={cn("bg-card rounded-2xl overflow-hidden shadow-sm border border-border/30", className)}>
      <Table>
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

        <TableBody className="divide-y divide-border/20">
          {loading ? (
            <SkeletonRow count={5} />
          ) : isEmpty ? (
            <TableRow className="border-0 hover:bg-transparent">
              <TableCell colSpan={COLUMNS.length} className="py-0">
                <EmptyState
                  icon={ShieldCheck}
                  title={tempty("title")}
                  description={tempty("description")}
                  className="border-0 bg-transparent"
                />
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <UserRow key={user.id} user={user} onEdit={onEdit} onToggleStatus={onToggleStatus} />
            ))
          )}
        </TableBody>
      </Table>

      {pagination && <div className="border-t border-border/30 bg-card px-6 py-4">{pagination}</div>}
    </div>
  );
}
