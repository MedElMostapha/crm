"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { APP_NAME, NAV_LINKS } from "@/constants";
import {
  LayoutDashboard,
  Users,
  Building2,
  Target,
  CheckSquare,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  Building2,
  Target,
  CheckSquare,
};

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r bg-sidebar lg:flex",
        className
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2.5 font-semibold tracking-tight"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
            <Target className="h-5 w-5" />
          </div>
          <span className="text-lg">{APP_NAME}</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {NAV_LINKS.map((link) => {
          const Icon = iconMap[link.icon];
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary dark:from-primary/20 dark:to-primary/10"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
              )}
              <Icon className={cn("h-4 w-4 transition-transform duration-200", isActive && "scale-110")} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <p className="text-xs text-sidebar-foreground/40">
          © {new Date().getFullYear()} {APP_NAME}
        </p>
      </div>
    </aside>
  );
}
