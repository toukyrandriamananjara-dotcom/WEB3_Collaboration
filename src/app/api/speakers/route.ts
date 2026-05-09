import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const speakers = await prisma.speaker.findMany({
        include: {
            sessions: {
                include: {
                    event: true,
                    room: true,
                    _count: { select: { questions: true } }
                },
                orderBy: { startTime: 'asc' }
            }
        },
    });
    return NextResponse.json(speakers);
}