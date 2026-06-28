export type TableStatus =
  | "available"
  | "occupied"
  | "reserved"
  | "cleaning"
  | "out_of_service";

export type TableShape = "square" | "round";

export interface OccupancyInfo {
  guestName: string;
  /** Human-readable elapsed time, e.g. "1h 12m" */
  duration: string;
  partySize: number;
}

export interface ReservationInfo {
  guestName: string;
  /** 24-hour time string, e.g. "19:30" */
  time: string;
  partySize: number;
}

export interface RestaurantTable {
  id: string;
  /** Display label, e.g. "T1", "B3" */
  number: string;
  capacity: number;
  status: TableStatus;
  shape: TableShape;
  occupancy?: OccupancyInfo;
  reservation?: ReservationInfo;
}

export interface TableCardProps {
  table: RestaurantTable;
  onClick?: (id: string) => void;
  className?: string;
}
