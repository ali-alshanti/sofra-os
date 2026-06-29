export {
  getDashboardReports,
  getRevenueReport,
  getCategorySalesReport,
  getTopSellingItemsReport,
  getCustomerAnalytics,
  getEmployeeAnalytics,
  getInventoryAnalytics,
  getGeneratedReports,
} from "./reports.service";

export type {
  DashboardReportStats,
  GetGeneratedReportsResult,
  TopSellingItem,
  CustomerAnalytics,
  EmployeeAnalytics,
  InventoryAnalytics,
} from "./reports.service";
