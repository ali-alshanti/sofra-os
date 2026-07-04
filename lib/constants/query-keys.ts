export const QUERY_KEYS = {
  auth: {
    all: ["auth"] as const,
    session: () => [...QUERY_KEYS.auth.all, "session"] as const,
    profile: () => [...QUERY_KEYS.auth.all, "profile"] as const,
  },

  dashboard: {
    all:             ["dashboard"] as const,
    summary:         (restaurantId: string) => [...QUERY_KEYS.dashboard.all, "summary",          restaurantId] as const,
    revenue:         (restaurantId: string) => [...QUERY_KEYS.dashboard.all, "revenue",          restaurantId] as const,
    topItems:        (restaurantId: string) => [...QUERY_KEYS.dashboard.all, "top-items",        restaurantId] as const,
    inventoryAlerts: (restaurantId: string) => [...QUERY_KEYS.dashboard.all, "inventory-alerts", restaurantId] as const,
  },

  orders: {
    all:          ["orders"] as const,
    lists:        () => [...QUERY_KEYS.orders.all, "list"] as const,
    list:         (filters?: Record<string, unknown>) => [...QUERY_KEYS.orders.lists(), filters] as const,
    detail:       (id: string)           => [...QUERY_KEYS.orders.all, "detail",        id] as const,
    summary:      (restaurantId: string) => [...QUERY_KEYS.orders.all, "summary",       restaurantId] as const,
    tableOptions: (restaurantId: string) => [...QUERY_KEYS.orders.all, "table-options", restaurantId] as const,
    waiterOptions:(restaurantId: string) => [...QUERY_KEYS.orders.all, "waiter-options",restaurantId] as const,
  },

  menu: {
    all:        ["menu"] as const,
    lists:      () => [...QUERY_KEYS.menu.all, "list"] as const,
    list:       (filters?: Record<string, unknown>) => [...QUERY_KEYS.menu.lists(), filters] as const,
    detail:     (id: string) => [...QUERY_KEYS.menu.all, "detail", id] as const,
    categories: (restaurantId: string) => [...QUERY_KEYS.menu.all, "categories", restaurantId] as const,
    items:      (restaurantId: string, categoryId?: string, search?: string) =>
      [...QUERY_KEYS.menu.all, "items", restaurantId, categoryId, search] as const,
  },

  inventory: {
    all:        ["inventory"] as const,
    lists:      () => [...QUERY_KEYS.inventory.all, "list"] as const,
    list:       (filters?: Record<string, unknown>) => [...QUERY_KEYS.inventory.lists(), filters] as const,
    detail:     (id: string)          => [...QUERY_KEYS.inventory.all, "detail",     id] as const,
    summary:    (restaurantId: string) => [...QUERY_KEYS.inventory.all, "summary",    restaurantId] as const,
    lowStock:   (restaurantId: string) => [...QUERY_KEYS.inventory.all, "low-stock",  restaurantId] as const,
    categories: (restaurantId: string) => [...QUERY_KEYS.inventory.all, "categories", restaurantId] as const,
    suppliers:  (restaurantId: string) => [...QUERY_KEYS.inventory.all, "suppliers",  restaurantId] as const,
  },

  customers: {
    all:     ["customers"] as const,
    lists:   () => [...QUERY_KEYS.customers.all, "list"] as const,
    list:    (filters?: Record<string, unknown>) => [...QUERY_KEYS.customers.lists(), filters] as const,
    detail:  (id: string)          => [...QUERY_KEYS.customers.all, "detail",  id] as const,
    summary: (restaurantId: string) => [...QUERY_KEYS.customers.all, "summary", restaurantId] as const,
  },

  employees: {
    all:     ["employees"] as const,
    lists:   () => [...QUERY_KEYS.employees.all, "list"] as const,
    list:    (filters?: Record<string, unknown>) => [...QUERY_KEYS.employees.lists(), filters] as const,
    detail:  (id: string)          => [...QUERY_KEYS.employees.all, "detail",  id] as const,
    summary: (restaurantId: string) => [...QUERY_KEYS.employees.all, "summary", restaurantId] as const,
  },
  kitchen: {
    all:    ["kitchen"] as const,
    orders: (restaurantId: string) => [...QUERY_KEYS.kitchen.all, "orders", restaurantId] as const,
    stats:  (restaurantId: string) => [...QUERY_KEYS.kitchen.all, "stats",  restaurantId] as const,
  },

  tables: {
    all:          ["tables"] as const,
    floor:        (restaurantId: string) => [...QUERY_KEYS.tables.all, "floor",        restaurantId] as const,
    reservations: (restaurantId: string) => [...QUERY_KEYS.tables.all, "reservations", restaurantId] as const,
    options:      (restaurantId: string) => [...QUERY_KEYS.tables.all, "options",      restaurantId] as const,
  },

  settings: {
    all:           ["settings"] as const,
    restaurant:    (restaurantId: string) => [...QUERY_KEYS.settings.all, "restaurant",    restaurantId] as const,
    businessHours: (restaurantId: string) => [...QUERY_KEYS.settings.all, "business-hours", restaurantId] as const,
    notifications: (restaurantId: string) => [...QUERY_KEYS.settings.all, "notifications",  restaurantId] as const,
    integrations:  (restaurantId: string) => [...QUERY_KEYS.settings.all, "integrations",   restaurantId] as const,
  },

  notifications: {
    all:      ["notifications"] as const,
    list:     (restaurantId: string, userId: string) => [...["notifications"], "list", restaurantId, userId] as const,
    unread:   (restaurantId: string, userId: string) => [...["notifications"], "unread", restaurantId, userId] as const,
  },

  reports: {
    all:              ["reports"] as const,
    dashboard:        (restaurantId: string, filters?: Record<string, unknown>) => [...QUERY_KEYS.reports.all, "dashboard", restaurantId, filters] as const,
    revenue:          (restaurantId: string, filters?: Record<string, unknown>) => [...QUERY_KEYS.reports.all, "revenue",          restaurantId, filters] as const,
    categorySales:    (restaurantId: string, filters?: Record<string, unknown>) => [...QUERY_KEYS.reports.all, "category-sales",   restaurantId, filters] as const,
    topItems:         (restaurantId: string, filters?: Record<string, unknown>) => [...QUERY_KEYS.reports.all, "top-items",        restaurantId, filters] as const,
    customerAnalytics:(restaurantId: string) => [...QUERY_KEYS.reports.all, "customer-analytics", restaurantId] as const,
    employeeAnalytics:(restaurantId: string) => [...QUERY_KEYS.reports.all, "employee-analytics", restaurantId] as const,
    inventoryAnalytics:(restaurantId: string) => [...QUERY_KEYS.reports.all, "inventory-analytics", restaurantId] as const,
    generated:        (restaurantId: string, filters?: Record<string, unknown>) => [...QUERY_KEYS.reports.all, "generated",        restaurantId, filters] as const,
  },
} as const;
