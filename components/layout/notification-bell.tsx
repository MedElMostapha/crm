"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { type Notification } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STORAGE_KEY = "orbit-crm-dismissed-notifications";

const severityStyles: Record<Notification["severity"], string> = {
  danger: "bg-red-500/10 text-red-600 dark:text-red-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

function readDismissed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function NotificationBell({
  notifications,
}: {
  notifications: Notification[];
}) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [dismissed, setDismissed] = useState<string[]>(readDismissed);

  const visible = notifications.filter((item) => !dismissed.includes(item.id));
  const count = visible.length;

  function markAllRead() {
    const next = Array.from(
      new Set([...dismissed, ...notifications.map((item) => item.id)])
    );
    setDismissed(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          />
        }
      >
        <Bell className="h-4 w-4" />
        {mounted && count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between font-normal">
            <span className="text-sm font-medium text-foreground">
              Notifications
            </span>
            {mounted && count > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {visible.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            You&apos;re all caught up.
          </p>
        ) : (
          visible.map((item) => (
            <DropdownMenuItem
              key={item.id}
              render={<Link href={item.href} />}
              className="items-start gap-3 py-2.5"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  severityStyles[item.severity]
                )}
              >
                <Bell className="h-3.5 w-3.5" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{item.title}</span>
                <span className="line-clamp-2 text-xs text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
