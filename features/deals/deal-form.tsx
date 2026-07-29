"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { dealSchema, type DealFormValues } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DEAL_STAGES } from "@/constants";
import { Deal, Customer, Company } from "@/types";
import { createDeal, updateDeal } from "@/actions/deals";
import { toast } from "sonner";

interface DealFormProps {
  deal?: Deal;
  customers: Customer[];
  companies: Company[];
}

export function DealForm({ deal, customers, companies }: DealFormProps) {
  const router = useRouter();
  const isEditing = !!deal;

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: deal?.title ?? "",
      customerId: deal?.customerId ?? "",
      companyId: deal?.companyId ?? null,
      value: deal?.value ?? 0,
      probability: deal?.probability ?? 0,
      stage: (deal?.stage as DealFormValues["stage"]) ?? "lead",
      expectedCloseDate: deal?.expectedCloseDate
        ? new Date(deal.expectedCloseDate)
        : null,
      notes: deal?.notes ?? null,
    },
  });

  async function onSubmit(values: DealFormValues) {
    const result = isEditing
      ? await updateDeal(deal.id, {
          ...values,
          notes: values.notes || null,
        })
      : await createDeal(values);

    if (result.success) {
      toast.success(result.message);
      router.push("/deals");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Deal Title</Label>
          <Input id="title" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer">Customer</Label>
          <Select
            value={form.watch("customerId")}
            onValueChange={(value) =>
              form.setValue("customerId", value ?? "")
            }
          >
            <SelectTrigger id="customer">
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Select
            value={form.watch("companyId") ?? "none"}
            onValueChange={(value) =>
              form.setValue("companyId", value === "none" ? null : value)
            }
          >
            <SelectTrigger id="company">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            type="number"
            {...form.register("value", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="probability">Probability (%)</Label>
          <Input
            id="probability"
            type="number"
            min={0}
            max={100}
            {...form.register("probability", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stage">Stage</Label>
          <Select
            value={form.watch("stage")}
            onValueChange={(value) =>
              form.setValue("stage", value as DealFormValues["stage"])
            }
          >
            <SelectTrigger id="stage">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {DEAL_STAGES.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
          <Input
            id="expectedCloseDate"
            type="date"
            value={
              form.watch("expectedCloseDate")
                ? new Date(form.watch("expectedCloseDate") as Date)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={(e) =>
              form.setValue(
                "expectedCloseDate",
                e.target.value ? new Date(e.target.value) : null
              )
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...form.register("notes")} rows={4} />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/deals")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Deal"
            : "Create Deal"}
        </Button>
      </div>
    </form>
  );
}
