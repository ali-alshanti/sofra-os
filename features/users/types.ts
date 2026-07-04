import type { UserRole } from "@/types/auth";

export type AppUserStatus = "active" | "inactive";

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  status: AppUserStatus;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface UserFiltersValue {
  search: string;
  role: UserRole | "all";
  status: AppUserStatus | "all";
}

export const DEFAULT_USER_FILTERS: UserFiltersValue = {
  search: "",
  role: "all",
  status: "all",
};

export const ROLE_VALUES: UserRole[] = [
  "Owner",
  "Manager",
  "Cashier",
  "Waiter",
  "Kitchen Staff",
  "Inventory Manager",
];
