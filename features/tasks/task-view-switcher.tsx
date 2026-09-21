"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CalendarDays, List } from "lucide-react";

const views = [
  { href: "/tasks", label: "List", icon: List },
  { href: "/tasks/calendar", label: "Calendar", icon: CalendarDays },
];

export function TaskViewSwitcher() {
  const pathname = usePathname();

  return (
    <div className="inline-flex items-center rounded-lg border bg-muted/40 p-1">
      {views.map((view) => {
        const isActive = pathname === view.href;
        const Icon = view.icon;

        return (
          <Link
            key={view.href}
            href={view.href}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {view.label}
          </Link>
        );
      })}
    </div>
  );
}
