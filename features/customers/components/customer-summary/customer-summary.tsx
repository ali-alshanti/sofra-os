import { Users, Star, Zap, DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import { StatCard } from "@/components/shared/stat-card";

export interface CustomerStats {
  totalCustomers:  number;
  vipCustomers:    number;
  activeToday:     number;
  avgSpend:        string; // pre-formatted, e.g. "$84.50"
}

interface CustomerSummaryProps {
  stats: CustomerStats;
}

export function CustomerSummary({ stats }: CustomerSummaryProps) {
  const t = useTranslations("customers.summary");

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("total")}
          value={stats.totalCustomers.toLocaleString()}
          icon={Users}
          iconBg="oklch(0.596 0.145 163.225 / 0.08)"
          iconColor="oklch(0.596 0.145 163.225)"
          trend={{ value: "+12%", direction: "up" }}
        />
        <StatCard
          title={t("vip")}
          value={String(stats.vipCustomers)}
          icon={Star}
          iconBg="oklch(0.879 0.169 91.605 / 0.2)"
          iconColor="#ffb95f"
          badge="Growth"
          badgeStyle={{ bg: "#d5e3fc80", color: "#515f74" }}
        />
        <StatCard
          title={t("today")}
          value={String(stats.activeToday)}
          icon={Zap}
          iconBg="oklch(0.845 0.143 164.978 / 0.2)"
          iconColor="#0b513d"
          badge="Live"
          badgeStyle={{ bg: "#b0f0d6", color: "#0b513d" }}
        />
        <StatCard
          title={t("avgSpend")}
          value={stats.avgSpend}
          icon={DollarSign}
          iconBg="#d5e3fc80"
          iconColor="#515f74"
          badge="Avg."
          badgeStyle={{ bg: "#d5e3fc80", color: "#515f74" }}
        />
    </div>
  );
}
