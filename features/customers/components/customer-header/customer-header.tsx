"use client";

import { RefreshCw, Share2, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

interface CustomerHeaderProps {
  onRefresh?:     () => void;
  onExport?:      () => void;
  onAddCustomer?: () => void;
}

export function CustomerHeader({ onRefresh, onExport, onAddCustomer }: CustomerHeaderProps) {
  const t  = useTranslations("customers");
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
          <Button variant="outline" size="sm" className="gap-2" onClick={onExport}>
            <Share2 size={16} />
            {ta("export")}
          </Button>
          <Button size="sm" className="gap-2" onClick={onAddCustomer}>
            <UserPlus size={16} />
            {ta("add")}
          </Button>
        </div>
      }
    />
  );
}
