import { z } from "zod";

export const taskStatusSchema = z.enum([
  "TODO",
  "IN_PROGRESS",
  "DONE",
  "ARCHIVED",
]);
export const taskScopeSchema = z.enum(["DAY", "WEEK", "MONTH", "YEAR"]);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(2000).optional(),
  status: taskStatusSchema.optional(),
  scope: taskScopeSchema.optional(),
  date: z.coerce.date(),
  tagIds: z.array(z.string()).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  status: taskStatusSchema.optional(),
  date: z.coerce.date().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const createCommentSchema = z.object({
  body: z.string().trim().min(1, "Comment cannot be empty").max(2000),
});

export const createTagSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50),
  color: z.string().trim().max(20).optional(),
});
