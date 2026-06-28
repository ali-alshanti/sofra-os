// ─── Settings Section ──────────────────────────────────────────────────────────

/**
 * Strongly typed union of all navigable settings panels.
 * Consumed by SettingsSidebar (nav items) and the page (active panel switch).
 * Typed as a union — not a string — so TypeScript enforces exhaustive coverage
 * when a component switches over every possible section.
 */
export type SettingsSection =
  | "general"
  | "business-hours"
  | "currency-tax"
  | "system"
  | "notifications"
  | "integrations";

// ─── General Settings ──────────────────────────────────────────────────────────

/**
 * The restaurant's public-facing identity.
 * Named "FormValues" to signal that this shape is what the controlled form
 * binds to — it may differ from the server response shape once an API exists.
 */
export interface GeneralSettingsFormValues {
  restaurantName: string;
  address:        string;
  phone:          string;
  email:          string;
  /** Absolute URL or relative path to the uploaded logo */
  logoUrl?:       string;
}

// ─── Business Hours ────────────────────────────────────────────────────────────

/**
 * The seven days of the week, ordered Monday → Sunday.
 * A separate primitive type so consumers can render an ordered array
 * (e.g. DAYS_OF_WEEK constant) while the BusinessHours record remains
 * key-addressable without any .find() calls.
 */
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

/**
 * Schedule entry for a single day.
 * openTime and closeTime are 24-hour strings ("08:00", "22:00") —
 * simple to compare, sort, and display without Date parsing.
 * Fields are only meaningful when open === true; the form should
 * disable the time selects when open is false.
 */
export interface DaySchedule {
  open:      boolean;
  openTime:  string; // "08:00"
  closeTime: string; // "22:00"
}

/**
 * A complete weekly schedule, keyed by DayOfWeek.
 * Using a Record over an array because:
 * 1. Individual days are accessed by key — no .find() needed.
 * 2. TypeScript enforces that all seven days are present.
 * 3. Partial updates are expressed as Partial<BusinessHours>, not index splices.
 */
export type BusinessHours = Record<DayOfWeek, DaySchedule>;

// ─── Currency & Tax ────────────────────────────────────────────────────────────

/**
 * Currency and tax configuration for the restaurant.
 * currency follows ISO 4217 — e.g. "USD", "EUR", "SAR".
 * taxRate is stored as a number (0–100) to keep arithmetic clean;
 * the form input converts to/from string at the boundary only.
 */
export interface CurrencySettings {
  /** ISO 4217 currency code */
  currency: string;
  /** Tax rate as a percentage, 0–100 */
  taxRate:  number;
  /** Display label shown on receipts — e.g. "VAT", "GST", "Sales Tax" */
  taxLabel: string;
}

// ─── System Settings ───────────────────────────────────────────────────────────

/**
 * UI appearance mode.
 * "system" defers to the OS-level preference.
 * Kept as a separate type so the topbar ThemeToggle can import it
 * without pulling in the full settings domain.
 */
export type ThemeMode = "light" | "dark" | "system";

/**
 * A single entry in the language selector.
 * Typed as an object (not a union) because the full language list is
 * data-driven — it grows without a type change.
 */
export interface LanguageOption {
  /** BCP 47 language tag — e.g. "en", "ar", "fr" */
  code:  string;
  /** Human-readable display name — e.g. "English", "العربية", "Français" */
  label: string;
}

/**
 * System-level display and localisation preferences.
 * timezone follows the IANA tz database — e.g. "America/New_York", "Asia/Riyadh".
 * dateFormat is a display pattern — e.g. "MM/DD/YYYY", "DD/MM/YYYY".
 */
export interface SystemSettings {
  theme:      ThemeMode;
  /** BCP 47 language tag */
  language:   string;
  /** IANA timezone identifier */
  timezone:   string;
  /** Display pattern for dates throughout the UI */
  dateFormat: string;
}

// ─── Notification Settings ─────────────────────────────────────────────────────

/**
 * All notification event types the restaurant can subscribe to.
 * A union (not an enum) for consistency with every other discriminant
 * type in the project. Extending notifications requires only adding
 * a new member here — the Record type below and any loop over
 * Object.keys() automatically include it.
 */
export type NotificationType =
  | "newOrder"
  | "orderReady"
  | "lowStock"
  | "newReservation"
  | "staffAlert"
  | "dailySummary";

/**
 * A boolean flag per notification type.
 * Record<NotificationType, boolean> is used instead of individual fields because:
 * 1. Adding a new NotificationType extends the model with zero form changes —
 *    the notifications component iterates Object.entries() at render time.
 * 2. Partial updates are expressed as Partial<NotificationSettings> —
 *    one spread, not six conditional assignments.
 * 3. TypeScript enforces that every NotificationType has an entry —
 *    a missing key is a compile error, not a silent undefined.
 */
export type NotificationSettings = Record<NotificationType, boolean>;

// ─── Integrations ──────────────────────────────────────────────────────────────

/**
 * Connection state of a third-party integration.
 * "connected"    — credentials are stored and the integration is active.
 * "disconnected" — integration exists in the catalogue but is not configured.
 */
export type IntegrationStatus = "connected" | "disconnected";

/**
 * A single third-party integration entry.
 * The id is stable — it identifies the integration across connect/disconnect
 * cycles and is used as the React key in lists.
 */
export interface Integration {
  id:          string;
  name:        string;
  description: string;
  status:      IntegrationStatus;
  /** Absolute URL or relative path to the integration's logo */
  logoUrl?:    string;
}

// ─── Restaurant Settings (Aggregate Root) ──────────────────────────────────────

/**
 * The top-level aggregate that the Settings page holds in state.
 * Every settings group is composed here rather than managed independently.
 *
 * RestaurantSettings is the aggregate root because:
 * 1. A single Save action persists all pending changes together — the page
 *    diffs the current state against the initial state as a whole object,
 *    not section by section.
 * 2. Cross-section validation (e.g. currency affects tax display which affects
 *    receipt formatting) is only possible if all sections are co-located.
 * 3. The isDirty flag is derived from one equality check on the root, not
 *    from six separate dirty flags that must be OR-ed together.
 * 4. Serializing settings to localStorage or sending to an API is one
 *    operation on the root, not six separate calls.
 */
export interface RestaurantSettings {
  general:       GeneralSettingsFormValues;
  businessHours: BusinessHours;
  currency:      CurrencySettings;
  system:        SystemSettings;
  notifications: NotificationSettings;
  integrations:  Integration[];
}
