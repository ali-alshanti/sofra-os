export {
  getDashboardReports,
  getRevenueReport,
  getCategorySalesReport,
  getTopSellingItemsReport,
  getCustomerAnalytics,
  getGeneratedReports,
} from "./reports.service";

export type {
  DashboardReportStats,
  GetGeneratedReportsResult,
  TopSellingItem,
  CustomerAnalytics,
} from "./reports.service";
