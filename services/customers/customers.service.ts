import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils/format-currency";
import { todayStart } from "@/lib/utils/date";
import type {
  Customer,
  CustomerStatus,
  CustomerLoyalty,
  CustomerLoyaltyFilter,
  CustomerSegment,
} from "@/features/customers/types";
import type { CustomerStats } from "@/features/customers/components/customer-summary";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GetCustomersParams {
  restaurantId: string;
  page?:        number;
  pageSize?:    number;
  search?:      string;
  segment?:     CustomerSegment;
  loyalty?:     CustomerLoyaltyFilter;
  status?:      CustomerStatus | "all";
}

export interface GetCustomersResult {
  customers: Customer[];
  total:     number;
}

// ─── getCustomers ─────────────────────────────────────────────────────────────

export async function getCustomers({
  restaurantId,
  page     = 1,
  pageSize = 10,
  search,
  segment,
  loyalty,
  status,
}: GetCustomersParams): Promise<GetCustomersResult> {
  const supabase = getSupabaseBrowserClient();
  const from = (page - 1) * pageSize;
  const to   = from + pageSize - 1;

  let query = supabase
    .from("customers")
    .select(
      "id, full_name, email, phone, avatar_url, loyalty, status, total_spent, total_visits, last_visit_at, created_at",
      { count: "exact" },
    )
    .eq("restaurant_id", restaurantId)
    .eq("is_active", true)
    .order("total_spent", { ascending: false });

  // Server-side filters (must come before range to keep count accurate)
  if (status  && status  !== "all") query = query.eq("status", status);
  if (loyalty && loyalty !== "all") query = query.eq("loyalty", loyalty);
  if (segment === "vip")     query = query.eq("status", "vip");
  if (segment === "regular") query = query.neq("status", "vip");

  // Server-side search — applied before pagination so count is correct
  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
    );
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw new Error(error.message);

  return { customers: (data ?? []).map(mapRowToCustomer), total: count ?? 0 };
}

// ─── getCustomerSummary ───────────────────────────────────────────────────────

export async function getCustomerSummary(restaurantId: string): Promise<CustomerStats> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("customers")
    .select("status, total_spent, last_visit_at")
    .eq("restaurant_id", restaurantId)
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  const all = data ?? [];
  const totalSpent = all.reduce((s, c) => s + Number(c.total_spent), 0);
  const avg = all.length > 0 ? totalSpent / all.length : 0;

  return {
    totalCustomers: all.length,
    vipCustomers:   all.filter((c) => c.status === "vip").length,
    activeToday:    all.filter((c) => c.last_visit_at && c.last_visit_at >= todayStart()).length,
    avgSpend:       formatCurrency(avg),
  };
}

// ─── updateCustomer ───────────────────────────────────────────────────────────

export async function updateCustomer(
  customerId: string,
  patch: Partial<{
    full_name: string; email: string; phone: string;
    loyalty: CustomerLoyalty; status: CustomerStatus;
    notes: string;
  }>,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("customers")
    .update(patch)
    .eq("id", customerId);
  if (error) throw new Error(error.message);
}

// ─── deleteCustomer (soft — sets is_active = false) ──────────────────────────

export async function deleteCustomer(customerId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("customers")
    .update({ is_active: false })
    .eq("id", customerId);
  if (error) throw new Error(error.message);
}

// ─── Internal mapper ──────────────────────────────────────────────────────────

interface CustomerRow {
  id:            string;
  full_name:     string;
  email:         string | null;
  phone:         string | null;
  avatar_url:    string | null;
  loyalty:       string;
  status:        string;
  total_spent:   number;
  total_visits:  number;
  last_visit_at: string | null;
  created_at:    string;
}

function mapRowToCustomer(row: CustomerRow): Customer {
  return {
    id:         row.id,
    name:       row.full_name,
    email:      row.email ?? "",
    phone:      row.phone ?? "",
    avatarSrc:  row.avatar_url ?? undefined,
    loyalty:    row.loyalty as CustomerLoyalty,
    status:     row.status as CustomerStatus,
    totalSpent: Number(row.total_spent),
    visits:     Number(row.total_visits),
    lastVisit:  row.last_visit_at ?? row.created_at,
    joinedAt:   row.created_at,
  };
}
