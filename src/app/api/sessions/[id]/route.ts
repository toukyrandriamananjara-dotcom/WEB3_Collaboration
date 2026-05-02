import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

// GET /api/sessions/:id — public
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await prisma.session.findUnique({
        where: { id },
        include: {
            room: true,
            speakers: true,
            questions: { orderBy: { upvotes: "desc" } },
            event: true,
        },
    });

    if (!session) return NextResponse.json({ error: "Session introuvable" }, { status: 404 });
    return NextResponse.json(session);
}

// PUT /api/sessions/:id — admin
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const body = await req.json();
    const { title, description, startTime, endTime, capacity, roomId, speakerIds } = body;

    const session = await prisma.session.update({
        where: { id },
        data: {
            title,
            description,
            startTime: startTime ? new Date(startTime) : undefined,
            endTime: endTime ? new Date(endTime) : undefined,
            capacity,
            roomId,
            speakers: speakerIds
                ? { set: speakerIds.map((sid: string) => ({ id: sid })) }
                : undefined,
        },
        include: { room: true, speakers: true },
    });

    return NextResponse.json(session);
}

// DELETE /api/sessions/:id — admin
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const { id } = await params;
    await prisma.session.delete({ where: { id } });
    return NextResponse.json({ message: "Session supprimée" });
}