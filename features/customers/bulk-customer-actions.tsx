"use client";

import { useRouter } from "next/navigation";
import { deleteCustomersBulk } from "@/actions/customers";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { CustomerWithCompany } from "@/types";

interface BulkCustomerActionsProps {
  customers: CustomerWithCompany[];
  clear: () => void;
}

export function BulkCustomerActions({
  customers,
  clear,
}: BulkCustomerActionsProps) {
  const router = useRouter();

  async function handleDelete() {
    if (
      !confirm(
        `Delete ${customers.length} customer${customers.length !== 1 ? "s" : ""}? This cannot be undone.`
      )
    ) {
      return;
    }

    const result = await deleteCustomersBulk(customers.map((c) => c.id));
    if (result.success) {
      toast.success(result.message ?? "Customers deleted");
      clear();
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border bg-card px-4 py-2.5">
      <p className="text-sm font-medium">
        {customers.length} customer{customers.length !== 1 ? "s" : ""} selected
      </p>
      <Button variant="destructive" size="sm" onClick={handleDelete}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}