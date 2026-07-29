"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { globalSearch } from "@/actions/search";
import { SearchResult } from "@/types";
import { Search, Users, Building2, Target, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const iconMap = {
  customer: Users,
  company: Building2,
  deal: Target,
  task: CheckSquare,
};

const typeColors: Record<string, string> = {
  customer: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  company: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  deal: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  task: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function down(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    }

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      const result = await globalSearch(query);
      setIsSearching(false);
      if (result.success) {
        setResults(result.data);
      } else {
        toast.error(result.error);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

  function handleSelect(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden h-8 items-center gap-2 rounded-lg border bg-muted/50 px-3 text-sm text-muted-foreground transition-all hover:bg-muted hover:text-foreground sm:flex"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden lg:inline">Search...</span>
        <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded-md border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search customers, companies, deals, tasks..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            {isSearching ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                Searching...
              </div>
            ) : (
              "No results found."
            )}
          </CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Results">
              {results.map((result) => {
                const Icon = iconMap[result.type];
                const color = typeColors[result.type] ?? "bg-muted text-muted-foreground";
                return (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result.href)}
                    className="flex items-center gap-3"
                  >
                    <div className={cn("rounded-lg p-1.5", color)}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{result.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {result.subtitle}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
