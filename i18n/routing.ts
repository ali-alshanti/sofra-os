import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  // Only prefix non-default locales: /dashboard (EN), /ar/dashboard (AR)
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
