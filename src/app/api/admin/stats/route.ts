import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const [
        totalEvents,
        totalSessions,
        totalSpeakers,
        totalRooms,
        totalQuestions,
        totalUsers,
        questionsPerDayRaw,
    ] = await Promise.all([
        prisma.event.count(),
        prisma.session.count(),
        prisma.speaker.count(),
        prisma.room.count(),
        prisma.question.count(),
        prisma.user.count(),
        prisma.$queryRaw<{ date: Date; count: bigint }[]>`
            SELECT DATE("createdAt") as date, COUNT(*) as count
            FROM "Question"
            GROUP BY DATE("createdAt")
            ORDER BY date DESC
                LIMIT 7
        `,
    ]);

    // Conversion des BigInt en Number
    const questionsPerDay = questionsPerDayRaw.map((item) => ({
        date: item.date,
        count: Number(item.count),
    }));

    return NextResponse.json({
        totalEvents: Number(totalEvents),
        totalSessions: Number(totalSessions),
        totalSpeakers: Number(totalSpeakers),
        totalRooms: Number(totalRooms),
        totalQuestions: Number(totalQuestions),
        totalUsers: Number(totalUsers),
        questionsPerDay,
    });
}