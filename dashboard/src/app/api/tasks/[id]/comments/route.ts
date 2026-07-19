import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { createCommentSchema } from "@/lib/validation/task";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/tasks/[id]/comments">,
) {
  const { id } = await ctx.params;
  const comments = await prisma.comment.findMany({
    where: { taskId: id },
    orderBy: { createdAt: "asc" },
  });
  return ok(
    comments.map((c) => ({
      id: c.id,
      body: c.body,
      taskId: c.taskId,
      createdAt: c.createdAt.toISOString(),
    })),
  );
}

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/tasks/[id]/comments">,
) {
  const { id } = await ctx.params;
  const body = await request.json();
  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) {
    return fail(
      parsed.error.issues[0]?.message ?? "Invalid comment",
      400,
      "VALIDATION_ERROR",
    );
  }

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return fail("Task not found", 404, "NOT_FOUND");

  const comment = await prisma.comment.create({
    data: { body: parsed.data.body, taskId: id },
  });

  return ok(
    {
      id: comment.id,
      body: comment.body,
      taskId: comment.taskId,
      createdAt: comment.createdAt.toISOString(),
    },
    201,
  );
}
