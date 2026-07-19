import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { serializeTask } from "@/lib/serialize";
import {
  createTaskSchema,
  taskScopeSchema,
  taskStatusSchema,
} from "@/lib/validation/task";

const taskInclude = {
  tags: { include: { tag: true } },
  comments: true,
} as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const statusParam = searchParams.get("status");
  const status = statusParam ? taskStatusSchema.safeParse(statusParam) : null;
  if (status && !status.success) {
    return fail("Invalid status filter", 400, "VALIDATION_ERROR");
  }
  const tagId = searchParams.get("tagId");
  const scopeParam = searchParams.get("scope");
  const scope = scopeParam ? taskScopeSchema.safeParse(scopeParam) : null;
  if (scope && !scope.success) {
    return fail("Invalid scope filter", 400, "VALIDATION_ERROR");
  }

  const tasks = await prisma.task.findMany({
    where: {
      ...(from || to
        ? {
            date: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
      ...(status?.success ? { status: status.data } : {}),
      ...(scope?.success ? { scope: scope.data } : {}),
      ...(tagId ? { tags: { some: { tagId } } } : {}),
    },
    include: taskInclude,
    orderBy: { date: "asc" },
  });

  return ok(tasks.map(serializeTask));
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    return fail(
      parsed.error.issues[0]?.message ?? "Invalid task",
      400,
      "VALIDATION_ERROR",
    );
  }

  const { title, description, status, scope, date, tagIds } = parsed.data;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status,
      scope,
      date,
      tags: tagIds
        ? {
            create: tagIds.map((tagId) => ({
              tag: { connect: { id: tagId } },
            })),
          }
        : undefined,
    },
    include: taskInclude,
  });

  return ok(serializeTask(task), 201);
}
