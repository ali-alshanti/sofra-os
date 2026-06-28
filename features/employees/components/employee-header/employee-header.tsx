import { Download, RefreshCw, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

interface EmployeeHeaderProps {
  onExport?: () => void;
  onRefresh?: () => void;
  onAddEmployee?: () => void;
}

export function EmployeeHeader({ onExport, onRefresh, onAddEmployee }: EmployeeHeaderProps) {
  return (
    <PageHeader
      title="Employees Management"
      description="Manage staff members, schedules, roles, and shift status across all departments."
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={onExport}>
            <Download size={16} />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh}>
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button size="sm" className="gap-2" onClick={onAddEmployee}>
            <UserPlus size={16} />
            Add Employee
          </Button>
        </div>
      }
    />
  );
}
