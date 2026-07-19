import {
  eachWeekOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { TaskCard } from "@/components/tasks/task-card";
import { cn } from "@/lib/utils";
import type { TaskDTO } from "@/types";

export function MonthView({
  date,
  tasks,
  onTaskClick,
  onWeekClick,
}: {
  date: Date;
  tasks: TaskDTO[];
  onTaskClick: (task: TaskDTO) => void;
  onWeekClick: (weekStart: Date) => void;
}) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  const weeks = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 1 },
  ).filter((weekStart) =>
    isWithinInterval(weekStart, { start: monthStart, end: monthEnd }),
  );

  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  return (
    <div className="flex flex-col gap-3">
      {weeks.map((weekStart) => {
        const weekTasks = tasks.filter((t) =>
          isSameDay(new Date(t.date), weekStart),
        );
        return (
          <div
            key={weekStart.toISOString()}
            onClick={() => onWeekClick(weekStart)}
            className={cn(
              "flex cursor-pointer flex-col gap-2 rounded-md border p-3 transition-colors hover:border-primary/50 hover:bg-accent/30",
              isSameDay(weekStart, currentWeekStart) &&
                "border-amber-500/60 bg-amber-500/5",
            )}
          >
            <span className="text-sm font-medium">
              {format(weekStart, "'Week of' MMM d")}
            </span>
            {weekTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No goals for this week.
              </p>
            ) : (
              <div
                className="flex flex-col gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                {weekTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
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
