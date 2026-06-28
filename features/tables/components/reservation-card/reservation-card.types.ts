export type ReservationStatus = "upcoming" | "seated" | "completed" | "cancelled" | "no_show";

export interface Reservation {
  id: string;
  customerName: string;
  /** Display time string, e.g. "19:00" */
  reservationTime: string;
  guests: number;
  tableNumber: string;
  status?: ReservationStatus;
  /** When true, card renders at reduced opacity (far-future slot) */
  dimmed?: boolean;
}

export interface ReservationCardProps {
  reservation: Reservation;
  onMoreActions?: (id: string) => void;
  className?: string;
}
