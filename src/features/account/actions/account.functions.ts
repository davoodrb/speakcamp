import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "#/features/auth/lib/auth";
import { prisma } from "#/shared/lib/prisma.server";

export const getPublicProfile = createServerFn({ method: "GET" })
  .validator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    if (!data.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: {
        id: true,
        name: true,
        displayUsername: true,
        image: true,
        bio: true,
        createdAt: true,
      },
    });

    return user;
  });

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
    });

    return updatedUser;
  });
