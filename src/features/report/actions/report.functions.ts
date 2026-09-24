import { createServerFn } from "@tanstack/react-start";
import authMiddleware from "#/middlewares/auth";
import { prisma } from "#/shared/lib/prisma.server";
import { createReportFormSchema } from "../schemas";

export const createReport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(createReportFormSchema)
  .handler(async ({ data, context }) => {
    const { session } = context;

    if (data.reportedUserId === session.user.id) {
      throw new Error("You cannot report yourself");
    }

    const reportedUser = await prisma.user.findUnique({
      where: { id: data.reportedUserId },
      select: { id: true },
    });
    if (!reportedUser) {
      throw new Error("Reported user not found");
    }

    const report = await prisma.userReport.create({
      data: {
        reporterId: session.user.id,
        reportedUserId: data.reportedUserId,
        reason: data.reason,
        details: data.details,
      },
    });

    return report;
  });
