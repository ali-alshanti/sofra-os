export const ROUTES = {
  LOGIN: "/login",

  DASHBOARD: "/dashboard",

  ORDERS: "/orders",

  MENU: "/menu",

  TABLES: "/tables",

  INVENTORY: "/inventory",

  CUSTOMERS: "/customers",

  EMPLOYEES: "/employees",

  REPORTS: "/reports",

  SETTINGS: "/settings",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
