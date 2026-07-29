"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME } from "@/constants";
import { MobileSidebar } from "./mobile-sidebar";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";
import { CommandPalette } from "@/components/command-palette";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Target } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 flex flex-col border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <MobileSidebar />
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 font-semibold tracking-tight lg:hidden"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-sm">
              <Target className="h-5 w-5" />
            </div>
            {APP_NAME}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <CommandPalette />
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
      <div className="hidden border-t bg-muted/40 px-4 py-2.5 lg:block lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/dashboard">Home</Link>} />
            </BreadcrumbItem>
            {segments.map((segment, index) => {
              const href = `/${segments.slice(0, index + 1).join("/")}`;
              const isLast = index === segments.length - 1;
              const label = segment.charAt(0).toUpperCase() + segment.slice(1);

              return (
                <BreadcrumbItem key={href}>
                  <BreadcrumbSeparator />
                  {isLast ? (
                    <BreadcrumbPage className="text-sm font-medium">{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={href}>{label}</Link>} />
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
