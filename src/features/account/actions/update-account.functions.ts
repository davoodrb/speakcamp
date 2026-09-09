import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "#/features/auth/lib/auth";
import { prisma } from "#/shared/lib/prisma.server";

export const updateAccount = createServerFn({ method: "POST" })
  .validator((data: { bio?: string }) => {
    if (data.bio && data.bio.length > 500) {
      throw new Error("Bio must be 500 characters or less");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { bio: data.bio },
      select: { id: true, bio: true },
    });

    return updatedUser;
  });
