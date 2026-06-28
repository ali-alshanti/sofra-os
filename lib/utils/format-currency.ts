interface CurrencyOptions {
  currency?: string;
  locale?: string;
  decimals?: number;
}

export function formatCurrency(
  value: number,
  { currency = "USD", locale = "en-US", decimals = 2 }: CurrencyOptions = {},
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCurrencyCompact(
  value: number,
  { currency = "USD", locale = "en-US" }: Omit<CurrencyOptions, "decimals"> = {},
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
