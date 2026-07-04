import { MoreVertical, Pencil, UserX, UserCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/utils/string";
import { formatDate, formatDateTime } from "@/lib/utils/format-date";
import { UserStatusBadge } from "@/features/users/components/user-status-badge";
import type { AppUser } from "@/features/users/types";

interface UserActionsMenuProps {
  user: AppUser;
  onEdit?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

function UserActionsMenu({ user, onEdit, onToggleStatus }: UserActionsMenuProps) {
  const t = useTranslations("users.actions");
  const isActive = user.status === "active";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={t("edit")}
        >
          <MoreVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="gap-2" onClick={() => onEdit?.(user.id)}>
          <Pencil size={14} /> {t("edit")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={isActive ? "gap-2 text-destructive focus:text-destructive" : "gap-2"}
          onClick={() => onToggleStatus?.(user.id)}
        >
          {isActive ? <UserX size={14} /> : <UserCheck size={14} />}
          {isActive ? t("deactivate") : t("reactivate")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface UserRowProps {
  user: AppUser;
  onEdit?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

export function UserRow({ user, onEdit, onToggleStatus }: UserRowProps) {
  const t = useTranslations("users");

  return (
    <TableRow className="group border-border hover:bg-primary/[0.02] transition-colors">
      <TableCell className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0 border border-border">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullName} />
            <AvatarFallback className="text-xs bg-muted text-muted-foreground">
              {initials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-foreground truncate">{user.fullName}</span>
        </div>
      </TableCell>

      <TableCell className="px-6 py-4 text-sm text-muted-foreground">{user.email}</TableCell>

      <TableCell className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
        {user.phone ?? "—"}
      </TableCell>

      <TableCell className="px-6 py-4 text-sm text-foreground">{user.role}</TableCell>

      <TableCell className="px-6 py-4">
        <UserStatusBadge status={user.status} />
      </TableCell>

      <TableCell className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
        {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : t("neverLoggedIn")}
      </TableCell>

      <TableCell className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
        {formatDate(user.createdAt)}
      </TableCell>

      <TableCell className="px-6 py-4 text-end">
        <UserActionsMenu user={user} onEdit={onEdit} onToggleStatus={onToggleStatus} />
      </TableCell>
    </TableRow>
  );
}
