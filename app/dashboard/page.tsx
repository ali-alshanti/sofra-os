import {
  DollarSign,
  ShoppingBag,
  LayoutGrid,
  AlertTriangle,
  Plus,
  UtensilsCrossed,
  Table2,
  BarChart2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// ─── KPI Data ────────────────────────────────────────────────────────────────

const KPI_STATS = [
  {
    title: "Total Revenue",
    value: "$0.00",
    icon: DollarSign,
    description: "vs last month",
    trend: { value: "0%", direction: "neutral" as const },
  },
  {
    title: "Orders Today",
    value: "0",
    icon: ShoppingBag,
    description: "vs yesterday",
    trend: { value: "0%", direction: "neutral" as const },
  },
  {
    title: "Active Tables",
    value: "0 / 0",
    icon: LayoutGrid,
    description: "tables occupied",
    trend: { value: "0%", direction: "neutral" as const },
  },
  {
    title: "Inventory Alerts",
    value: "0",
    icon: AlertTriangle,
    description: "items low on stock",
    trend: { value: "0", direction: "neutral" as const },
  },
];

// ─── Quick Actions ────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    icon: Plus,
    title: "New Order",
    description: "Create a new customer order",
  },
  {
    icon: UtensilsCrossed,
    title: "Add Menu Item",
    description: "Add a new item to the menu",
  },
  {
    icon: Table2,
    title: "Manage Tables",
    description: "View and manage table layout",
  },
  {
    icon: BarChart2,
    title: "View Reports",
    description: "Analyze sales and performance",
  },
];

// ─── Recent Orders Placeholder Row ───────────────────────────────────────────

function OrderRowPlaceholder() {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-muted" />
        <div className="space-y-1.5">
          <div className="h-3 w-28 rounded bg-muted" />
          <div className="h-2.5 w-20 rounded bg-muted/60" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="h-5 w-16 rounded-full bg-muted" />
      </div>
    </div>
  );
}

// ─── Inventory Alert Placeholder Row ─────────────────────────────────────────

function InventoryRowPlaceholder() {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-muted" />
        <div className="space-y-1.5">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-2.5 w-16 rounded bg-muted/60" />
        </div>
      </div>
      <Badge variant="destructive" className="opacity-40">
        Low Stock
      </Badge>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-8">

        {/* 1 — Page Header */}
        <PageHeader
          title="Dashboard"
          description="Welcome back. Here's what's happening at your restaurant today."
          actions={
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          }
        />

        {/* 2 — KPI Stats */}
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {KPI_STATS.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
        </section>

        {/* 3 — Analytics Charts */}
        <section className="space-y-4">
          <SectionHeader
            title="Analytics"
            subtitle="Revenue and order trends"
            action={
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            }
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCard
              title="Revenue Overview"
              description="Monthly revenue — chart coming soon"
            >
              <div className="flex h-52 items-center justify-center rounded-lg bg-muted/30">
                <span className="typography-small text-muted-foreground">
                  Chart placeholder
                </span>
              </div>
            </ChartCard>
            <ChartCard
              title="Orders by Category"
              description="Breakdown by menu category — chart coming soon"
            >
              <div className="flex h-52 items-center justify-center rounded-lg bg-muted/30">
                <span className="typography-small text-muted-foreground">
                  Chart placeholder
                </span>
              </div>
            </ChartCard>
          </div>
        </section>

        {/* 4 — Quick Actions */}
        <section className="space-y-4">
          <SectionHeader title="Quick Actions" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {QUICK_ACTIONS.map((action) => (
              <QuickActionCard key={action.title} {...action} />
            ))}
          </div>
        </section>

        {/* 5 — Recent Orders + 6 — Inventory Alerts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

          {/* Recent Orders */}
          <ChartCard
            title="Recent Orders"
            description="Latest orders across all tables"
            action={
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            }
          >
            {false ? (
              /* Replace `false` with real data check */
              <EmptyState
                icon={ShoppingBag}
                title="No orders yet"
                description="Orders will appear here once customers start ordering."
              />
            ) : (
              <div className="divide-y divide-border">
                {Array.from({ length: 5 }).map((_, i) => (
                  <OrderRowPlaceholder key={i} />
                ))}
              </div>
            )}
          </ChartCard>

          {/* Inventory Alerts */}
          <ChartCard
            title="Inventory Alerts"
            description="Items running low on stock"
            action={
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Manage <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            }
          >
            {false ? (
              /* Replace `false` with real data check */
              <EmptyState
                icon={AlertTriangle}
                title="All stocked up"
                description="No inventory alerts at the moment."
              />
            ) : (
              <div className="divide-y divide-border">
                {Array.from({ length: 4 }).map((_, i) => (
                  <InventoryRowPlaceholder key={i} />
                ))}
              </div>
            )}
          </ChartCard>

        </div>

      </div>
    </AppShell>
  );
}
