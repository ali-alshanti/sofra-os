export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageSrc?: string;
  category: string;
  available: boolean;
  /** Optional badge text — e.g. "Best Seller", "New", "Chef's Pick" */
  badge?: string;
}

export interface MenuCardProps {
  item: MenuItem;
  onAvailabilityChange?: (id: string, available: boolean) => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}
