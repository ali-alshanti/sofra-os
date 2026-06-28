export type KitchenPriority = "all" | "normal" | "high" | "urgent";

export interface KitchenStation {
  id: string;
  label: string;
}

export interface KitchenFiltersValue {
  station: string;
  priority: KitchenPriority;
  search: string;
}

export const DEFAULT_KITCHEN_FILTERS: KitchenFiltersValue = {
  station:  "all",
  priority: "all",
  search:   "",
};

export const DEFAULT_STATIONS: KitchenStation[] = [
  { id: "all",     label: "All Stations" },
  { id: "grill",   label: "Grill"        },
  { id: "fryer",   label: "Fryer"        },
  { id: "pizza",   label: "Pizza"        },
  { id: "salad",   label: "Salad"        },
  { id: "drinks",  label: "Drinks"       },
  { id: "dessert", label: "Dessert"      },
];

export const PRIORITY_OPTIONS: { value: KitchenPriority; label: string }[] = [
  { value: "all",    label: "All"    },
  { value: "normal", label: "Normal" },
  { value: "high",   label: "High"   },
  { value: "urgent", label: "Urgent" },
];

export interface KitchenFiltersProps {
  stations?: KitchenStation[];
  value: KitchenFiltersValue;
  onStationChange?: (station: string) => void;
  onPriorityChange?: (priority: KitchenPriority) => void;
  onSearchChange?: (search: string) => void;
}
