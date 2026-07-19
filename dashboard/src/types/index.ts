export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "ARCHIVED";

export type TaskScope = "DAY" | "WEEK" | "MONTH" | "YEAR";

export type TagDTO = {
  id: string;
  name: string;
  color: string | null;
};

export type CommentDTO = {
  id: string;
  body: string;
  taskId: string;
  createdAt: string;
};

export type TaskDTO = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  scope: TaskScope;
  date: string;
  createdAt: string;
  updatedAt: string;
  tags: TagDTO[];
  comments: CommentDTO[];
};
