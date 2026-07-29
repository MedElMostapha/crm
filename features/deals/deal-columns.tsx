"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DealWithRelations } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { deleteDeal } from "@/actions/deals";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DEAL_STAGES } from "@/constants";
import { formatCurrency, formatDate } from "@/utils";
import { cn } from "@/lib/utils";

const stageStyles: Record<string, string> = {
  lead: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  qualified: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  proposal: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  negotiation: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  won: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  lost: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export const dealColumns: ColumnDef<DealWithRelations>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/deals/${row.original.id}`}
        className="font-medium transition-colors hover:text-primary"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) =>
      row.original.customer
        ? `${row.original.customer.firstName} ${row.original.customer.lastName}`
        : <span className="text-muted-foreground">&mdash;</span>,
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">{formatCurrency(row.original.value)}</span>
    ),
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => {
      const stage = DEAL_STAGES.find((s) => s.value === row.original.stage);
      return (
        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", stageStyles[row.original.stage] ?? "bg-muted text-muted-foreground")}>
          {stage?.label ?? row.original.stage}
        </span>
      );
    },
  },
  {
    accessorKey: "expectedCloseDate",
    header: "Expected Close",
    cell: ({ row }) => formatDate(row.original.expectedCloseDate),
  },
  {
    id: "actions",
    cell: ({ row }) => <DealActions deal={row.original} />,
  },
];

function DealActions({ deal }: { deal: DealWithRelations }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this deal?")) return;
    const result = await deleteDeal(deal.id);
    if (result.success) {
      toast.success("Deal deleted");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-lg" />}>
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="gap-2">
          <Link href={`/deals/${deal.id}/edit`} className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="gap-2 text-destructive focus:text-destructive">
          <Trash className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
