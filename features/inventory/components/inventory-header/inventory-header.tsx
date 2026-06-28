import { RefreshCw, Download, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

interface InventoryHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
  onAddItem?: () => void;
}

export function InventoryHeader({ onRefresh, onExport, onAddItem }: InventoryHeaderProps) {
  return (
    <PageHeader
      title="Inventory Management"
      description="Track stock levels, suppliers, and inventory status."
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh}>
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={onExport}>
            <Download size={16} />
            Export
          </Button>
          <Button size="sm" className="gap-2" onClick={onAddItem}>
            <Plus size={16} />
            Add Item
          </Button>
        </div>
      }
    />
  );
}
