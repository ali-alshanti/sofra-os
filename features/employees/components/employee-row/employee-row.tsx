import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
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
import { formatDate } from "@/lib/utils/format-date";
import { EmployeeStatusBadge } from "@/features/employees/components/employee-status-badge";
import { AttendanceProgress } from "@/features/employees/components/attendance-progress";
import type { Employee, EmployeeRole, EmployeeDepartment } from "@/features/employees/types";

// ─── Display label maps ───────────────────────────────────────────────────────

const ROLE_LABELS: Record<EmployeeRole, string> = {
  manager:         "Manager",
  head_chef:       "Head Chef",
  chef:            "Chef",
  waiter:          "Waiter",
  cashier:         "Cashier",
  delivery_driver: "Delivery Driver",
};

const DEPT_LABELS: Record<EmployeeDepartment, string> = {
  kitchen:    "Kitchen",
  service:    "Service",
  management: "Management",
  cashier:    "Cashier",
  delivery:   "Delivery",
};

// ─── Actions menu ─────────────────────────────────────────────────────────────

function EmployeeActionsMenu({
  employee,
  onView,
  onEdit,
  onDelete,
}: {
  employee: Employee;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/*
          Trigger is opacity-0 by default, revealed on row hover via
          CSS group/group-hover — no JS required.
        */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Employee actions"
        >
          <MoreVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem className="gap-2" onClick={() => onView?.(employee.id)}>
          <Eye size={14} /> View Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2" onClick={() => onEdit?.(employee.id)}>
          <Pencil size={14} /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-destructive focus:text-destructive"
          onClick={() => onDelete?.(employee.id)}
        >
          <Trash2 size={14} /> Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── EmployeeRow ──────────────────────────────────────────────────────────────

interface EmployeeRowProps {
  employee: Employee;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function EmployeeRow({ employee, onView, onEdit, onDelete }: EmployeeRowProps) {
  const hireDate = employee.hireDate
    ? (employee.hireDate instanceof Date ? employee.hireDate : new Date(employee.hireDate))
    : null;

  return (
    <TableRow className="group border-border hover:bg-primary/[0.02] transition-colors">
      {/* Employee — avatar + name + code */}
      <TableCell className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0 border border-border">
            <AvatarImage src={employee.avatarSrc} alt={employee.name} />
            <AvatarFallback className="text-xs bg-muted text-muted-foreground">
              {initials(employee.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-foreground truncate">
              {employee.name}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {employee.employeeCode}
            </span>
          </div>
        </div>
      </TableCell>

      {/* Department */}
      <TableCell className="px-6 py-4 text-sm text-muted-foreground">
        {DEPT_LABELS[employee.department]}
      </TableCell>

      {/* Role */}
      <TableCell className="px-6 py-4 text-sm text-foreground">
        {ROLE_LABELS[employee.role]}
      </TableCell>

      {/* Shift */}
      <TableCell className="px-6 py-4 text-xs text-muted-foreground font-mono whitespace-nowrap">
        {employee.shift.start} – {employee.shift.end}
      </TableCell>

      {/* Status */}
      <TableCell className="px-6 py-4">
        <EmployeeStatusBadge status={employee.status} />
      </TableCell>

      {/* Attendance */}
      <TableCell className="px-6 py-4">
        <AttendanceProgress percentage={employee.attendance.rate} />
      </TableCell>

      {/* Hire Date */}
      <TableCell className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
        {hireDate ? formatDate(hireDate, "en-US") : "—"}
      </TableCell>

      {/* Actions — hidden until row hover */}
      <TableCell className="px-6 py-4 text-right">
        <EmployeeActionsMenu
          employee={employee}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}
