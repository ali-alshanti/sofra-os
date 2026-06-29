"use client";

import { Download, RefreshCw, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

interface EmployeeHeaderProps {
  onExport?:      () => void;
  onRefresh?:     () => void;
  onAddEmployee?: () => void;
}

export function EmployeeHeader({ onExport, onRefresh, onAddEmployee }: EmployeeHeaderProps) {
  const t  = useTranslations("employees");
  const ta = useTranslations("common.actions");

  return (
    <PageHeader
      title={t("title")}
      description={t("description")}
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={onExport}>
            <Download size={16} />
            {ta("export")}
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh}>
            <RefreshCw size={16} />
            {ta("refresh")}
          </Button>
          <Button size="sm" className="gap-2" onClick={onAddEmployee}>
            <UserPlus size={16} />
            {ta("add")}
          </Button>
        </div>
      }
    />
  );
}
