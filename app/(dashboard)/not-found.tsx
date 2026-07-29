import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24">
      <div className="rounded-2xl bg-muted p-4 text-muted-foreground">
        <SearchX className="h-10 w-10" />
      </div>
      <h1 className="text-5xl font-bold tracking-tight">404</h1>
      <p className="text-muted-foreground">This page could not be found.</p>
      <Button asChild className="rounded-lg">
        <Link href="/dashboard">Go back to dashboard</Link>
      </Button>
    </div>
  );
}
