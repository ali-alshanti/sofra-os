import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/utils/string";

interface UserMenuProps {
  name?: string;
  role?: string;
}

export function UserMenu({
  name = "User Name",
  role = "Manager",
}: UserMenuProps) {
  return (
    <Button
      variant="ghost"
      className="flex h-9 items-center gap-2 rounded-lg px-2 hover:bg-accent"
    >
      {/* Avatar */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {initials(name)}
      </div>

      {/* Name & Role */}
      <div className="hidden flex-col items-start sm:flex">
        <span className="text-sm font-medium leading-none text-foreground">
          {name}
        </span>
        <span className="typography-caption text-muted-foreground">{role}</span>
      </div>

      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    </Button>
  );
}
