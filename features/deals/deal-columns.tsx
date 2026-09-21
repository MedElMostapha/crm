"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DealWithRelations } from "@/types";
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
import { DEAL_STAGES, STAGE_STYLES } from "@/constants";
import { formatCurrency, formatDate } from "@/utils";
import { cn } from "@/lib/utils";

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
        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", STAGE_STYLES[row.original.stage] ?? "bg-muted text-muted-foreground")}>
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
