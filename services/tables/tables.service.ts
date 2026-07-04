import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { todayStart } from "@/lib/utils/date";
import type {
  RestaurantTable,
  TableStatus,
  TableShape,
  OccupancyInfo,
  ReservationInfo,
} from "@/features/tables/components/table-card";
import type { Reservation } from "@/features/tables/components/reservation-card";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TableWithSpan = RestaurantTable & { colSpan?: number };

export interface TablesData {
  squareTables: TableWithSpan[];
  barSeats:     RestaurantTable[];
}

// ─── getTables ────────────────────────────────────────────────────────────────

export async function getTables(restaurantId: string): Promise<TablesData> {
  const supabase = getSupabaseBrowserClient();

  // Fetch dining tables, active orders on them, and upcoming reservations in parallel
  const [tablesResult, ordersResult, reservationsResult] = await Promise.all([
    supabase
      .from("dining_tables")
      .select("id, number, capacity, shape, status, location")
      .eq("restaurant_id", restaurantId)
      .eq("is_active", true)
      .order("number"),

    supabase
      .from("orders")
      .select("id, table_id, status, created_at, customers ( full_name ), total")
      .eq("restaurant_id", restaurantId)
      .in("status", ["pending", "preparing", "ready"])
      .gte("created_at", todayStart()),

    supabase
      .from("reservations")
      .select("id, table_id, guest_name, party_size, reservation_time, status")
      .eq("restaurant_id", restaurantId)
      .eq("status", "upcoming")
      .gte("reservation_time", todayStart())
      .order("reservation_time"),
  ]);

  if (tablesResult.error) throw new Error(tablesResult.error.message);

  // Build lookup maps
  const occupancyMap = new Map<string, OccupancyInfo>();
  for (const order of (ordersResult.data ?? []) as unknown as OrderRow[]) {
    if (!order.table_id) continue;
    if (occupancyMap.has(order.table_id)) continue; // take first active order

    const elapsed = elapsedTime(order.created_at);
    const name    = order.customers?.full_name ?? "Guests";
    occupancyMap.set(order.table_id, { guestName: name, duration: elapsed, partySize: 1 });
  }

  const reservationMap = new Map<string, ReservationInfo>();
  for (const r of (reservationsResult.data ?? []) as ReservationRow[]) {
    if (!r.table_id || reservationMap.has(r.table_id)) continue;
    reservationMap.set(r.table_id, {
      guestName:  r.guest_name,
      time:       new Date(r.reservation_time).toTimeString().slice(0, 5),
      partySize:  r.party_size,
    });
  }

  // Map rows to RestaurantTable
  const allTables = (tablesResult.data ?? []) as TableRow[];
  const squares: TableWithSpan[] = [];
  const bar: RestaurantTable[]   = [];

  for (const t of allTables) {
    const base: RestaurantTable = {
      id:        t.id,
      number:    t.number,
      capacity:  t.capacity,
      shape:     t.shape as TableShape,
      status:    t.status as TableStatus,
      occupancy: occupancyMap.get(t.id),
      reservation: t.status === "reserved" ? reservationMap.get(t.id) : undefined,
    };

    if (t.shape === "round") {
      bar.push(base);
    } else {
      // Use capacity >= 6 as heuristic for large booths (colSpan: 2)
      squares.push({ ...base, colSpan: t.capacity >= 6 ? 2 : 1 });
    }
  }

  return { squareTables: squares, barSeats: bar };
}

// ─── getTablesFilterOptions ───────────────────────────────────────────────────

export interface TableFilterOption {
  id:     string;
  number: string;
}

export async function getTablesFilterOptions(restaurantId: string): Promise<TableFilterOption[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("dining_tables")
    .select("id, number")
    .eq("restaurant_id", restaurantId)
    .eq("is_active", true)
    .order("number");
  if (error) throw new Error(error.message);
  return (data ?? []).map((t) => ({ id: t.id, number: t.number }));
}

// ─── createTable ──────────────────────────────────────────────────────────────

export interface CreateTablePayload {
  restaurantId: string;
  number:       string;
  capacity:     number;
  shape:        TableShape;
  location?:    string;
}

export async function createTable(payload: CreateTablePayload): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("dining_tables").insert({
    restaurant_id: payload.restaurantId,
    number:        payload.number,
    capacity:      payload.capacity,
    shape:         payload.shape,
    location:      payload.location || null,
    status:        "available",
    is_active:     true,
  });
  if (error) throw new Error(error.message);
}

// ─── updateTableStatus ────────────────────────────────────────────────────────

export async function updateTableStatus(tableId: string, status: TableStatus): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("dining_tables")
    .update({ status })
    .eq("id", tableId);
  if (error) throw new Error(error.message);
}

// ─── getReservations ──────────────────────────────────────────────────────────

export async function getReservations(restaurantId: string): Promise<Reservation[]> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("reservations")
    .select(`
      id, guest_name, party_size, reservation_time, status,
      dining_tables ( number )
    `)
    .eq("restaurant_id", restaurantId)
    .in("status", ["upcoming", "seated"])
    .gte("reservation_time", todayStart())
    .order("reservation_time")
    .limit(20);

  if (error) throw new Error(error.message);

  const now = new Date();

  return ((data ?? []) as unknown as ReservationResult[]).map((r) => {
    const resTime  = new Date(r.reservation_time);
    const minutesToRes = Math.round((resTime.getTime() - now.getTime()) / 60000);

    return {
      id:               r.id,
      customerName:     r.guest_name,
      reservationTime:  resTime.toTimeString().slice(0, 5),
      guests:           r.party_size,
      tableNumber:      r.dining_tables?.number ? `T${r.dining_tables.number}` : "TBD",
      status:           r.status as Reservation["status"],
      dimmed:           minutesToRes > 60, // dim far-future reservations
    };
  });
}

// ─── cancelReservation ────────────────────────────────────────────────────────

export async function cancelReservation(reservationId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("reservations")
    .update({ status: "cancelled" })
    .eq("id", reservationId);
  if (error) throw new Error(error.message);
}

// ─── createReservation ────────────────────────────────────────────────────────

export interface CreateReservationPayload {
  restaurantId:     string;
  guest_name:       string;
  party_size:       number;
  reservation_time: string;
  table_id?:        string;
}

export async function createReservation(payload: CreateReservationPayload): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("reservations").insert({
    restaurant_id:    payload.restaurantId,
    guest_name:       payload.guest_name,
    party_size:       payload.party_size,
    reservation_time: payload.reservation_time,
    table_id:         payload.table_id || null,
    status:           "upcoming",
  });
  if (error) throw new Error(error.message);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function elapsedTime(isoString: string): string {
  const diffMs  = Date.now() - new Date(isoString).getTime();
  const totalMin = Math.floor(diffMs / 60000);
  const hours   = Math.floor(totalMin / 60);
  const mins    = totalMin % 60;
  return `${hours}h ${String(mins).padStart(2, "0")}m`;
}

// ─── Internal row types ───────────────────────────────────────────────────────

interface TableRow {
  id: string; number: string; capacity: number;
  shape: string; status: string; location: string | null;
}

interface OrderRow {
  id: string; table_id: string | null; status: string;
  created_at: string; total: number;
  customers: { full_name: string } | null;
}

interface ReservationRow {
  id: string; guest_name: string; party_size: number;
  reservation_time: string; status: string; table_id: string | null;
}

interface ReservationResult {
  id: string; guest_name: string; party_size: number;
  reservation_time: string; status: string;
  dining_tables: { number: string } | null;
}
