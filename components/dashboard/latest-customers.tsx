import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerWithCompany } from "@/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/utils";
import { Users } from "lucide-react";

interface LatestCustomersProps {
  customers: CustomerWithCompany[];
}

export function LatestCustomers({ customers }: LatestCustomersProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="border-b bg-gradient-to-r from-indigo-500/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400">
            <Users className="h-4 w-4" />
          </div>
          <CardTitle>Latest Customers</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {customers.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No customers yet.</p>
          ) : (
            customers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-indigo-500/10 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      {initials(`${customer.firstName} ${customer.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/customers/${customer.id}`}
                      className="text-sm font-medium hover:text-primary"
                    >
                      {customer.firstName} {customer.lastName}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {customer.company?.name ?? "No company"}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {customer.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
