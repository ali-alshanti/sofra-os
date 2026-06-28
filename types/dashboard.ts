export interface DashboardSummary {
  revenueToday:          number;
  revenueChangePercent:  number | null;   // vs yesterday
  ordersToday:           number;
  ordersChangePercent:   number | null;
  activeTablesCount:     number;
  totalTablesCount:      number;
  occupancyPercent:      number;
  kitchenStatus:         "optimal" | "moderate" | "busy";
}

export interface RevenueDataPoint {
  hour:      number;         // 0–23
  label:     string;         // "08:00 AM"
  revenue:   number;
  isPrimary: boolean;        // hours with orders (colored bars)
}

export interface TopSellingItem {
  menuItemId:  string;
  name:        string;
  category:    string;
  price:       number;
  orderCount:  number;
  imageSrc:    string | null;
}

export interface InventoryAlert {
  id:            string;
  name:          string;
  quantity:      number;
  unit:          string;
  reorderPoint:  number;
  stockPercent:  number;   // 0–100 for the progress bar
  status:        "low_stock" | "out_of_stock";
}
