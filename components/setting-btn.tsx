import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";

export default function SettingBtn() {
  return (
    <Button variant="outline" size="icon">
      <Bell className="h-[1.2rem] w-[1.2rem] " />
    </Button>
  );
}
