// ─── Day-boundary helpers ──────────────────────────────────────────────────────

export function todayStart(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function yesterdayStart(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function yesterdayEnd(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

export function daysAgoStart(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// ─── DB time column helpers ────────────────────────────────────────────────────
// Postgres TIME columns return "HH:MM:SS" — UI only needs "HH:MM"

export function fromDbTime(t: string | null | undefined): string {
  if (!t) return "08:00";
  return t.slice(0, 5);
}

export function toDbTime(t: string): string {
  // Ensure "HH:MM:SS" format expected by Postgres TIME columns
  return t.length === 5 ? `${t}:00` : t;
}
