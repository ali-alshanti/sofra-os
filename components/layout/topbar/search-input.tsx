"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";

export function SearchInput() {
  const t = useTranslations("common.search");

  return (
    <div className="relative w-64">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={t("placeholder")}
        className="h-9 pl-9 text-sm bg-background"
      />
    </div>
  );
}
