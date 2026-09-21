"use client";

import { useRef, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  param?: string;
  delay?: number;
}

export function SearchInput({
  placeholder = "Search...",
  param = "q",
  delay = 300,
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const value = searchParams.get(param) ?? "";

  function handleSearch(term: string) {
    if (timeout.current) clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set(param, term);
        params.delete("page");
      } else {
        params.delete(param);
      }

      startTransition(() => {
        router.replace(`?${params.toString()}`, { scroll: false });
      });
    }, delay);
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        defaultValue={value}
        onChange={(e) => handleSearch(e.target.value)}
        className={cn("pl-9 rounded-lg", isPending && "opacity-70")}
      />
    </div>
  );
}
