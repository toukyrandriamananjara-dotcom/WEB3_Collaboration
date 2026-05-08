import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

// DELETE /api/rooms/:id — admin
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const { id } = await params;
    await prisma.room.delete({ where: { id } });
    return NextResponse.json({ message: "Salle supprimée" });
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const room = await prisma.room.findUnique({
        where: { id },
        include: { sessions: { include: { speakers: true }, orderBy: { startTime: "asc" } } },
    });
    if (!room) return NextResponse.json({ error: "Salle introuvable" }, { status: 404 });
    return NextResponse.json(room);
}