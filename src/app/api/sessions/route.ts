import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const sessions = await prisma.session.findMany({
        include: {
            room: true,
            speakers: true,
            event: true,
        },
        orderBy: { startTime: "asc" },
    });
    return NextResponse.json(sessions, {
        headers: {
            "Content-Range": `sessions 0-${sessions.length - 1}/${sessions.length}`,
            "Access-Control-Expose-Headers": "Content-Range",
        },
    });
}