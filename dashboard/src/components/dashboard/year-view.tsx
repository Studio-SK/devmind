import {
  eachMonthOfInterval,
  endOfYear,
  format,
  isSameMonth,
  isSameYear,
  startOfYear,
} from "date-fns";
import { TaskCard } from "@/components/tasks/task-card";
import { cn } from "@/lib/utils";
import type { TaskDTO } from "@/types";

export function YearView({
  date,
  tasks,
  onTaskClick,
  onMonthClick,
}: {
  date: Date;
  tasks: TaskDTO[];
  onTaskClick: (task: TaskDTO) => void;
  onMonthClick: (month: Date) => void;
}) {
  const months = eachMonthOfInterval({
    start: startOfYear(date),
    end: endOfYear(date),
  });

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {months.map((month) => {
        const monthTasks = tasks.filter((t) =>
          isSameMonth(new Date(t.date), month),
        );
        return (
          <div
            key={month.toISOString()}
            onClick={() => onMonthClick(month)}
            className={cn(
              "flex cursor-pointer flex-col gap-2 rounded-md border p-3 text-left transition-colors hover:border-primary/50 hover:bg-accent/30",
              isSameMonth(month, new Date()) &&
                isSameYear(month, new Date()) &&
                "border-amber-500/60 bg-amber-500/5",
            )}
          >
            <span className="font-medium">{format(month, "MMMM")}</span>
            {monthTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No goals for this month.
              </p>
            ) : (
              <div
                className="flex flex-col gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                {monthTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    compact
                    onClick={() => onTaskClick(task)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
