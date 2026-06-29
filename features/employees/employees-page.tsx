"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AppShell }   from "@/components/layout/app-shell";
import { Pagination } from "@/components/shared/pagination";
import { EmployeeHeader }  from "./components/employee-header";
import { EmployeeSummary } from "./components/employee-summary";
import { EmployeeFilters } from "./components/employee-filters";
import { EmployeeTable }   from "./components/employee-table";
import {
  DEFAULT_EMPLOYEE_FILTERS,
  type EmployeeFiltersValue,
  type EmployeeDepartment,
  type EmployeeRole,
  type EmployeeStatus,
} from "./types";
import { useEmployees, useEmployeeSummary, useDeleteEmployee } from "@/lib/hooks/use-employees";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

const PAGE_SIZE = 10;

export function EmployeesFeature() {
  const t = useTranslations("employees");

  const [filters, setFilters]         = useState<EmployeeFiltersValue>(DEFAULT_EMPLOYEE_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient                   = useQueryClient();

  const { data: summary, isLoading: summaryLoading } = useEmployeeSummary();

  const { data: employeesData, isLoading: employeesLoading } = useEmployees({
    page:       currentPage,
    pageSize:   PAGE_SIZE,
    search:     filters.search     || undefined,
    department: filters.department !== "all" ? filters.department : undefined,
    role:       filters.role       !== "all" ? filters.role       : undefined,
    status:     filters.status     !== "all" ? filters.status     : undefined,
  });

  const deleteEmployee = useDeleteEmployee();

  const employees  = employeesData?.employees ?? [];
  const totalItems = employeesData?.total     ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.all });
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <EmployeeHeader
          onExport={() => undefined}
          onRefresh={handleRefresh}
          onAddEmployee={() => undefined}
        />

        <EmployeeSummary
          stats={
            summaryLoading || !summary
              ? { totalEmployees: 0, onShift: 0, offShift: 0, avgAttendance: "0%" }
              : summary
          }
        />

        <EmployeeFilters
          value={filters}
          disabled={employeesLoading}
          onSearchChange={(s) => { setFilters(f => ({ ...f, search: s })); setCurrentPage(1); }}
          onDepartmentChange={(d) => { setFilters(f => ({ ...f, department: d as EmployeeDepartment | "all" })); setCurrentPage(1); }}
          onRoleChange={(r) => { setFilters(f => ({ ...f, role: r as EmployeeRole | "all" })); setCurrentPage(1); }}
          onStatusChange={(st) => { setFilters(f => ({ ...f, status: st as EmployeeStatus | "all" })); setCurrentPage(1); }}
        />

        <EmployeeTable
          employees={employees}
          loading={employeesLoading}
          onView={() => undefined}
          onEdit={() => undefined}
          onDelete={(id) => deleteEmployee.mutate(id)}
          pagination={
            totalPages > 1 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={PAGE_SIZE}
                itemLabel={t("title").toLowerCase()}
                onPageChange={setCurrentPage}
              />
            ) : undefined
          }
        />
      </div>
    </AppShell>
  );
}
