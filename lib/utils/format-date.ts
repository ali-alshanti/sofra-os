type DateInput = Date | string | number;

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatDate(value: DateInput, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(toDate(value));
}

export function formatDateTime(value: DateInput, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(toDate(value));
}

export function formatTime(value: DateInput, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(toDate(value));
}

export function formatRelativeDate(value: DateInput): string {
  const diffSeconds = Math.round((toDate(value).getTime() - Date.now()) / 1000);
  const abs = Math.abs(diffSeconds);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (abs < 60) return rtf.format(diffSeconds, "second");
  if (abs < 3600) return rtf.format(Math.round(diffSeconds / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diffSeconds / 3600), "hour");
  if (abs < 2592000) return rtf.format(Math.round(diffSeconds / 86400), "day");
  if (abs < 31536000) return rtf.format(Math.round(diffSeconds / 2592000), "month");
  return rtf.format(Math.round(diffSeconds / 31536000), "year");
}
