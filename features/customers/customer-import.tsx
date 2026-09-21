"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { importCustomers } from "@/actions/customers";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload } from "lucide-react";

const FIELD_MAP: Record<string, string> = {
  "first name": "firstName",
  firstname: "firstName",
  first_name: "firstName",
  "last name": "lastName",
  lastname: "lastName",
  last_name: "lastName",
  email: "email",
  phone: "phone",
  company: "company",
  status: "status",
  source: "source",
  tags: "tags",
  notes: "notes",
};

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      out.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  out.push(current);
  return out;
}

export function CustomerImport() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const router = useRouter();

  async function handleFile(file: File) {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((line) => line.trim());

    if (lines.length < 2) {
      toast.error("CSV must contain a header row and at least one row");
      return;
    }

    const headers = parseCsvLine(lines[0]).map(
      (header) => FIELD_MAP[header.trim().toLowerCase()] ?? ""
    );
    const rows = lines.slice(1).map((line) => {
      const cells = parseCsvLine(line);
      const row: Record<string, string> = {};
      headers.forEach((field, index) => {
        if (field) row[field] = (cells[index] ?? "").trim();
      });
      return row;
    });

    setIsImporting(true);
    const result = await importCustomers(rows);
    setIsImporting(false);

    if (result.success) {
      toast.success(result.message ?? "Customers imported");
      if (result.data.errors.length > 0) {
        const details = result.data.errors
          .slice(0, 3)
          .map((error) => `Row ${error.row}: ${error.reason}`)
          .join("\n");
        const extra =
          result.data.errors.length > 3
            ? `\n… and ${result.data.errors.length - 3} more`
            : "";
        toast.error(`Skipped ${result.data.errors.length} invalid row(s):\n${details}${extra}`);
      }
      router.refresh();
    } else {
      toast.error(result.error);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        disabled={isImporting}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isImporting ? "Importing..." : "Import CSV"}
      </Button>
    </>
  );
}