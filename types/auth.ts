export type UserRole = "admin" | "manager" | "staff" | "kitchen" | "cashier";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  role: UserRole;
  restaurant_id?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthError {
  message: string;
}
