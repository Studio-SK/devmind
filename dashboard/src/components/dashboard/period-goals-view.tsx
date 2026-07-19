import { TaskCard } from "@/components/tasks/task-card";
import type { TaskDTO } from "@/types";

export function PeriodGoalsView({
  tasks,
  emptyLabel,
  onTaskClick,
}: {
  tasks: TaskDTO[];
  emptyLabel: string;
  onTaskClick: (task: TaskDTO) => void;
}) {
  if (tasks.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
      ))}
    </div>
  );
}
