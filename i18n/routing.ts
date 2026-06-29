import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  // Only prefix non-default locales: /dashboard (EN), /ar/dashboard (AR)
  localePrefix: "as-needed",
  // Persist selected language across refreshes and new tabs
  localeCookie: true,
});

export type Locale = (typeof routing.locales)[number];
