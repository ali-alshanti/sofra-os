import { RefreshCw, Share2, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

interface CustomerHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
  onAddCustomer?: () => void;
}

export function CustomerHeader({ onRefresh, onExport, onAddCustomer }: CustomerHeaderProps) {
  return (
    <PageHeader
      title="Customers Management"
      description="Manage customer profiles, loyalty, and visit history."
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh}>
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={onExport}>
            <Share2 size={16} />
            Export
          </Button>
          <Button size="sm" className="gap-2" onClick={onAddCustomer}>
            <UserPlus size={16} />
            Add Customer
          </Button>
        </div>
      }
    />
  );
}
