export const ROUTES = {
  LOGIN: "/login",

  DASHBOARD: "/dashboard",

  ORDERS: "/orders",

  MENU: "/menu",

  TABLES: "/tables",

  KITCHEN: "/kitchen",

  INVENTORY: "/inventory",

  CUSTOMERS: "/customers",

  EMPLOYEES: "/employees",

  USERS: "/users",

  REPORTS: "/reports",

  SETTINGS: "/settings",

  UNAUTHORIZED: "/403",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
