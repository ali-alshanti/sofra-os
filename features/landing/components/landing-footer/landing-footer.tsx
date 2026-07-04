"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";

export function LandingFooter() {
  const t = useTranslations("landing.footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                S
              </span>
              <span className="font-heading text-base font-semibold">Sofra OS</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{t("tagline")}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">{t("product")}</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground">
                  {t("features")}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-foreground">
                  {t("pricing")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  {t("github")}
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground">
                  {t("liveDemo")}
                </Link>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground">
                  {t("contact")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          {t("copyright", { year })}
        </div>
      </div>
    </footer>
  );
}
