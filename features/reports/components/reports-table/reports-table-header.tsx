import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const REPORTS_COLUMNS = [
  { key: "name",        label: "Report Name",  className: ""           },
  { key: "type",        label: "Type",         className: "w-[130px]"  },
  { key: "period",      label: "Period",       className: "w-[140px]"  },
  { key: "generatedAt", label: "Generated At", className: "w-[140px]"  },
  { key: "status",      label: "Status",       className: "w-[130px]"  },
  { key: "actions",     label: "",             className: "w-[48px]"   },
] as const;

export type ReportColumnKey = (typeof REPORTS_COLUMNS)[number]["key"];

export function ReportsTableHeader() {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent border-border">
        {REPORTS_COLUMNS.map((col) => (
          <TableHead
            key={col.key}
            className={`typography-caption uppercase tracking-widest text-muted-foreground font-medium ${col.className}`}
          >
            {col.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
