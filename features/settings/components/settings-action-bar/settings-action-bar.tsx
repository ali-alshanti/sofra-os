import { Save, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SettingsActionBarProps {
  /** Controls visibility — bar is hidden when false */
  isDirty:    boolean;
  loading?:   boolean;
  onSave?:    () => void;
  onDiscard?: () => void;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SettingsActionBar({
  isDirty,
  loading = false,
  onSave,
  onDiscard,
  className,
}: SettingsActionBarProps) {
  const t = useTranslations("settings.actionBar");

  return (
    <div
      aria-hidden={!isDirty}
      className={cn(
        // Layout
        "sticky bottom-0 z-10",
        "flex items-center justify-between gap-4",
        "px-6 py-4",
        // Visual
        "border-t border-border bg-card/95 backdrop-blur-sm shadow-elevated",
        // Transition
        "transition-all duration-200",
        isDirty
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-2 opacity-0 pointer-events-none",
        className,
      )}
    >
      {/* Left — unsaved changes label */}
      <p className="typography-small text-muted-foreground">
        {t("unsaved")}
      </p>

      {/* Right — actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={loading}
          onClick={onDiscard}
        >
          <RotateCcw size={14} />
          {t("discard")}
        </Button>

        <Button
          size="sm"
          className="gap-2"
          disabled={loading}
          onClick={onSave}
        >
          <Save size={14} />
          {loading ? t("saving") : t("save")}
        </Button>
      </div>
    </div>
  );
}
