import { PeriodGoalsView } from "@/components/dashboard/period-goals-view";
import type { TaskDTO } from "@/types";

export function DayView({
  tasks,
  onTaskClick,
}: {
  tasks: TaskDTO[];
  onTaskClick: (task: TaskDTO) => void;
}) {
  return (
    <PeriodGoalsView
      tasks={tasks}
      emptyLabel="No tasks for this day."
      onTaskClick={onTaskClick}
    />
  );
}
