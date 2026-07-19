import { Card, CardContent } from "@/components/ui/card";
import { TagBadge } from "@/components/tags/tag-badge";
import {
  statusBadgeClass,
  statusLabels,
} from "@/components/tasks/status-select";
import type { TaskDTO } from "@/types";
import { cn } from "@/lib/utils";

export function TaskCard({
  task,
  onClick,
  compact = false,
}: {
  task: TaskDTO;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer border-border/60 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10",
        compact ? "gap-1.5 py-2.5" : "gap-2.5 py-3.5",
      )}
    >
      <CardContent
        className={cn("flex flex-col gap-2", compact ? "px-3.5" : "px-4")}
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "leading-snug font-medium",
              task.status === "ARCHIVED" &&
                "text-muted-foreground line-through",
            )}
          >
            {task.title}
          </span>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
              statusBadgeClass[task.status],
            )}
          >
            {statusLabels[task.status]}
          </span>
        </div>
        {!compact && task.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {task.description}
          </p>
        )}
        {!compact && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
