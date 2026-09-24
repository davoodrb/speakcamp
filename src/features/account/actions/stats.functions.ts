import { createServerFn } from "@tanstack/react-start";
import authMiddleware from "#/middlewares/auth";
import { prisma } from "#/shared/lib/prisma.server";

const RECENT_SESSIONS_LIMIT = 10;

export const getActivityStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { session } = context;

    const sessions = await prisma.roomSession.findMany({
      where: { userId: session.user.id },
      include: {
        room: {
          select: { language: true, level: true },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    const completedSessions = sessions.filter(
      (session) => session.leftAt !== null,
    );

    const totalMs = completedSessions.reduce(
      (total, session) =>
        total + (session.leftAt as Date).getTime() - session.joinedAt.getTime(),
      0,
    );

    const roomsVisited = new Set(sessions.map((session) => session.roomId))
      .size;

    const recentSessions = sessions
      .slice(0, RECENT_SESSIONS_LIMIT)
      .map((session) => ({
        id: session.id,
        language: session.room.language,
        level: session.room.level,
        joinedAt: session.joinedAt,
        leftAt: session.leftAt,
        durationMs: session.leftAt
          ? session.leftAt.getTime() - session.joinedAt.getTime()
          : null,
      }));

    return {
      totalSessions: sessions.length,
      roomsVisited,
      totalMs,
      recentSessions,
    };
  });
