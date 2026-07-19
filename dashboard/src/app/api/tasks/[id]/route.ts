import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { serializeTask } from "@/lib/serialize";
import { updateTaskSchema } from "@/lib/validation/task";

const taskInclude = {
  tags: { include: { tag: true } },
  comments: true,
} as const;

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/tasks/[id]">,
) {
  const { id } = await ctx.params;
  const task = await prisma.task.findUnique({
    where: { id },
    include: taskInclude,
  });
  if (!task) return fail("Task not found", 404, "NOT_FOUND");
  return ok(serializeTask(task));
}

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/tasks/[id]">,
) {
  const { id } = await ctx.params;
  const body = await request.json();
  const parsed = updateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return fail(
      parsed.error.issues[0]?.message ?? "Invalid task",
      400,
      "VALIDATION_ERROR",
    );
  }

  const { title, description, status, date, tagIds } = parsed.data;

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        date,
        ...(tagIds
          ? {
              tags: {
                deleteMany: {},
                create: tagIds.map((tagId) => ({
                  tag: { connect: { id: tagId } },
                })),
              },
            }
          : {}),
      },
      include: taskInclude,
    });
    return ok(serializeTask(task));
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return fail("Task not found", 404, "NOT_FOUND");
    }
    throw err;
  }
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/tasks/[id]">,
) {
  const { id } = await ctx.params;
  try {
    await prisma.task.delete({ where: { id } });
    return ok({ id });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return fail("Task not found", 404, "NOT_FOUND");
    }
    throw err;
  }
}
