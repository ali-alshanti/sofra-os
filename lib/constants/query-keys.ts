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
    all:     ["orders"] as const,
    lists:   () => [...QUERY_KEYS.orders.all, "list"] as const,
    list:    (filters?: Record<string, unknown>) => [...QUERY_KEYS.orders.lists(), filters] as const,
    detail:  (id: string)          => [...QUERY_KEYS.orders.all, "detail",  id] as const,
    summary: (restaurantId: string) => [...QUERY_KEYS.orders.all, "summary", restaurantId] as const,
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
} as const;
