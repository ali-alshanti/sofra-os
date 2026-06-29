"use client";

import { RefreshCw, Download, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

interface InventoryHeaderProps {
  onRefresh?: () => void;
  onExport?:  () => void;
  onAddItem?: () => void;
}

export function InventoryHeader({ onRefresh, onExport, onAddItem }: InventoryHeaderProps) {
  const t  = useTranslations("inventory");
  const ta = useTranslations("common.actions");

  return (
    <PageHeader
      title={t("header.title")}
      description={t("header.description")}
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh}>
            <RefreshCw size={16} />
            {ta("refresh")}
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={onExport}>
            <Download size={16} />
            {ta("export")}
          </Button>
          <Button size="sm" className="gap-2" onClick={onAddItem}>
            <Plus size={16} />
            {ta("add")}
          </Button>
        </div>
      }
    />
  );
}
