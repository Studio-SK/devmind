import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/tags/[id]">,
) {
  const { id } = await ctx.params;
  try {
    await prisma.tag.delete({ where: { id } });
    return ok({ id });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return fail("Tag not found", 404, "NOT_FOUND");
    }
    throw err;
  }
}
