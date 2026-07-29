"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24">
      <div className="rounded-2xl bg-destructive/10 p-4 text-destructive">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h2 className="text-xl font-semibold tracking-tight">Something went wrong</h2>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button onClick={reset} variant="outline" className="rounded-lg">
        Try again
      </Button>
    </div>
  );
}
