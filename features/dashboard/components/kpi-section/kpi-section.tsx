import {
  CreditCard,
  ShoppingBag,
  Table2,
  Gauge,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";

const KPI_CARDS = [
  {
    title: "Revenue",
    value: "$24,521.00",
    icon: CreditCard,
    iconBg: "#b0f0d6",
    iconColor: "#003527",
    trend: { value: "+12%", direction: "up" as const },
  },
  {
    title: "Orders Today",
    value: "142",
    icon: ShoppingBag,
    iconBg: "#d5e3fc",
    iconColor: "#515f74",
    description: "vs yesterday",
  },
  {
    title: "Active Tables",
    value: "18/25",
    icon: Table2,
    iconBg: "#ffddb8",
    iconColor: "#442800",
    badge: "72% Occ.",
  },
  {
    title: "Kitchen Load",
    value: "Optimal",
    icon: Gauge,
    iconBg: "#064e3b",
    iconColor: "#80bea6",
    pulse: true,
    pulseLabel: "Normal",
  },
] as const;

export function KpiSection() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {KPI_CARDS.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
