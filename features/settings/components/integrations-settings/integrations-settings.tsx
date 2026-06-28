import { Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { SettingsSectionCard } from "@/features/settings/components/settings-section-card";
import type { Integration, IntegrationStatus } from "@/features/settings/types";
import { cn } from "@/lib/utils";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  IntegrationStatus,
  { label: string; bg: string; color: string }
> = {
  connected: {
    label: "Connected",
    bg:    "oklch(0.845 0.143 164.978 / 0.25)",
    color: "oklch(0.362 0.072 165.670)",
  },
  disconnected: {
    label: "Not Connected",
    bg:    "oklch(0.929 0.013 255.508 / 0.6)",
    color: "oklch(0.554 0.046 257.417)",
  },
};

function IntegrationStatusBadge({ status }: { status: IntegrationStatus }) {
  const { label, bg, color } = STATUS_CONFIG[status];
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
  integration: Integration;
  onConnect?:    (id: string) => void;
  onDisconnect?: (id: string) => void;
  disabled?:     boolean;
}

function IntegrationCard({
  integration,
  onConnect,
  onDisconnect,
  disabled,
}: IntegrationCardProps) {
  const isConnected = integration.status === "connected";

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
        <IntegrationStatusBadge status={integration.status} />

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
          {isConnected ? "Disconnect" : "Connect"}
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
  return (
    <SettingsSectionCard
      title="Integrations"
      description="Connect third-party services to extend your restaurant's capabilities."
    >
      {integrations.length === 0 ? (
        <EmptyState
          icon={Plug}
          title="No integrations available"
          description="Integrations will appear here once they are added to your plan."
        />
      ) : (
        <div className="space-y-3">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
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
