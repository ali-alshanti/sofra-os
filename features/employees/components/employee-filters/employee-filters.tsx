import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  EmployeeFiltersValue,
  EmployeeDepartment,
  EmployeeRole,
  EmployeeStatus,
} from "@/features/employees/types";

// ─── Static options ───────────────────────────────────────────────────────────

const DEPARTMENT_OPTIONS: { value: EmployeeDepartment | "all"; label: string }[] = [
  { value: "all",        label: "Department" },
  { value: "kitchen",    label: "Kitchen"    },
  { value: "service",    label: "Service"    },
  { value: "management", label: "Management" },
  { value: "cashier",    label: "Cashier"    },
  { value: "delivery",   label: "Delivery"   },
];

const ROLE_OPTIONS: { value: EmployeeRole | "all"; label: string }[] = [
  { value: "all",             label: "Role"            },
  { value: "manager",         label: "Manager"         },
  { value: "head_chef",       label: "Head Chef"       },
  { value: "chef",            label: "Chef"            },
  { value: "waiter",          label: "Waiter"          },
  { value: "cashier",         label: "Cashier"         },
  { value: "delivery_driver", label: "Delivery Driver" },
];

const STATUS_OPTIONS: { value: EmployeeStatus | "all"; label: string }[] = [
  { value: "all",       label: "Shift Status" },
  { value: "on_shift",  label: "On Shift"     },
  { value: "break",     label: "Break"        },
  { value: "off_shift", label: "Off Shift"    },
  { value: "on_leave",  label: "On Leave"     },
];

// ─── Props ─────────────────────────────────────────────────────────────────────

interface EmployeeFiltersProps {
  value: EmployeeFiltersValue;
  onSearchChange?: (search: string) => void;
  onDepartmentChange?: (department: EmployeeDepartment | "all") => void;
  onRoleChange?: (role: EmployeeRole | "all") => void;
  onStatusChange?: (status: EmployeeStatus | "all") => void;
  disabled?: boolean;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function EmployeeFilters({
  value,
  onSearchChange,
  onDepartmentChange,
  onRoleChange,
  onStatusChange,
  disabled = false,
  className,
}: EmployeeFiltersProps) {
  return (
    <div
      className={cn(
        "bg-muted/40 border border-border/20 rounded-2xl p-4",
        "flex flex-wrap items-center gap-4",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="Search employees..."
          aria-label="Search employees"
          value={value.search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full pl-9 h-9 bg-background text-sm"
          disabled={disabled}
        />
      </div>

      {/* Select group */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Department */}
        <Select
          value={value.department}
          onValueChange={(v) => onDepartmentChange?.(v as EmployeeDepartment | "all")}
          disabled={disabled}
        >
          <SelectTrigger className="h-9 w-36 bg-background text-sm">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Role */}
        <Select
          value={value.role}
          onValueChange={(v) => onRoleChange?.(v as EmployeeRole | "all")}
          disabled={disabled}
        >
          <SelectTrigger className="h-9 w-36 bg-background text-sm">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Shift Status */}
        <Select
          value={value.status}
          onValueChange={(v) => onStatusChange?.(v as EmployeeStatus | "all")}
          disabled={disabled}
        >
          <SelectTrigger className="h-9 w-36 bg-background text-sm">
            <SelectValue placeholder="Shift Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter icon button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          disabled={disabled}
          aria-label="Advanced filters"
        >
          <SlidersHorizontal size={16} />
        </Button>
      </div>
    </div>
  );
}
