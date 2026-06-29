import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/lib/providers/providers";

// ─── Props ────────────────────────────────────────────────────────────────────

interface LocaleLayoutProps {
  children: React.ReactNode;
  params:   Promise<{ locale: string }>;
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    /*
      messages must be passed explicitly so client components receive translations.
      NextIntlClientProvider uses an inline <script> to transport messages —
      suppressHydrationWarning on it silences the React 19 console warning.
    */
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  );
}
