import { addDays, format, isSameDay, isToday, startOfWeek } from "date-fns";
import { TaskCard } from "@/components/tasks/task-card";
import { cn } from "@/lib/utils";
import type { TaskDTO } from "@/types";

export function WeekView({
  date,
  tasks,
  onTaskClick,
}: {
  date: Date;
  tasks: TaskDTO[];
  onTaskClick: (task: TaskDTO) => void;
}) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {days.map((day) => {
        const dayTasks = tasks.filter((t) => isSameDay(new Date(t.date), day));
        return (
          <div
            key={day.toISOString()}
            className={cn(
              "flex flex-col gap-2 rounded-md border p-3",
              isToday(day) && "border-amber-500/60 bg-amber-500/5",
            )}
          >
            <span className="text-sm font-medium">
              {format(day, "EEEE, MMM d")}
            </span>
            {dayTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No tasks for this day.
              </p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {dayTasks.map((task) => (
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
