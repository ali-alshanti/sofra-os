import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LandingPage } from "@/features/landing";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.hero" });

  const title = "Sofra OS — Restaurant Operations, Simplified";
  const description = t("subheadline");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function LocaleRootPage() {
  return <LandingPage />;
}
