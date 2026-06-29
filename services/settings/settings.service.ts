import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { fromDbTime, toDbTime } from "@/lib/utils/date";
import type {
  RestaurantSettings,
  GeneralSettingsFormValues,
  BusinessHours,
  DayOfWeek,
  CurrencySettings,
  SystemSettings,
  NotificationSettings,
  Integration,
  IntegrationStatus,
} from "@/features/settings/types";

// ─── Day mapping ──────────────────────────────────────────────────────────────
// DB day_of_week: 0 = Monday … 6 = Sunday

const DAY_INDEX: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function indexToDay(i: number): DayOfWeek {
  return DAY_INDEX[i] ?? "monday";
}

// ─── DEFAULT_NOTIFICATION_PREFS ───────────────────────────────────────────────

const DEFAULT_NOTIFICATION_PREFS: NotificationSettings = {
  newOrder: true,
  orderReady: true,
  lowStock: true,
  newReservation: false,
  staffAlert: false,
  dailySummary: true,
};

// ─── Static integrations catalogue ───────────────────────────────────────────
// No integrations table exists yet; catalogue is shipped with the app.

const INTEGRATIONS_CATALOGUE: Integration[] = [
  {
    id: "pos-square",
    name: "Square POS",
    description: "Sync orders and payments with Square point-of-sale.",
    status: "disconnected",
  },
  {
    id: "delivery-talabat",
    name: "Talabat",
    description: "Accept delivery orders directly from the Talabat platform.",
    status: "disconnected",
  },
  {
    id: "accounting-xero",
    name: "Xero",
    description: "Export daily revenue and expense data to Xero accounting.",
    status: "disconnected",
  },
];

// ─── Internal row types ───────────────────────────────────────────────────────

interface RestaurantRow {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  email: string | null;
  timezone: string;
  logo_url: string | null;
}

interface RestaurantSettingsRow {
  currency: string;
  tax_rate: number;
  tax_label: string;
  language: string;
  theme: string;
  date_format: string;
  notification_preferences: Record<string, boolean>;
}

interface BusinessHoursRow {
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

// ─── getRestaurantSettings ────────────────────────────────────────────────────

export async function getRestaurantSettings(
  restaurantId: string,
): Promise<RestaurantSettings> {
  const supabase = getSupabaseBrowserClient();

  const [restaurantRes, settingsRes, hoursRes] = await Promise.all([
    supabase
      .from("restaurants")
      .select("id, name, phone, address, email, timezone, logo_url")
      .eq("id", restaurantId)
      .maybeSingle(),

    supabase
      .from("restaurant_settings")
      .select(
        "currency, tax_rate, tax_label, language, theme, date_format, notification_preferences",
      )
      .eq("restaurant_id", restaurantId)
      .maybeSingle(),

    supabase
      .from("business_hours")
      .select("day_of_week, open_time, close_time, is_closed")
      .eq("restaurant_id", restaurantId),
  ]);

  if (restaurantRes.error) throw new Error(restaurantRes.error.message);

  // restaurant row may not exist yet for a freshly set-up account
  const r   = (restaurantRes.data ?? {}) as Partial<RestaurantRow>;
  const s   = settingsRes.data as RestaurantSettingsRow | null;
  const hrs = (hoursRes.data ?? []) as BusinessHoursRow[];

  // ── General ──────────────────────────────────────────────────────────────────
  const general: GeneralSettingsFormValues = {
    restaurantName: r.name ?? "",
    phone:          r.phone   ?? "",
    address:        r.address ?? "",
    email: r.email ?? "",
    logoUrl: r.logo_url ?? undefined,
  };

  // ── Business Hours ────────────────────────────────────────────────────────────
  const defaultSchedule = { open: true, openTime: "08:00", closeTime: "22:00" };
  const businessHours: BusinessHours = {
    monday: { ...defaultSchedule },
    tuesday: { ...defaultSchedule },
    wednesday: { ...defaultSchedule },
    thursday: { ...defaultSchedule },
    friday: { ...defaultSchedule },
    saturday: { ...defaultSchedule },
    sunday: { open: false, openTime: "10:00", closeTime: "22:00" },
  };

  for (const row of hrs) {
    const day = indexToDay(row.day_of_week);
    businessHours[day] = {
      open: !row.is_closed,
      openTime: fromDbTime(row.open_time),
      closeTime: fromDbTime(row.close_time),
    };
  }

  // ── Currency & Tax ────────────────────────────────────────────────────────────
  const currency: CurrencySettings = {
    currency: s?.currency ?? "USD",
    taxRate: Number(s?.tax_rate ?? 0),
    taxLabel: s?.tax_label ?? "VAT",
  };

  // ── System ────────────────────────────────────────────────────────────────────
  const system: SystemSettings = {
    theme: (s?.theme ?? "system") as SystemSettings["theme"],
    language: s?.language ?? "en",
    timezone: r.timezone ?? "UTC",
    dateFormat: s?.date_format ?? "DD/MM/YYYY",
  };

  // ── Notifications ─────────────────────────────────────────────────────────────
  const rawNotif = s?.notification_preferences ?? {};
  const notifications: NotificationSettings = {
    newOrder: rawNotif["newOrder"] ?? DEFAULT_NOTIFICATION_PREFS.newOrder,
    orderReady: rawNotif["orderReady"] ?? DEFAULT_NOTIFICATION_PREFS.orderReady,
    lowStock: rawNotif["lowStock"] ?? DEFAULT_NOTIFICATION_PREFS.lowStock,
    newReservation:
      rawNotif["newReservation"] ?? DEFAULT_NOTIFICATION_PREFS.newReservation,
    staffAlert: rawNotif["staffAlert"] ?? DEFAULT_NOTIFICATION_PREFS.staffAlert,
    dailySummary:
      rawNotif["dailySummary"] ?? DEFAULT_NOTIFICATION_PREFS.dailySummary,
  };

  return {
    general,
    businessHours,
    currency,
    system,
    notifications,
    integrations: INTEGRATIONS_CATALOGUE,
  };
}

// ─── updateRestaurantSettings ─────────────────────────────────────────────────

export async function updateRestaurantSettings(
  restaurantId: string,
  settings: RestaurantSettings,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { general, currency, system, notifications } = settings;

  await Promise.all([
    // Update restaurants row
    supabase
      .from("restaurants")
      .update({
        name: general.restaurantName,
        phone: general.phone || null,
        address: general.address || null,
        email: general.email || null,
        logo_url: general.logoUrl || null,
        timezone: system.timezone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", restaurantId)
      .then(({ error }) => {
        if (error) throw new Error(error.message);
      }),

    // Upsert restaurant_settings row
    supabase
      .from("restaurant_settings")
      .upsert(
        {
          restaurant_id: restaurantId,
          currency: currency.currency,
          tax_rate: currency.taxRate,
          tax_label: currency.taxLabel,
          language: system.language as "en" | "ar",
          theme: system.theme as "light" | "dark" | "system",
          date_format: system.dateFormat,
          notification_preferences: notifications,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "restaurant_id" },
      )
      .then(({ error }) => {
        if (error) throw new Error(error.message);
      }),
  ]);
}

// ─── getBusinessHours ─────────────────────────────────────────────────────────

export async function getBusinessHours(
  restaurantId: string,
): Promise<BusinessHours> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("business_hours")
    .select("day_of_week, open_time, close_time, is_closed")
    .eq("restaurant_id", restaurantId);

  if (error) throw new Error(error.message);

  const hours: BusinessHours = {
    monday: { open: true, openTime: "08:00", closeTime: "22:00" },
    tuesday: { open: true, openTime: "08:00", closeTime: "22:00" },
    wednesday: { open: true, openTime: "08:00", closeTime: "22:00" },
    thursday: { open: true, openTime: "08:00", closeTime: "22:00" },
    friday: { open: true, openTime: "08:00", closeTime: "22:00" },
    saturday: { open: true, openTime: "10:00", closeTime: "23:30" },
    sunday: { open: false, openTime: "10:00", closeTime: "22:00" },
  };

  for (const row of (data ?? []) as BusinessHoursRow[]) {
    const day = indexToDay(row.day_of_week);
    hours[day] = {
      open: !row.is_closed,
      openTime: fromDbTime(row.open_time),
      closeTime: fromDbTime(row.close_time),
    };
  }

  return hours;
}

// ─── updateBusinessHours ──────────────────────────────────────────────────────

export async function updateBusinessHours(
  restaurantId: string,
  hours: BusinessHours,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  const rows = DAY_INDEX.map((day, i) => ({
    restaurant_id: restaurantId,
    day_of_week: i,
    is_closed: !hours[day].open,
    open_time: toDbTime(hours[day].openTime),
    close_time: toDbTime(hours[day].closeTime),
  }));

  const { error } = await supabase
    .from("business_hours")
    .upsert(rows, { onConflict: "restaurant_id,day_of_week" });

  if (error) throw new Error(error.message);
}

// ─── getNotificationSettings ──────────────────────────────────────────────────

export async function getNotificationSettings(
  restaurantId: string,
): Promise<NotificationSettings> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("restaurant_settings")
    .select("notification_preferences")
    .eq("restaurant_id", restaurantId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  const raw = (data?.notification_preferences as Record<string, boolean>) ?? {};
  return {
    newOrder: raw["newOrder"] ?? true,
    orderReady: raw["orderReady"] ?? true,
    lowStock: raw["lowStock"] ?? true,
    newReservation: raw["newReservation"] ?? false,
    staffAlert: raw["staffAlert"] ?? false,
    dailySummary: raw["dailySummary"] ?? true,
  };
}

// ─── updateNotificationSettings ───────────────────────────────────────────────

export async function updateNotificationSettings(
  restaurantId: string,
  notifications: NotificationSettings,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.from("restaurant_settings").upsert(
    {
      restaurant_id: restaurantId,
      notification_preferences: notifications,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "restaurant_id" },
  );

  if (error) throw new Error(error.message);
}

// ─── getIntegrations ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getIntegrations(_restaurantId: string): Promise<Integration[]> {
  // No integrations table exists yet; catalogue ships with the app.
  return INTEGRATIONS_CATALOGUE;
}

// ─── updateIntegrationStatus ──────────────────────────────────────────────────

export async function updateIntegrationStatus(
  integrationId: string,
  status: IntegrationStatus,
): Promise<Integration[]> {
  // No DB backing — toggle status in the catalogue copy and return it.
  return INTEGRATIONS_CATALOGUE.map((i) =>
    i.id === integrationId ? { ...i, status } : i,
  );
}
