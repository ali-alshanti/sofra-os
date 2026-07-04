import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Fallback to default locale if not valid
  if (!locale || !routing.locales.includes(locale as "en" | "ar")) {
    locale = routing.defaultLocale;
  }

  const messages = await loadMessages(locale as "en" | "ar");

  return { locale, messages };
});

async function loadMessages(locale: "en" | "ar") {
  const namespaces = [
    "common",
    "landing",
    "auth",
    "dashboard",
    "orders",
    "menu",
    "tables",
    "kitchen",
    "inventory",
    "customers",
    "employees",
    "reports",
    "settings",
  ];

  const loaded = await Promise.all(
    namespaces.map((ns) =>
      import(`../locales/${locale}/${ns}.json`).then((m) => [ns, m.default] as const),
    ),
  );

  return Object.fromEntries(loaded);
}
