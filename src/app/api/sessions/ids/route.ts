import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids)) {
        return NextResponse.json([]);
    }
    const sessions = await prisma.session.findMany({
        where: { id: { in: ids } },
        include: { room: true, speakers: true },
    });
    return NextResponse.json(sessions);
}