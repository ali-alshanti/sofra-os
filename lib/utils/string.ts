export function capitalize(value: string): string {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function truncate(value: string, maxLength: number, suffix = "..."): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength - suffix.length) + suffix;
}

export function initials(value: string, max = 2): string {
  return value
    .trim()
    .split(/\s+/)
    .slice(0, max)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");
}
