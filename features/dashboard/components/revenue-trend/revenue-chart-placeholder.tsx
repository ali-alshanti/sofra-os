// Static bar chart placeholder — replace children with a real chart library when ready.
// Bar heights and colors match the Stitch Executive Dashboard design exactly.

const BARS = [
  { h: 40,  primary: false },
  { h: 55,  primary: false },
  { h: 45,  primary: false },
  { h: 65,  primary: true  },
  { h: 80,  primary: true  },
  { h: 95,  primary: true  },
  { h: 70,  primary: true  },
  { h: 60,  primary: false },
  { h: 50,  primary: false },
  { h: 65,  primary: false },
  { h: 85,  primary: true  },
  { h: 100, primary: true  },
  { h: 90,  primary: true  },
  { h: 75,  primary: true  },
  { h: 55,  primary: false },
  { h: 40,  primary: false },
  { h: 30,  primary: false },
  { h: 50,  primary: true  },
  { h: 65,  primary: true  },
  { h: 45,  primary: true  },
] as const;

const Y_LABELS = ["$10k", "$8k", "$6k", "$4k", "$2k"] as const;

const X_LABELS = [
  "08:00 AM",
  "12:00 PM",
  "04:00 PM",
  "08:00 PM",
  "12:00 AM",
] as const;

export function RevenueChartPlaceholder() {
  return (
    <div>
      {/* Bar area */}
      <div className="relative h-64 flex items-end gap-1">
        {/* Bars */}
        {BARS.map((bar, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-sm transition-opacity ${bar.primary ? "bg-primary opacity-90" : "bg-border"}`}
            style={{ height: `${bar.h}%` }}
          />
        ))}

        {/* Y-axis overlay */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {Y_LABELS.map((label) => (
            <div
              key={label}
              className="w-full flex justify-end border-t border-border/30"
            >
              <span className="typography-caption text-muted-foreground pr-2 -mt-2">
                {label}
              </span>
            </div>
          ))}
        </div>
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
