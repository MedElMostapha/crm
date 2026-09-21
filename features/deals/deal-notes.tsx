"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateDeal } from "@/actions/deals";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface DealNotesProps {
  dealId: string;
  notes: string | null;
}

export function DealNotes({ dealId, notes }: DealNotesProps) {
  const [value, setValue] = useState(notes ?? "");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const isDirty = value !== (notes ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsPending(true);
    const result = await updateDeal(dealId, {
      notes: value.trim() ? value : null,
    });
    setIsPending(false);

    if (result.success) {
      toast.success("Notes saved");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="Add notes about this deal..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={6}
      />
      <Button type="submit" disabled={isPending || !isDirty}>
        <Save className="mr-2 h-4 w-4" />
        {isPending ? "Saving..." : "Save Notes"}
      </Button>
    </form>
  );
}
