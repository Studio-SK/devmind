import type { Comment, Tag, Task, TaskTag } from "@/generated/prisma/client";
import type { TaskDTO } from "@/types";

type TaskWithRelations = Task & {
  tags: (TaskTag & { tag: Tag })[];
  comments: Comment[];
};

export function serializeTask(task: TaskWithRelations): TaskDTO {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    scope: task.scope,
    date: task.date.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    tags: task.tags.map(({ tag }) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
    })),
    comments: task.comments
      .map((c) => ({
        id: c.id,
        body: c.body,
        taskId: c.taskId,
        createdAt: c.createdAt.toISOString(),
      }))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  };
}
