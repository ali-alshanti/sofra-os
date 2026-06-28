// ─── Status ────────────────────────────────────────────────────────────────────

/** Real-time shift status of an employee */
export type EmployeeStatus =
  | "on_shift"
  | "break"
  | "off_shift"
  | "on_leave";

// ─── Department ────────────────────────────────────────────────────────────────

/**
 * Operational department within the restaurant.
 * Strongly typed to prevent typos and enable exhaustive filtering.
 */
export type EmployeeDepartment =
  | "kitchen"
  | "service"
  | "management"
  | "cashier"
  | "delivery";

// ─── Role ──────────────────────────────────────────────────────────────────────

/**
 * Job role — more granular than department.
 * A "kitchen" department can have both "head_chef" and "chef" roles.
 * Strongly typed to support role-based permissions in the future.
 */
export type EmployeeRole =
  | "manager"
  | "head_chef"
  | "chef"
  | "waiter"
  | "cashier"
  | "delivery_driver";

// ─── Shift ─────────────────────────────────────────────────────────────────────

/**
 * A scheduled work shift.
 * Times stored as 24-hour strings ("08:00") for easy display and comparison.
 * Kept independent from Employee so it can be reused in scheduling features.
 */
export interface EmployeeShift {
  start: string; // "08:00"
  end:   string; // "16:00"
}

// ─── Attendance ────────────────────────────────────────────────────────────────

/**
 * Attendance metrics — modeled separately from Employee to:
 * 1. Allow expanding to per-month, per-week, or per-day history.
 * 2. Avoid bloating the Employee entity with time-series data.
 * 3. Support lazy-loading attendance on demand.
 */
export interface Attendance {
  /** Overall attendance rate as percentage 0–100 */
  rate: number;
  /** Number of days present in the tracked period */
  daysPresent?: number;
  /** Number of days absent in the tracked period */
  daysAbsent?: number;
  /** Tracked period label, e.g. "Oct 2024" */
  period?: string;
}

// ─── Employee ──────────────────────────────────────────────────────────────────

export interface Employee {
  id:           string;
  /** Display identifier, e.g. "#EMP-1024" */
  employeeCode: string;
  name:         string;
  avatarSrc?:   string;
  department:   EmployeeDepartment;
  role:         EmployeeRole;
  shift:        EmployeeShift;
  status:       EmployeeStatus;
  attendance:   Attendance;
  hireDate:     Date | string;
}

// ─── Filter value ─────────────────────────────────────────────────────────────

export interface EmployeeFiltersValue {
  search:     string;
  department: EmployeeDepartment | "all";
  role:       EmployeeRole | "all";
  status:     EmployeeStatus | "all";
}

export const DEFAULT_EMPLOYEE_FILTERS: EmployeeFiltersValue = {
  search:     "",
  department: "all",
  role:       "all",
  status:     "all",
};
