"use client";

import { useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { DealWithRelations } from "@/types";
import { DEAL_STAGES } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils";
import { updateDealStage } from "@/actions/deals";
import { toast } from "sonner";
import { CalendarClock, GripVertical } from "lucide-react";

interface DealKanbanProps {
  deals: DealWithRelations[];
}

export function DealKanban({ deals }: DealKanbanProps) {
  const [, startTransition] = useTransition();
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const [optimisticDeals, moveDeal] = useOptimistic(
    deals,
    (state, update: { id: string; stage: string }) =>
      state.map((deal) =>
        deal.id === update.id ? { ...deal, stage: update.stage } : deal
      )
  );

  function handleDrop(dealId: string, stage: string) {
    const deal = optimisticDeals.find((item) => item.id === dealId);
    setDragOver(null);
    setDragging(null);

    if (!deal || deal.stage === stage) return;

    startTransition(async () => {
      moveDeal({ id: dealId, stage });
      const result = await updateDealStage(dealId, stage);
      if (result.success) {
        const label = DEAL_STAGES.find((s) => s.value === stage)?.label ?? stage;
        toast.success(`Deal moved to ${label}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {DEAL_STAGES.map((stage) => {
        const stageDeals = optimisticDeals.filter(
          (deal) => deal.stage === stage.value
        );
        const totalValue = stageDeals.reduce(
          (sum, deal) => sum + Number(deal.value),
          0
        );

        return (
          <div
            key={stage.value}
            data-stage={stage.value}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(stage.value);
            }}
            onDragLeave={(e) => {
              if (e.currentTarget.contains(e.relatedTarget as Node)) return;
              setDragOver((prev) => (prev === stage.value ? null : prev));
            }}
            onDrop={(e) => {
              e.preventDefault();
              const dealId = e.dataTransfer.getData("dealId");
              if (dealId) handleDrop(dealId, stage.value);
            }}
            className={cn(
              "flex w-72 shrink-0 flex-col rounded-xl border bg-muted/30 transition-colors",
              dragOver === stage.value && "border-primary/60 bg-primary/5"
            )}
          >
            <div className="flex items-center justify-between gap-2 border-b px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", stage.color)} />
                <h3 className="text-sm font-semibold">{stage.label}</h3>
                <Badge variant="secondary" className="text-xs">
                  {stageDeals.length}
                </Badge>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {formatCurrency(totalValue)}
              </span>
            </div>

            <div className="flex min-h-24 flex-col gap-2 p-2">
              {stageDeals.length === 0 ? (
                <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                  Drop deals here
                </p>
              ) : (
                stageDeals.map((deal) => (
                  <Card
                    key={deal.id}
                    data-deal-id={deal.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("dealId", deal.id);
                      e.dataTransfer.effectAllowed = "move";
                      setDragging(deal.id);
                    }}
                    onDragEnd={() => {
                      setDragging(null);
                      setDragOver(null);
                    }}
                    className={cn(
                      "cursor-grab shadow-none transition-opacity active:cursor-grabbing",
                      dragging === deal.id && "opacity-40"
                    )}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-1.5">
                        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/deals/${deal.id}`}
                            className="block truncate text-sm font-medium hover:underline"
                          >
                            {deal.title}
                          </Link>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {deal.customer
                              ? `${deal.customer.firstName} ${deal.customer.lastName}`
                              : "No customer"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-semibold">
                          {formatCurrency(deal.value)}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {deal.probability}%
                        </Badge>
                      </div>
                      {deal.expectedCloseDate && (
                        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <CalendarClock className="h-3 w-3" />
                          {formatDate(deal.expectedCloseDate)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
