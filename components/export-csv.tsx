"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportCsvProps {
  data: Record<string, unknown>[];
  filename: string;
  label?: string;
}

export function ExportCsv({ data, filename, label = "Export CSV" }: ExportCsvProps) {
  function handleExport() {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          const stringValue =
            value === null || value === undefined ? "" : String(value);
          return `"${stringValue.replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
