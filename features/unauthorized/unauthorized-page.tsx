"use client";

import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { ROUTES } from "@/lib/constants/routes";

export function UnauthorizedFeature() {
  const t = useTranslations("unauthorized");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("title")}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <Button asChild>
        <Link href={ROUTES.DASHBOARD}>{t("backToDashboard")}</Link>
      </Button>
    </div>
  );
}
