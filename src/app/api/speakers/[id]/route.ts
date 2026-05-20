import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

// GET /api/speakers/[id] — public
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const speaker = await prisma.speaker.findUnique({
        where: { id },
        include: {
            sessions: {
                include: { event: true, room: true, _count: { select: { questions: true } } },
                orderBy: { startTime: "asc" },
            },
        },
    });
    if (!speaker) return NextResponse.json({ error: "Intervenant introuvable" }, { status: 404 });
    return NextResponse.json(speaker);
}

// PUT /api/speakers/[id] — admin
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const body = await req.json();
    const { fullName, photo, bio, externalLinks } = body;

    const speaker = await prisma.speaker.update({
        where: { id },
        data: { fullName, photo, bio, externalLinks },
    });

    return NextResponse.json(speaker);
}

// DELETE /api/speakers/[id] — admin
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const { id } = await params;
    await prisma.speaker.delete({ where: { id } });
    return NextResponse.json({ message: "Intervenant supprimé" });
}