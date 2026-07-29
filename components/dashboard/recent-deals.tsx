import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DealWithRelations } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils";
import Link from "next/link";
import { Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentDealsProps {
  deals: DealWithRelations[];
}

const stageStyles: Record<string, string> = {
  lead: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  qualified: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  proposal: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  negotiation: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  won: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  lost: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export function RecentDeals({ deals }: RecentDealsProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="border-b bg-gradient-to-r from-violet-500/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-violet-500/10 p-2 text-violet-600 dark:text-violet-400">
            <Target className="h-4 w-4" />
          </div>
          <CardTitle>Recent Deals</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {deals.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No deals yet.</p>
          ) : (
            deals.map((deal) => (
              <div
                key={deal.id}
                className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/deals/${deal.id}`}
                    className="text-sm font-medium hover:text-primary"
                  >
                    {deal.title}
                  </Link>
                  <p className="text-xs text-muted-foreground truncate">
                    {deal.customer
                      ? `${deal.customer.firstName} ${deal.customer.lastName}`
                      : "No customer"}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm font-semibold tabular-nums">{formatCurrency(deal.value)}</p>
                  <span
                    className={cn(
                      "inline-block rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
                      stageStyles[deal.stage] ?? "bg-muted text-muted-foreground"
                    )}
                  >
                    {deal.stage}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
