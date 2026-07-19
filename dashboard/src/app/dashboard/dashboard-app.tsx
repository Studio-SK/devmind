"use client";

import { Suspense, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PanelLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type ViewMode } from "@/components/dashboard/view-mode-toggle";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DayView } from "@/components/dashboard/day-view";
import { PeriodGoalsView } from "@/components/dashboard/period-goals-view";
import { WeekView } from "@/components/dashboard/week-view";
import { MonthView } from "@/components/dashboard/month-view";
import { YearView } from "@/components/dashboard/year-view";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TaskDetailDialog } from "@/components/tasks/task-detail-dialog";
import { useTasks } from "@/hooks/use-tasks";
import { useSidebar } from "@/hooks/use-sidebar";
import {
  anchorForScope,
  formatPeriodLabel,
  rangeForView,
  viewLabel,
  type ViewType,
} from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import type { TaskDTO, TaskScope } from "@/types";

const GOALS_SCOPE: Record<Exclude<ViewType, "day">, TaskScope> = {
  week: "WEEK",
  month: "MONTH",
  year: "YEAR",
};

const BREAKDOWN_SCOPE: Record<Exclude<ViewType, "day">, TaskScope> = {
  week: "DAY",
  month: "WEEK",
  year: "MONTH",
};

const GOALS_EMPTY_LABEL: Record<Exclude<ViewType, "day">, string> = {
  week: "No goals for this week.",
  month: "No goals for this month.",
  year: "No goals for this year.",
};

function parseView(value: string | null): ViewType {
  return value === "day" ||
    value === "week" ||
    value === "month" ||
    value === "year"
    ? value
    : "day";
}

function parseMode(value: string | null): ViewMode {
  return value === "breakdown" ? "breakdown" : "goals";
}

function parseDate(value: string | null): Date {
  if (!value) return new Date();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const view = parseView(searchParams.get("view"));
  const mode = parseMode(searchParams.get("mode"));
  const date = parseDate(searchParams.get("date"));
  const tagId = searchParams.get("tagId");

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskDTO | undefined>(
    undefined,
  );
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const sidebar = useSidebar();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) next.delete(key);
        else next.set(key, value);
      }
      router.push(`/dashboard?${next.toString()}`);
    },
    [router, searchParams],
  );

  const { from, to } = rangeForView(view, date);
  const scope: TaskScope =
    view === "day"
      ? "DAY"
      : mode === "goals"
        ? GOALS_SCOPE[view]
        : BREAKDOWN_SCOPE[view];
  const { tasks, isLoading, mutate } = useTasks({ from, to, tagId, scope });
  const detailTask = tasks.find((t) => t.id === detailTaskId) ?? null;

  const formScope = scope;
  const formAnchor = anchorForScope(
    view !== "day" && mode === "goals" ? view : "day",
    date,
  );

  function openNewTask() {
    setEditingTask(undefined);
    setFormOpen(true);
  }

  function openTaskDetail(task: TaskDTO) {
    setDetailTaskId(task.id);
  }

  function openEditFromDetail() {
    if (!detailTask) return;
    setEditingTask(detailTask);
    setDetailTaskId(null);
    setFormOpen(true);
  }

  return (
    <div className="flex min-h-screen flex-1">
      <Sidebar
        open={sidebar.open}
        onOpenChange={sidebar.setOpen}
        view={view}
        onViewChange={(v) =>
          updateParams({ view: v, mode: v === "day" ? null : "goals" })
        }
        date={date}
        onDateChange={(d) => updateParams({ date: d.toISOString() })}
        mode={mode}
        onModeChange={(m) => updateParams({ mode: m })}
        tagId={tagId}
        onTagChange={(id) => updateParams({ tagId: id })}
      />

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4 sm:p-8">
        <header className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label="Toggle sidebar"
                onClick={sidebar.toggle}
              >
                <PanelLeft className="size-4" />
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            </div>
            <Button onClick={openNewTask}>
              <Plus className="size-4" />
              New Task
            </Button>
          </div>
          <p className="pl-10 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {viewLabel[view]}
            </span>
            <span className="mx-1.5">·</span>
            {formatPeriodLabel(view, date)}
            {view !== "day" && (
              <>
                <span className="mx-1.5">·</span>
                <span
                  className={cn(
                    "font-medium",
                    mode === "goals"
                      ? "text-primary"
                      : "text-amber-600 dark:text-amber-400",
                  )}
                >
                  {mode === "goals" ? "Goals" : "Breakdown"}
                </span>
              </>
            )}
          </p>
        </header>

        <main className="flex-1">
          {isLoading ? null : (
            <>
              {view === "day" && (
                <DayView tasks={tasks} onTaskClick={openTaskDetail} />
              )}
              {view !== "day" && mode === "goals" && (
                <PeriodGoalsView
                  tasks={tasks}
                  emptyLabel={GOALS_EMPTY_LABEL[view]}
                  onTaskClick={openTaskDetail}
                />
              )}
              {view === "week" && mode === "breakdown" && (
                <WeekView
                  date={date}
                  tasks={tasks}
                  onTaskClick={openTaskDetail}
                />
              )}
              {view === "month" && mode === "breakdown" && (
                <MonthView
                  date={date}
                  tasks={tasks}
                  onTaskClick={openTaskDetail}
                  onWeekClick={(weekStart) =>
                    updateParams({
                      view: "week",
                      date: weekStart.toISOString(),
                      mode: "goals",
                    })
                  }
                />
              )}
              {view === "year" && mode === "breakdown" && (
                <YearView
                  date={date}
                  tasks={tasks}
                  onTaskClick={openTaskDetail}
                  onMonthClick={(month) =>
                    updateParams({
                      view: "month",
                      date: month.toISOString(),
                      mode: "goals",
                    })
                  }
                />
              )}
            </>
          )}
        </main>

        <TaskFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          defaultDate={formAnchor}
          scope={formScope}
          task={editingTask}
          onSaved={() => mutate()}
        />
        <TaskDetailDialog
          task={detailTask}
          open={detailTaskId !== null}
          onOpenChange={(open) => !open && setDetailTaskId(null)}
          onChanged={() => mutate()}
          onEdit={openEditFromDetail}
        />
      </div>
    </div>
  );
}

export default function DashboardApp() {
  return (
    <Suspense fallback={<div className="flex-1 p-8" />}>
      <DashboardContent />
    </Suspense>
  );
}
