"use client";

import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/utils/string";
import { useLogout } from "@/lib/hooks/use-logout";
import { useCurrentUser } from "@/lib/hooks/use-auth";

export function UserMenu() {
  const { user }  = useCurrentUser();
  const logout    = useLogout();

  const displayName = user?.full_name ?? "User";
  const displayRole = user?.role      ?? "Staff";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-9 items-center gap-2 rounded-lg px-2 hover:bg-accent"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials(displayName)}
          </div>
          <div className="hidden flex-col items-start sm:flex">
            <span className="text-sm font-medium leading-none text-foreground">
              {displayName}
            </span>
            <span className="typography-caption text-muted-foreground capitalize">
              {displayRole}
            </span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="gap-2">
          <User size={14} /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Settings size={14} /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-destructive focus:text-destructive"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          <LogOut size={14} />
          {logout.isPending ? "Signing out…" : "Sign Out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
