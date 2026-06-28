"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Pagination } from "@/components/shared/pagination";
import { CustomerHeader } from "./components/customer-header";
import { CustomerSummary, type CustomerStats } from "./components/customer-summary";
import { CustomerFilters } from "./components/customer-filters";
import { CustomerTable } from "./components/customer-table";
import {
  DEFAULT_CUSTOMER_FILTERS,
  type CustomerFiltersValue,
  type CustomerSegment,
  type CustomerLoyaltyFilter,
  type CustomerStatus,
  type Customer,
} from "./types";

// ─── Placeholder Data ─────────────────────────────────────────────────────────

const PLACEHOLDER_CUSTOMERS: Customer[] = [
  {
    id: "1", name: "Sophia Chen", email: "sophia.c@email.com",
    phone: "(555) 123-4567", joinedAt: "2023-01-15",
    visits: 24, lastVisit: "2023-10-22", totalSpent: 1240.00,
    loyalty: "platinum", status: "vip",
    avatarSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBO8XhIy0kTawQdCgZpbo-NSIjd55P2FDY9jmSgF_f_i0E3HWhkc4BY2j4wS_krQ2hr14SCTgmaOicSZ6Xz1W03VLgb0psn6aLDF_4vp7pc92uJScHoTSyFUS6JtJd7OMy-8V-gSqVBhzLczVYVnJEzPSMHxQfZmTkFvuiVpmAbzw0Os9FqjbYat_TTvLzHrribLZOH9IRZFIK8t-4-TIOSMpn6J_Gbj_0WX868Dmw566erhCX335Nx4PaglKNWSW9DHH1lbiBf-g",
  },
  {
    id: "2", name: "Marcus Vane", email: "m.vane@domain.com",
    phone: "(555) 987-6543", joinedAt: "2023-05-20",
    visits: 12, lastVisit: "2023-10-15", totalSpent: 680.00,
    loyalty: "gold", status: "active",
    avatarSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsoqHU6ULfWK5fSoDQl6IPHODI9nQrMbCgOgvr_9rMN_QZ88oTWk5Ng9ayjkZ3p3eWVP9WZLII088PNqEBD8DVxDPFbrpVnJ6A0uEYAQLOaSFx9VFOx2G4cpEsxJQLIOW-uuQJoxx7k86jFP6nY-o1tni7ir-r-g4a0x8hUhBMLUS4J2kaKNLJ0IGP1g1paAosRvqzI_B-6_0GpRT_TaocOZbipBGj7e88is-fvGC_a7VI7l61i5aE_l1xn_kgmJqWBAuynzFpdQ",
  },
  {
    id: "3", name: "Elena Rossi", email: "elena.r@web.com",
    phone: "(555) 456-7890", joinedAt: "2023-08-03",
    visits: 5, lastVisit: "2023-09-30", totalSpent: 210.00,
    loyalty: "silver", status: "active",
    avatarSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNKKYyjZag7NS_GBp6ms0WegNeKzP483sJElMuizRSh5y7r-EaPT0Pcv3-EpzTyPKF3K5bgmIXixnJJWXE-pJCQ3TU-ZWSeP35sQ60kt8ySAz3O6lBG2PZC9E8iiHAjCwv7BzANydyxzQggnozYh6plOAWFFO-Fmerzb19jNi4Qg_62EqPSIFK0r2GXzeY5ra_MKY15F8f4uk7DqKkJ3Ho3jpd1ZTeFB96E-LjNlwzSna3rXq0pNoTVNelFr31LcpTRlOByT0v1Q",
  },
  {
    id: "4", name: "Michael K.", email: "mike.k@provider.com",
    phone: "(555) 222-3333", joinedAt: "2023-10-01",
    visits: 2, lastVisit: "2023-08-12", totalSpent: 85.00,
    loyalty: "bronze", status: "inactive",
    avatarSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvnrIiQclc3H7UFrQX99EsntN9Vq5Qca2Bpl1aRvflLI9SQlpoNszC60km65Il38CP1GJVskKVqszoRRihQWWnTuLldw-B2UZAnTOHEIZ1WtMSWmqFS87uL3OGBQ1pnVWRoixVug7slCtDPgDVOxpus9tb71MYiQXDGEKOUZhC3fT6W6X8sjAS01L7fQy-DwCtacWUvWONBwHEvSNj4qtliPAwgd90W5ktMdjBGOlI0Zrcid8t_LM_vAR8oosyZabJa91qQ",
  },
];

const PLACEHOLDER_STATS: CustomerStats = {
  totalCustomers: 1284,
  vipCustomers:   86,
  activeToday:    42,
  avgSpend:       "$84.50",
};

// ─── Customers Feature ────────────────────────────────────────────────────────

export function CustomersFeature() {
  const [filters, setFilters] = useState<CustomerFiltersValue>(DEFAULT_CUSTOMER_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCustomers = PLACEHOLDER_CUSTOMERS.filter((c) => {
    if (filters.status !== "all" && c.status !== filters.status) return false;
    if (filters.loyalty !== "all" && c.loyalty !== filters.loyalty) return false;
    if (filters.segment === "vip" && c.status !== "vip") return false;
    if (filters.segment === "regular" && c.status === "vip") return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) &&
          !c.email.toLowerCase().includes(q) &&
          !c.phone.includes(q)) return false;
    }
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <CustomerHeader
          onRefresh={() => undefined}
          onExport={() => undefined}
          onAddCustomer={() => undefined}
        />

        <CustomerSummary stats={PLACEHOLDER_STATS} />

        <CustomerFilters
          value={filters}
          onSearchChange={(s) => { setFilters(f => ({ ...f, search: s })); setCurrentPage(1); }}
          onSegmentChange={(seg) => { setFilters(f => ({ ...f, segment: seg as CustomerSegment })); setCurrentPage(1); }}
          onLoyaltyChange={(loy) => { setFilters(f => ({ ...f, loyalty: loy as CustomerLoyaltyFilter })); setCurrentPage(1); }}
          onStatusChange={(st) => { setFilters(f => ({ ...f, status: st as CustomerStatus | "all" })); setCurrentPage(1); }}
        />

        <CustomerTable
          customers={filteredCustomers}
          onView={(id) => undefined}
          onEdit={(id) => undefined}
          onDelete={(id) => undefined}
          pagination={
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(1284 / 10)}
              totalItems={1284}
              pageSize={10}
              itemLabel="customers"
              onPageChange={setCurrentPage}
            />
          }
        />
      </div>
    </AppShell>
  );
}
