"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Pagination } from "@/components/shared/pagination";
import { EmployeeHeader } from "./components/employee-header";
import { EmployeeSummary, type EmployeeStats } from "./components/employee-summary";
import { EmployeeFilters } from "./components/employee-filters";
import { EmployeeTable } from "./components/employee-table";
import {
  DEFAULT_EMPLOYEE_FILTERS,
  type EmployeeFiltersValue,
  type EmployeeDepartment,
  type EmployeeRole,
  type EmployeeStatus,
  type Employee,
} from "./types";

// ─── Placeholder Data ─────────────────────────────────────────────────────────

const PLACEHOLDER_EMPLOYEES: Employee[] = [
  {
    id: "1", employeeCode: "#EMP-1024", name: "Marcus Vane",
    department: "kitchen", role: "head_chef",
    shift: { start: "08:00", end: "16:00" },
    status: "on_shift",
    attendance: { rate: 98 },
    hireDate: "2022-03-12",
    avatarSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUjfMJNTc-MywkodVPn_5IW24uVXbcup3Rc5a_nK6s0WEcJHCxFGNww2bDLOgXpO9BFOmeyurpJ7-l2hPl1UlNx3J6gy1LPhEAPfyg9rDRgHBRE4RpalufyRYhgMTdGea553ZlTJ-1Ykxaup3YVXCO6parzAack-rdmyt5-joY8jhnmRt5nzJ_eTnxloHswJykSeL7e00BYDkR6ap9nm72u5lTl60GFXzhDhzSSulGzWvnplibM5RzHEuyn8Honi7sA-RFWgJPnQ",
  },
  {
    id: "2", employeeCode: "#EMP-1082", name: "Elena Rossi",
    department: "service", role: "waiter",
    shift: { start: "12:00", end: "20:00" },
    status: "break",
    attendance: { rate: 92 },
    hireDate: "2023-10-05",
    avatarSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDQ2R5J6xx0XIgr8VGkSkXyyWfIQw1LcYzsPC7qahN8_WnHrLTybMZ1XuVLNGTP4Jt6XQK9s4O8Xw8wsl152Uxoo77-wATOIRYS5bEbVL_GABzidGD9ly2hxVjYV6eKoDzxNRz-qGx8_umlYmbOxdHjBhCUMA-DMwbgw_vlPCM1YNOhdqUm8aBrvKn6Kjc6m01lkAEQOyIPd8xHNzTZwWYftBVe-Tfo5zEe3C1GuYQF0k0tGUEuBedE7JfKIoA0Y5BBC8agpr23g",
  },
  {
    id: "3", employeeCode: "#EMP-1105", name: "Michael K.",
    department: "management", role: "manager",
    shift: { start: "09:00", end: "17:00" },
    status: "off_shift",
    attendance: { rate: 96 },
    hireDate: "2021-01-20",
    avatarSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0Mim58nx7LSk_FxY5FOuh0JRPNTX5LimdkM9Rja4Ph_2vmkgnvtipgfYKGIP0nPuluOQfOaYgTpCK0dzdzlv2SlZWRqjB7mIzCiv6MJBlQPpXPjxHoWaOahvlXG_gdZPQlKOcf6ptAFDRTlTHYYmxKZaLYCnhDXDpANr5habxRpH9agpUH7NeAXldUQZcQGc2JNVPqK13d4XelJaaQK8gH3wxJN65tHQudPgT5X1AAz1EX3lrVIvHEZ0C1RqNZRBRRePl3aMgWw",
  },
  {
    id: "4", employeeCode: "#EMP-1212", name: "Sarah Jenkins",
    department: "cashier", role: "cashier",
    shift: { start: "10:00", end: "18:00" },
    status: "on_leave",
    attendance: { rate: 89 },
    hireDate: "2023-06-15",
    avatarSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuClXDujkuW2IcU6aR9i6LzDPkzzeuooSuJJjbNxDtE46j_dJvSz2i3I92iCOfZ8XImK-oRvEZsTpTwEXZs0QvO7_i4NxJovenYpRYkIFNKH5hedAR6Dyx3OX9tXBfRs3kxkIcIzsGceMDsgLBRiWeV54Urd4ZrQFrGQVNfz7ELMdXwpZvElHkxFdIYpP_26zU-pZQ24BWpIy9NOAHPK1yFSivqVZ8bo8z4ONXIoNneCGCa8piqS5vRWjGmUQ04a06JNy7Loqij6ZA",
  },
];

const PLACEHOLDER_STATS: EmployeeStats = {
  totalEmployees: 42,
  onShift:        18,
  offShift:       24,
  avgAttendance:  "94%",
};

// ─── Employees Feature ────────────────────────────────────────────────────────

export function EmployeesFeature() {
  const [filters, setFilters] = useState<EmployeeFiltersValue>(DEFAULT_EMPLOYEE_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEmployees = PLACEHOLDER_EMPLOYEES.filter((emp) => {
    if (filters.department !== "all" && emp.department !== filters.department) return false;
    if (filters.role       !== "all" && emp.role       !== filters.role)       return false;
    if (filters.status     !== "all" && emp.status     !== filters.status)     return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!emp.name.toLowerCase().includes(q) &&
          !emp.employeeCode.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <EmployeeHeader
          onExport={() => undefined}
          onRefresh={() => undefined}
          onAddEmployee={() => undefined}
        />

        <EmployeeSummary stats={PLACEHOLDER_STATS} />

        <EmployeeFilters
          value={filters}
          onSearchChange={(s) => { setFilters(f => ({ ...f, search: s })); setCurrentPage(1); }}
          onDepartmentChange={(d) => { setFilters(f => ({ ...f, department: d as EmployeeDepartment | "all" })); setCurrentPage(1); }}
          onRoleChange={(r) => { setFilters(f => ({ ...f, role: r as EmployeeRole | "all" })); setCurrentPage(1); }}
          onStatusChange={(st) => { setFilters(f => ({ ...f, status: st as EmployeeStatus | "all" })); setCurrentPage(1); }}
        />

        <EmployeeTable
          employees={filteredEmployees}
          onView={() => undefined}
          onEdit={() => undefined}
          onDelete={() => undefined}
          pagination={
            <Pagination
              currentPage={currentPage}
              totalPages={11}
              totalItems={42}
              pageSize={4}
              itemLabel="employees"
              onPageChange={setCurrentPage}
            />
          }
        />
      </div>
    </AppShell>
  );
}
