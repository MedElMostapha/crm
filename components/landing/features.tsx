import { Button } from "@/components/ui/button";
import {
  Activity,
  BarChart3,
  FileSpreadsheet,
  GripVertical,
  ListChecks,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { MiniBars } from "./mini-bars";

const KANBAN = [
  {
    name: "Qualified",
    color: "bg-blue-500",
    deals: ["Ava Chen", "Nova Labs"],
  },
  {
    name: "Proposal",
    color: "bg-amber-500",
    deals: ["Sierra & Co", "Orion Retail"],
  },
  {
    name: "Won",
    color: "bg-emerald-500",
    deals: ["Northwind", "Bluepeak"],
  },
];

const LIST = [
  {
    icon: ListChecks,
    title: "Tasks & calendar",
    copy: "Assign, prioritize, and schedule work with a calendar view that keeps every follow-up on time.",
  },
  {
    icon: Activity,
    title: "A timeline of everything",
    copy: "Deal moves, notes, and completions land on a shared timeline so context never goes missing.",
  },
  {
    icon: FileSpreadsheet,
    title: "Bulk actions & CSV",
    copy: "Import customers from a spreadsheet and export deals or tasks to CSV in one click.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 lg:pb-28 lg:pt-24">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">
            What you get
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight [font-family:var(--font-display)] md:text-4xl">
            Built for the whole deal lifecycle
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Every screen in Orbit is designed to answer one question: where
            does this deal stand right now?
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-6">
          <div className="group rounded-2xl border bg-primary/[0.04] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md md:col-span-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-primary">
                <GripVertical className="h-4 w-4" />
                <span className="text-sm font-semibold">Deals that move</span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                01
              </span>
            </div>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Drag deals across stages with a pipeline that updates value and
              probability as it goes.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {KANBAN.map((stage) => (
                <div key={stage.name} className="rounded-xl border bg-card p-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${stage.color}`} />
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {stage.name}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {stage.deals.map((deal) => (
                      <div
                        key={deal}
                        className="rounded-lg border bg-background px-2 py-1.5 text-[11px] font-medium"
                      >
                        {deal}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="group rounded-2xl border bg-primary/[0.04] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md md:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-primary">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm font-semibold">Reports on autopilot</span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                02
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Revenue, win rates, and top customers — computed for you.
            </p>
            <div className="mt-4">
              <MiniBars />
            </div>
          </div>

          {LIST.map(({ icon: Icon, title, copy }, index) => (
            <div
              key={title}
              className="group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md md:col-span-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-primary">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-semibold">{title}</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  0{index + 3}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {copy}
              </p>
            </div>
         ))}
        </div>

        <div className="mt-8">
          <Button asChild variant="ghost" className="rounded-lg">
            <Link href="/login">
              Explore the full product
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}