"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { DayButton } from "react-day-picker";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCalendarTasks } from "@/actions/tasks";
import { type TaskWithRelations } from "@/types";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Plus,
} from "lucide-react";

const priorityColor: Record<string, string> = {
  low: "bg-blue-500",
  medium: "bg-amber-500",
  high: "bg-red-500",
};

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function TaskCalendar() {
  const [month, setMonth] = useState(() => new Date());
  const [selected, setSelected] = useState<Date | undefined>(() => new Date());
  const [result, setResult] = useState<{
    key: string;
    tasks: TaskWithRelations[];
  } | null>(null);

  const monthKey = `${month.getFullYear()}-${month.getMonth()}`;

  useEffect(() => {
    let active = true;
    const from = new Date(month.getFullYear(), month.getMonth(), 1);
    const to = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);
    const key = `${month.getFullYear()}-${month.getMonth()}`;

    getCalendarTasks(from, to).then((response) => {
      if (!active) return;
      setResult({ key, tasks: response.success ? response.data : [] });
    });

    return () => {
      active = false;
    };
  }, [month]);

  const loading = result?.key !== monthKey;

  function handleMonthChange(nextMonth: Date) {
    setMonth(nextMonth);
    if (
      !selected ||
      selected.getMonth() !== nextMonth.getMonth() ||
      selected.getFullYear() !== nextMonth.getFullYear()
    ) {
      setSelected(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1));
    }
  }

  const tasksByDate = useMemo(() => {
    const map = new Map<string, TaskWithRelations[]>();
    const source = result?.key === monthKey ? result.tasks : [];
    for (const task of source) {
      if (!task.dueDate) continue;
      const key = dateKey(new Date(task.dueDate));
      const list = map.get(key) ?? [];
      list.push(task);
      map.set(key, list);
    }
    return map;
  }, [result, monthKey]);

  const selectedTasks = selected
    ? tasksByDate.get(dateKey(selected)) ?? []
    : [];

  function TaskDayButton({
    day,
    children,
    ...rest
  }: React.ComponentProps<typeof DayButton>) {
    const dayTasks = tasksByDate.get(dateKey(day.date)) ?? [];

    return (
      <CalendarDayButton day={day} {...rest}>
        {children}
        {dayTasks.length > 0 && (
          <span className="flex items-center justify-center gap-0.5">
            {dayTasks.slice(0, 3).map((task) => (
              <span
                key={task.id}
                className={cn(
                  "h-1 w-1 rounded-full",
                  priorityColor[task.priority] ?? "bg-zinc-400",
                  task.completed && "opacity-40"
                )}
              />
            ))}
          </span>
        )}
      </CalendarDayButton>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      <Card className="w-fit">
        <CardContent className="pt-6">
          <Calendar
            mode="single"
            month={month}
            onMonthChange={handleMonthChange}
            selected={selected}
            onSelect={setSelected}
            components={{ DayButton: TaskDayButton }}
          />
        </CardContent>
      </Card>

      <Card className="min-h-[320px]">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            {selected ? formatDate(selected) : "Select a day"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : selectedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No tasks scheduled for this day.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/tasks/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {selectedTasks.map((task) => (
                <li key={task.id}>
                  <Link
                    href={`/tasks/${task.id}`}
                    className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          task.priority === "high"
                            ? "text-red-500"
                            : task.priority === "medium"
                              ? "text-amber-500"
                              : "text-blue-500"
                        )}
                      />
                    )}
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span
                        className={cn(
                          "truncate text-sm font-medium",
                          task.completed && "text-muted-foreground line-through"
                        )}
                      >
                        {task.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {task.customer
                          ? `${task.customer.firstName} ${task.customer.lastName}`
                          : "Unassigned"}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
