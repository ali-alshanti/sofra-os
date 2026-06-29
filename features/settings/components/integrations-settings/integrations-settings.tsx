import { Plug } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { SettingsSectionCard } from "@/features/settings/components/settings-section-card";
import type { Integration, IntegrationStatus } from "@/features/settings/types";
import { cn } from "@/lib/utils";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<IntegrationStatus, { bg: string; color: string }> = {
  connected: {
    bg:    "oklch(0.845 0.143 164.978 / 0.25)",
    color: "oklch(0.362 0.072 165.670)",
  },
  disconnected: {
    bg:    "oklch(0.929 0.013 255.508 / 0.6)",
    color: "oklch(0.554 0.046 257.417)",
  },
};

function IntegrationStatusBadge({
  status,
  label,
}: {
  status: IntegrationStatus;
  label:  string;
}) {
  const { bg, color } = STATUS_COLORS[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full typography-caption font-medium"
      style={{ background: bg, color }}
    >
      {status === "connected" && (
        <span
          className="mr-1.5 h-1.5 w-1.5 rounded-full"
          style={{ background: color }}
        />
      )}
      {label}
    </span>
  );
}

// ─── Integration Card ─────────────────────────────────────────────────────────

interface IntegrationCardProps {
  integration:   Integration;
  connectLabel:  string;
  disconnectLabel: string;
  connectedLabel:  string;
  disconnectedLabel: string;
  onConnect?:    (id: string) => void;
  onDisconnect?: (id: string) => void;
  disabled?:     boolean;
}

function IntegrationCard({
  integration,
  connectLabel,
  disconnectLabel,
  connectedLabel,
  disconnectedLabel,
  onConnect,
  onDisconnect,
  disabled,
}: IntegrationCardProps) {
  const isConnected = integration.status === "connected";
  const statusLabel = isConnected ? connectedLabel : disconnectedLabel;

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-border p-4",
        "transition-colors hover:bg-muted/30",
      )}
    >
      {/* Logo placeholder */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Plug size={18} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-sm font-semibold text-foreground truncate">
          {integration.name}
        </p>
        <p className="typography-small text-muted-foreground line-clamp-1">
          {integration.description}
        </p>
      </div>

      {/* Status + action */}
      <div className="flex shrink-0 items-center gap-3">
        <IntegrationStatusBadge status={integration.status} label={statusLabel} />

        <Button
          variant={isConnected ? "outline" : "default"}
          size="sm"
          disabled={disabled}
          onClick={() =>
            isConnected
              ? onDisconnect?.(integration.id)
              : onConnect?.(integration.id)
          }
        >
          {isConnected ? disconnectLabel : connectLabel}
        </Button>
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface IntegrationsSettingsProps {
  integrations:  Integration[];
  onConnect?:    (id: string) => void;
  onDisconnect?: (id: string) => void;
  disabled?:     boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function IntegrationsSettings({
  integrations,
  onConnect,
  onDisconnect,
  disabled = false,
}: IntegrationsSettingsProps) {
  const t = useTranslations("settings.integrations");

  return (
    <SettingsSectionCard
      title={t("title")}
      description={t("description")}
    >
      {integrations.length === 0 ? (
        <EmptyState
          icon={Plug}
          title={t("empty.title")}
          description={t("empty.description")}
        />
      ) : (
        <div className="space-y-3">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              connectLabel={t("connect")}
              disconnectLabel={t("disconnect")}
              connectedLabel={t("connected")}
              disconnectedLabel={t("disconnected")}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </SettingsSectionCard>
  );
}
