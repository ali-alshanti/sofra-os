"use client";

import { RefreshCw, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

interface UserHeaderProps {
  onRefresh?: () => void;
  onAddUser?: () => void;
}

export function UserHeader({ onRefresh, onAddUser }: UserHeaderProps) {
  const t = useTranslations("users");
  const ta = useTranslations("common.actions");

  return (
    <PageHeader
      title={t("title")}
      description={t("description")}
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh}>
            <RefreshCw size={16} />
            {ta("refresh")}
          </Button>
          <Button size="sm" className="gap-2" onClick={onAddUser}>
            <UserPlus size={16} />
            {t("add.action")}
          </Button>
        </div>
      }
    />
  );
}
