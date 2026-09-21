"use client";

import { useRouter } from "next/navigation";
import { deleteDealsBulk } from "@/actions/deals";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { DealWithRelations } from "@/types";

interface BulkDealActionsProps {
  deals: DealWithRelations[];
  clear: () => void;
}

export function BulkDealActions({ deals, clear }: BulkDealActionsProps) {
  const router = useRouter();

  async function handleDelete() {
    if (
      !confirm(
        `Delete ${deals.length} deal${deals.length !== 1 ? "s" : ""}? This cannot be undone.`
      )
    ) {
      return;
    }

    const result = await deleteDealsBulk(deals.map((deal) => deal.id));
    if (result.success) {
      toast.success(result.message ?? "Deals deleted");
      clear();
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border bg-card px-4 py-2.5">
      <p className="text-sm font-medium">
        {deals.length} deal{deals.length !== 1 ? "s" : ""} selected
      </p>
      <Button variant="destructive" size="sm" onClick={handleDelete}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}