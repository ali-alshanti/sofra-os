import type { ReactNode } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsSectionCard } from "@/features/settings/components/settings-section-card";
import { useRouter, usePathname } from "@/lib/navigation";
import type { SystemSettings, ThemeMode } from "@/features/settings/types";

// ─── Static options (labels are intentionally locale-neutral) ─────────────────
// Only the locales the app actually supports — see i18n/routing.ts.

const LANGUAGE_OPTIONS: { value: "en" | "ar"; label: string }[] = [
  { value: "en", label: "English"  },
  { value: "ar", label: "العربية"  },
];

const TIMEZONE_OPTIONS: { value: string; label: string }[] = [
  { value: "UTC",                label: "UTC"                           },
  { value: "America/New_York",   label: "Eastern Time (US & Canada)"   },
  { value: "America/Chicago",    label: "Central Time (US & Canada)"   },
  { value: "America/Los_Angeles",label: "Pacific Time (US & Canada)"   },
  { value: "Europe/London",      label: "London"                       },
  { value: "Europe/Paris",       label: "Paris"                        },
  { value: "Asia/Riyadh",        label: "Riyadh"                       },
  { value: "Asia/Dubai",         label: "Dubai"                        },
  { value: "Asia/Beirut",        label: "Beirut"                       },
  { value: "Asia/Amman",         label: "Amman"                        },
  { value: "Asia/Cairo",         label: "Cairo"                        },
];

const DATE_FORMAT_OPTIONS: { value: string; label: string }[] = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY — e.g. 06/28/2026" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY — e.g. 28/06/2026" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD — e.g. 2026-06-28" },
  { value: "DD MMM YYYY",label: "DD MMM YYYY — e.g. 28 Jun 2026"},
];

// ─── Field Row ────────────────────────────────────────────────────────────────

function FieldRow({
  label,
  htmlFor,
  children,
}: {
  label:    string;
  htmlFor:  string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3 sm:items-center">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground sm:col-span-1">
        {label}
      </label>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SystemSettingsFormProps {
  values:    SystemSettings;
  onChange:  (patch: Partial<SystemSettings>) => void;
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SystemSettingsForm({
  values,
  onChange,
  disabled = false,
}: SystemSettingsFormProps) {
  const t = useTranslations("settings.system");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function handleLanguageChange(next: string) {
    onChange({ language: next });
    router.replace(pathname, { locale: next as "en" | "ar" });
  }

  const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
    { value: "light",  label: t("themes.light")  },
    { value: "dark",   label: t("themes.dark")   },
    { value: "system", label: t("themes.system") },
  ];

  return (
    <SettingsSectionCard
      title={t("title")}
      description={t("description")}
    >
      <FieldRow label={t("theme")} htmlFor="theme">
        <Select
          value={values.theme}
          onValueChange={(v) => onChange({ theme: v as ThemeMode })}
          disabled={disabled}
        >
          <SelectTrigger id="theme" className="h-10">
            <SelectValue placeholder={t("themeSelect")} />
          </SelectTrigger>
          <SelectContent>
            {THEME_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>

      <FieldRow label={t("language")} htmlFor="language">
        <Select
          value={locale}
          onValueChange={handleLanguageChange}
          disabled={disabled}
        >
          <SelectTrigger id="language" className="h-10">
            <SelectValue placeholder={t("languageSelect")} />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>

      <FieldRow label={t("timezone")} htmlFor="timezone">
        <Select
          value={values.timezone}
          onValueChange={(v) => onChange({ timezone: v })}
          disabled={disabled}
        >
          <SelectTrigger id="timezone" className="h-10">
            <SelectValue placeholder={t("timezoneSelect")} />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>

      <FieldRow label={t("dateFormat")} htmlFor="dateFormat">
        <Select
          value={values.dateFormat}
          onValueChange={(v) => onChange({ dateFormat: v })}
          disabled={disabled}
        >
          <SelectTrigger id="dateFormat" className="h-10">
            <SelectValue placeholder={t("dateFormatSelect")} />
          </SelectTrigger>
          <SelectContent>
            {DATE_FORMAT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>
    </SettingsSectionCard>
  );
}
