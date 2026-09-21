"use client";

import { useState } from "react";
import Link from "next/link";
import { DealWithRelations } from "@/types";
import { DEAL_STAGES } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils";
import { updateDealStage } from "@/actions/deals";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DealKanbanProps {
  deals: DealWithRelations[];
}

export function DealKanban({ deals }: DealKanbanProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState<string | null>(null);

  async function handleDrop(dealId: string, stage: string) {
    setIsDragging(null);
    const result = await updateDealStage(dealId, stage);
    if (result.success) {
      toast.success("Deal moved");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {DEAL_STAGES.map((stage) => {
        const stageDeals = deals.filter((deal) => deal.stage === stage.value);
        return (
          <div
            key={stage.value}
            className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const dealId = e.dataTransfer.getData("dealId");
              if (dealId) handleDrop(dealId, stage.value);
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{stage.label}</h3>
              <Badge variant="secondary">{stageDeals.length}</Badge>
            </div>
            <div className="flex flex-col gap-2">
              {stageDeals.map((deal) => (
                <Card
                  key={deal.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("dealId", deal.id);
                    setIsDragging(deal.id);
                  }}
                  onDragEnd={() => setIsDragging(null)}
                  className={`cursor-grab active:cursor-grabbing ${
                    isDragging === deal.id ? "opacity-50" : ""
                  }`}
                >
                  <CardContent className="p-3">
                    <Link
                      href={`/deals/${deal.id}`}
                      className="block font-medium hover:underline"
                    >
                      {deal.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {deal.customer
                        ? `${deal.customer.firstName} ${deal.customer.lastName}`
                        : "No customer"}
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      {formatCurrency(deal.value)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
