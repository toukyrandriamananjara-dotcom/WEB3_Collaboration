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

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
        return NextResponse.json({ error: "Nom requis" }, { status: 400 });
    }

    try {
        const updatedRoom = await prisma.room.update({
            where: { id },
            data: { name },
        });
        return NextResponse.json(updatedRoom);
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
    }
}


