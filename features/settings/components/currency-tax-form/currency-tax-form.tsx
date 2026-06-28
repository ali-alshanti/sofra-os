import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsSectionCard } from "@/features/settings/components/settings-section-card";
import type { CurrencySettings } from "@/features/settings/types";

// ─── Currency options ─────────────────────────────────────────────────────────

const CURRENCY_OPTIONS: { value: string; label: string }[] = [
  { value: "USD", label: "USD — US Dollar"          },
  { value: "EUR", label: "EUR — Euro"               },
  { value: "GBP", label: "GBP — British Pound"      },
  { value: "SAR", label: "SAR — Saudi Riyal"        },
  { value: "AED", label: "AED — UAE Dirham"         },
  { value: "EGP", label: "EGP — Egyptian Pound"     },
  { value: "JOD", label: "JOD — Jordanian Dinar"   },
  { value: "KWD", label: "KWD — Kuwaiti Dinar"     },
  { value: "QAR", label: "QAR — Qatari Riyal"      },
  { value: "BHD", label: "BHD — Bahraini Dinar"    },
];

// ─── Field Row ────────────────────────────────────────────────────────────────

function FieldRow({
  label,
  htmlFor,
  hint,
  children,
}: {
  label:    string;
  htmlFor:  string;
  hint?:    string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3 sm:items-start">
      <div className="sm:col-span-1 sm:pt-2.5">
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {hint && (
          <p className="typography-caption text-muted-foreground mt-0.5">{hint}</p>
        )}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface CurrencyTaxFormProps {
  values:    CurrencySettings;
  onChange:  (patch: Partial<CurrencySettings>) => void;
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CurrencyTaxForm({
  values,
  onChange,
  disabled = false,
}: CurrencyTaxFormProps) {
  return (
    <SettingsSectionCard
      title="Currency & Tax"
      description="Configure the currency and tax settings applied to all orders and receipts."
    >
      <FieldRow label="Currency" htmlFor="currency">
        <Select
          value={values.currency}
          onValueChange={(v) => onChange({ currency: v })}
          disabled={disabled}
        >
          <SelectTrigger id="currency" className="h-10">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>

      <FieldRow
        label="Tax Rate"
        htmlFor="taxRate"
        hint="Percentage applied to all taxable items"
      >
        <div className="relative">
          <Input
            id="taxRate"
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="0"
            value={values.taxRate}
            onChange={(e) => onChange({ taxRate: parseFloat(e.target.value) || 0 })}
            disabled={disabled}
            className="h-10 pr-8"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </div>
      </FieldRow>

      <FieldRow
        label="Tax Label"
        htmlFor="taxLabel"
        hint="Shown on receipts — e.g. VAT, GST, Sales Tax"
      >
        <Input
          id="taxLabel"
          type="text"
          placeholder="VAT"
          value={values.taxLabel}
          onChange={(e) => onChange({ taxLabel: e.target.value })}
          disabled={disabled}
          className="h-10"
        />
      </FieldRow>
    </SettingsSectionCard>
  );
}
