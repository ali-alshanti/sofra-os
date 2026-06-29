export interface KitchenStats {
  activeOrders: number;
  preparing: number;
  ready: number;
  avgPrepTime: string; // e.g. "14m"
}

export interface KitchenHeaderProps {
  stats?:       KitchenStats;
  isLoading?:   boolean;
  onRefresh?:   () => void;
  onFilter?:    () => void;
  onFullscreen?:() => void;
}
