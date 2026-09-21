"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DATE_RANGES } from "@/constants";
import { cn } from "@/lib/utils";

export function DateRangeFilter({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(range: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="inline-flex items-center rounded-lg border bg-muted/40 p-1">
      {DATE_RANGES.map((range) => {
        const isActive = value === range.value;
        return (
          <button
            key={range.value}
            type="button"
            onClick={() => handleChange(range.value)}
            aria-pressed={isActive}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
