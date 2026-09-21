"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  param: string;
  options: readonly FilterOption[];
  allLabel: string;
  className?: string;
}

export function FilterSelect({
  param,
  options,
  allLabel,
  className,
}: FilterSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const value = searchParams.get(param) ?? "all";

  function handleChange(next: string | null) {
    const params = new URLSearchParams(searchParams);
    if (!next || next === "all") {
      params.delete(param);
    } else {
      params.set(param, next);
    }
    params.delete("page");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger
        className={cn("h-9 w-[160px] rounded-lg", isPending && "opacity-60", className)}
      >
        <SelectValue>
          {(selected: string | null) =>
            !selected || selected === "all"
              ? allLabel
              : options.find((option) => option.value === selected)?.label ??
                allLabel
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
