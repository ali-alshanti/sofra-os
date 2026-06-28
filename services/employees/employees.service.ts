import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type {
  Employee,
  EmployeeStatus,
  EmployeeDepartment,
  EmployeeRole,
  EmployeeShift,
  Attendance,
} from "@/features/employees/types";
import type { EmployeeStats } from "@/features/employees/components/employee-summary";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GetEmployeesParams {
  restaurantId: string;
  page?:        number;
  pageSize?:    number;
  search?:      string;
  department?:  EmployeeDepartment | "all";
  role?:        EmployeeRole | "all";
  status?:      EmployeeStatus | "all";
}

export interface GetEmployeesResult {
  employees: Employee[];
  total:     number;
}

// ─── getEmployees ─────────────────────────────────────────────────────────────

export async function getEmployees({
  restaurantId,
  page     = 1,
  pageSize = 10,
  search,
  department,
  role,
  status,
}: GetEmployeesParams): Promise<GetEmployeesResult> {
  const supabase = getSupabaseBrowserClient();
  const from = (page - 1) * pageSize;
  const to   = from + pageSize - 1;

  let query = supabase
    .from("employees")
    .select(
      "id, employee_code, full_name, avatar_url, department, role, shift_start, shift_end, status, attendance_rate, hire_date",
      { count: "exact" },
    )
    .eq("restaurant_id", restaurantId)
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("full_name")
    .range(from, to);

  if (department && department !== "all") query = query.eq("department", department);
  if (role       && role       !== "all") query = query.eq("role", role);
  if (status     && status     !== "all") query = query.eq("status", status);

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  let rows = (data ?? []) as EmployeeRow[];

  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.full_name.toLowerCase().includes(q) ||
        (r.employee_code ?? "").toLowerCase().includes(q),
    );
  }

  return { employees: rows.map(mapRowToEmployee), total: count ?? 0 };
}

// ─── getEmployeeSummary ───────────────────────────────────────────────────────

export async function getEmployeeSummary(restaurantId: string): Promise<EmployeeStats> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("employees")
    .select("status, attendance_rate")
    .eq("restaurant_id", restaurantId)
    .eq("is_active", true)
    .is("deleted_at", null);

  if (error) throw new Error(error.message);

  const all = data ?? [];
  const onShift  = all.filter((e) => e.status === "on_shift" || e.status === "break").length;
  const offShift = all.filter((e) => e.status === "off_shift" || e.status === "on_leave").length;
  const avgRate  = all.length > 0
    ? Math.round(all.reduce((s, e) => s + Number(e.attendance_rate), 0) / all.length)
    : 0;

  return {
    totalEmployees: all.length,
    onShift,
    offShift,
    avgAttendance: `${avgRate}%`,
  };
}

// ─── updateEmployee ───────────────────────────────────────────────────────────

export async function updateEmployee(
  employeeId: string,
  patch: Partial<{
    full_name: string; avatar_url: string;
    department: EmployeeDepartment; role: EmployeeRole;
    shift_start: string; shift_end: string;
    status: EmployeeStatus; attendance_rate: number;
    hire_date: string;
  }>,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("employees")
    .update(patch)
    .eq("id", employeeId);
  if (error) throw new Error(error.message);
}

// ─── updateEmployeeStatus ─────────────────────────────────────────────────────

export async function updateEmployeeStatus(
  employeeId: string,
  status: EmployeeStatus,
): Promise<void> {
  return updateEmployee(employeeId, { status });
}

// ─── deleteEmployee (soft) ────────────────────────────────────────────────────

export async function deleteEmployee(employeeId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("employees")
    .update({ is_active: false, deleted_at: new Date().toISOString() })
    .eq("id", employeeId);
  if (error) throw new Error(error.message);
}

// ─── Internal mapper ──────────────────────────────────────────────────────────

interface EmployeeRow {
  id:              string;
  employee_code:   string | null;
  full_name:       string;
  avatar_url:      string | null;
  department:      string;
  role:            string;
  shift_start:     string | null;
  shift_end:       string | null;
  status:          string;
  attendance_rate: number;
  hire_date:       string | null;
}

function mapRowToEmployee(row: EmployeeRow): Employee {
  const shift: EmployeeShift = {
    start: row.shift_start ?? "09:00",
    end:   row.shift_end   ?? "17:00",
  };

  const attendance: Attendance = {
    rate: Number(row.attendance_rate),
  };

  return {
    id:           row.id,
    employeeCode: row.employee_code ?? `#EMP-${row.id.slice(0, 4).toUpperCase()}`,
    name:         row.full_name,
    avatarSrc:    row.avatar_url ?? undefined,
    department:   row.department as EmployeeDepartment,
    role:         row.role       as EmployeeRole,
    shift,
    status:       row.status as EmployeeStatus,
    attendance,
    hireDate:     row.hire_date ?? new Date().toISOString(),
  };
}
