export function formatNumber(
  value: number,
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatDecimal(
  value: number,
  decimals = 2,
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(
  value: number,
  decimals = 1,
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

export function formatCompact(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
