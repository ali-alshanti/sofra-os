import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function NotificationsButton() {
  return (
    <Button variant="ghost" size="icon" className="relative h-9 w-9">
      <Bell className="h-4 w-4 text-muted-foreground" />
      {/* Badge — replace count with real data later */}
      <Badge className="absolute -right-0.5 -top-0.5 h-4 w-4 justify-center rounded-full p-0 text-[10px]">
        3
      </Badge>
      <span className="sr-only">Notifications</span>
    </Button>
  );
}
