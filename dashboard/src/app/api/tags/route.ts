import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { createTagSchema } from "@/lib/validation/task";

export async function GET() {
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
  return ok(tags);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createTagSchema.safeParse(body);
  if (!parsed.success) {
    return fail(
      parsed.error.issues[0]?.message ?? "Invalid tag",
      400,
      "VALIDATION_ERROR",
    );
  }

  try {
    const tag = await prisma.tag.create({ data: parsed.data });
    return ok(tag, 201);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return fail("A tag with this name already exists", 409, "CONFLICT");
    }
    throw err;
  }
}
