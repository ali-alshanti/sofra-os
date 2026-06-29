import type { ReactNode } from "react";
import { ImagePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { SettingsSectionCard } from "@/features/settings/components/settings-section-card";
import type { GeneralSettingsFormValues } from "@/features/settings/types";

// ─── Field Row ────────────────────────────────────────────────────────────────

function FieldRow({
  label,
  htmlFor,
  children,
}: {
  label:   string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3 sm:items-center">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground sm:col-span-1"
      >
        {label}
      </label>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface GeneralSettingsFormProps {
  values:    GeneralSettingsFormValues;
  onChange:  (patch: Partial<GeneralSettingsFormValues>) => void;
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GeneralSettingsForm({
  values,
  onChange,
  disabled = false,
}: GeneralSettingsFormProps) {
  const t = useTranslations("settings.general");

  return (
    <SettingsSectionCard
      title={t("title")}
      description={t("description")}
    >
      {/* Logo placeholder */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted text-muted-foreground">
          <ImagePlus size={22} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{t("logo")}</p>
          <p className="typography-small text-muted-foreground">
            {t("logoHint")}
          </p>
        </div>
      </div>

      <div className="h-px bg-border/60" />

      <FieldRow label={t("name")} htmlFor="restaurantName">
        <Input
          id="restaurantName"
          type="text"
          placeholder={t("namePlaceholder")}
          value={values.restaurantName}
          onChange={(e) => onChange({ restaurantName: e.target.value })}
          disabled={disabled}
          className="h-10"
        />
      </FieldRow>

      <FieldRow label={t("email")} htmlFor="email">
        <Input
          id="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          value={values.email}
          onChange={(e) => onChange({ email: e.target.value })}
          disabled={disabled}
          className="h-10"
        />
      </FieldRow>

      <FieldRow label={t("phone")} htmlFor="phone">
        <Input
          id="phone"
          type="tel"
          placeholder={t("phonePlaceholder")}
          value={values.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          disabled={disabled}
          className="h-10"
        />
      </FieldRow>

      <FieldRow label={t("address")} htmlFor="address">
        <Input
          id="address"
          type="text"
          placeholder={t("addressPlaceholder")}
          value={values.address}
          onChange={(e) => onChange({ address: e.target.value })}
          disabled={disabled}
          className="h-10"
        />
      </FieldRow>
    </SettingsSectionCard>
  );
}
