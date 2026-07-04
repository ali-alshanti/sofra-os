import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { AppUserStatus } from "@/features/users/types";

const STATUS_CLASS: Record<AppUserStatus, string> = {
  active: "bg-primary/10 text-primary",
  inactive: "bg-muted text-muted-foreground",
};

export function UserStatusBadge({ status, className }: { status: AppUserStatus; className?: string }) {
  const t = useTranslations("users.status");

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        STATUS_CLASS[status],
        className,
      )}
    >
      {t(status)}
    </span>
  );
}
