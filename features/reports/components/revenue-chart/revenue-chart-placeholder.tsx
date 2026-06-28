// Static placeholder — replaced with a real chart library when ready.
// Renders actual vs. forecast bars using only CSS — no dependencies.

const BARS = [
  { actual: 42, forecast: 50 },
  { actual: 58, forecast: 55 },
  { actual: 48, forecast: 60 },
  { actual: 70, forecast: 65 },
  { actual: 85, forecast: 72 },
  { actual: 95, forecast: 80 },
  { actual: 78, forecast: 85 },
  { actual: 62, forecast: 75 },
  { actual: 55, forecast: 68 },
  { actual: 72, forecast: 70 },
  { actual: 88, forecast: 78 },
  { actual: 100, forecast: 90 },
] as const;

const Y_LABELS = ["$10k", "$8k", "$6k", "$4k", "$2k"] as const;

const X_LABELS = [
  "08:00 AM",
  "10:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
] as const;

function Legend() {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: "oklch(0.596 0.145 163.225)" }}
        />
        <span className="typography-small text-muted-foreground">Actual</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full opacity-40"
          style={{ background: "oklch(0.554 0.046 257.417)" }}
        />
        <span className="typography-small text-muted-foreground">Forecast</span>
      </div>
    </div>
  );
}

export function RevenueChartPlaceholder() {
  return (
    <div>
      <Legend />

      {/* Bar area */}
      <div className="relative h-64 flex items-end gap-1.5">
        {/* Horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {Y_LABELS.map((label) => (
            <div key={label} className="w-full border-t border-border/30 flex justify-end">
              <span className="typography-caption text-muted-foreground pr-2 -mt-2.5">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Bar pairs */}
        {BARS.map((bar, i) => (
          <div key={i} className="flex-1 flex items-end gap-px">
            {/* Actual */}
            <div
              className="flex-1 rounded-t-sm"
              style={{
                height:     `${bar.actual}%`,
                background: "oklch(0.596 0.145 163.225)",
                opacity:    0.9,
              }}
            />
            {/* Forecast */}
            <div
              className="flex-1 rounded-t-sm"
              style={{
                height:     `${bar.forecast}%`,
                background: "oklch(0.554 0.046 257.417)",
                opacity:    0.25,
              }}
            />
          </div>
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-3 px-1">
        {X_LABELS.map((label) => (
          <span key={label} className="typography-caption text-muted-foreground">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
