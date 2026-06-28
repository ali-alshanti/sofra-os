// ─── Primitives ────────────────────────────────────────────────────────────────

/** Current operational state of the customer account */
export type CustomerStatus = "vip" | "active" | "inactive";

/** Loyalty programme tier */
export type CustomerLoyalty = "platinum" | "gold" | "silver" | "bronze" | "none";

/**
 * CustomerSegment — used for filter controls only.
 * "all" is a sentinel value for "no filter applied".
 * Does NOT represent a real customer property.
 */
export type CustomerSegment = "all" | "vip" | "regular";

// ─── Loyalty filter (UI) ──────────────────────────────────────────────────────

export type CustomerLoyaltyFilter = "all" | CustomerLoyalty;

// ─── Entity ───────────────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarSrc?: string;
  /** ISO string or Date — displayed as "Joined MMM YYYY" */
  joinedAt: Date | string;
  visits: number;
  /** ISO string or Date — displayed as "MMM DD, YYYY" */
  lastVisit: Date | string;
  totalSpent: number;
  loyalty: CustomerLoyalty;
  status: CustomerStatus;
}

// ─── Filter value ─────────────────────────────────────────────────────────────

export interface CustomerFiltersValue {
  search:   string;
  segment:  CustomerSegment;
  loyalty:  CustomerLoyaltyFilter;
  status:   CustomerStatus | "all";
}

export const DEFAULT_CUSTOMER_FILTERS: CustomerFiltersValue = {
  search:  "",
  segment: "all",
  loyalty: "all",
  status:  "all",
};
