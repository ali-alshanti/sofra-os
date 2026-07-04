"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

const RTL_LOCALES = new Set(["ar"]);

export function LocaleAttributesSync() {
  const locale = useLocale();

  useEffect(() => {
    const isRtl = RTL_LOCALES.has(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.body.classList.toggle("font-cairo", isRtl);
  }, [locale]);

  return null;
}
