import { useTranslations } from "next-intl";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const REPORTS_COLUMN_KEYS = [
  { key: "name",        className: ""           },
  { key: "type",        className: "w-[130px]"  },
  { key: "period",      className: "w-[140px]"  },
  { key: "generatedAt", className: "w-[140px]"  },
  { key: "status",      className: "w-[130px]"  },
  { key: "actions",     className: "w-[48px]"   },
] as const;

// Keep REPORTS_COLUMNS export for backward compatibility with colspan usage
export const REPORTS_COLUMNS = REPORTS_COLUMN_KEYS;

export type ReportColumnKey = (typeof REPORTS_COLUMN_KEYS)[number]["key"];

export function ReportsTableHeader() {
  const t = useTranslations("reports.table");

  const COLUMNS = [
    { key: "name",        label: t("name"),      className: ""           },
    { key: "type",        label: t("type"),      className: "w-[130px]"  },
    { key: "period",      label: t("period"),    className: "w-[140px]"  },
    { key: "generatedAt", label: t("generated"), className: "w-[140px]"  },
    { key: "status",      label: t("status"),    className: "w-[130px]"  },
    { key: "actions",     label: "",             className: "w-[48px]"   },
  ] as const;

  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent border-border">
        {COLUMNS.map((col) => (
          <TableHead
            key={col.key}
            className={cn("typography-caption uppercase tracking-widest text-muted-foreground font-medium", col.className)}
          >
            {col.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
