"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Company } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { deleteCompany } from "@/actions/companies";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const companyColumns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/companies/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => row.original.industry ?? "—",
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => row.original.website ?? "—",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email ?? "—",
  },
  {
    id: "actions",
    cell: ({ row }) => <CompanyActions company={row.original} />,
  },
];

function CompanyActions({ company }: { company: Company }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this company?")) return;
    const result = await deleteCompany(company.id);
    if (result.success) {
      toast.success("Company deleted");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href={`/companies/${company.id}/edit`} className="flex items-center">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
