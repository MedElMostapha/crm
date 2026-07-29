"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CustomerWithCompany } from "@/types";
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
import { deleteCustomer } from "@/actions/customers";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CUSTOMER_STATUSES } from "@/constants";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  lead: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  inactive: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  churned: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

export const customerColumns: ColumnDef<CustomerWithCompany>[] = [
  {
    accessorKey: "firstName",
    header: "Name",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <Link
          href={`/customers/${customer.id}`}
          className="font-medium transition-colors hover:text-primary"
        >
          {customer.firstName} {customer.lastName}
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => row.original.company?.name ?? <span className="text-muted-foreground">&mdash;</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = CUSTOMER_STATUSES.find(
        (s) => s.value === row.original.status
      );
      return (
        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", statusStyles[row.original.status] ?? "bg-muted text-muted-foreground")}>
          {status?.label ?? row.original.status}
        </span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone ?? <span className="text-muted-foreground">&mdash;</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CustomerActions customer={row.original} />;
    },
  },
];

function CustomerActions({ customer }: { customer: CustomerWithCompany }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    const result = await deleteCustomer(customer.id);
    if (result.success) {
      toast.success("Customer deleted");
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
          <Link href={`/customers/${customer.id}/edit`} className="flex items-center gap-2">
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
