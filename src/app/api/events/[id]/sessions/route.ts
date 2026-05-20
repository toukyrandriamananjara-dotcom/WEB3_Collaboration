import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

// GET /api/events/:id/sessions — public
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const sessions = await prisma.session.findMany({
        where: { eventId: id },
        include: { room: true, speakers: true },
        orderBy: { startTime: "asc" },
    });
    return NextResponse.json(sessions);
}

// POST /api/events/:id/sessions — admin
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const body = await req.json();
    const { title, description, startTime, endTime, capacity, roomId, speakerIds } = body;

    if (!title || !startTime || !endTime || !roomId) {
        return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const session = await prisma.session.create({
        data: {
            title,
            description,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            capacity,
            eventId: id,
            roomId,
            speakers: speakerIds?.length
                ? { connect: speakerIds.map((sid: string) => ({ id: sid })) }
                : undefined,
        },
        include: { room: true, speakers: true },
    });

    return NextResponse.json(session, { status: 201 });
}