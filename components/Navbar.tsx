"use client";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SettingBtn from "@/components/setting-btn";
export default function Navbar() {
  const pathname = usePathname();

  const routes = [
    {
      href: `/`,
      label: "Accueil",
      active: pathname === `/`,
    },
    {
      href: `/all-remplacements`,
      label: "Historique",
      active: pathname === `/all-remplacements`,
    },
  ];
  return (
    <>
      <nav className="flex justify-between py-6 px-6 ">
        <div className="inline-flex gap-6 items-center">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-base font-medium transition-colors hover:text-primary",
                route.active
                  ? "text-black dark:text-white"
                  : " text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href="/nouvelle-demande">
              <Plus className="mr-2 h-4 w-4" /> Nouvelle demande
            </Link>
          </Button>

          <ModeToggle />
          {/* <SettingBtn /> */}
        </div>
      </nav>
      <Separator className="mb-16" />
    </>
  );
}
