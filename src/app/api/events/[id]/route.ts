import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

// GET /api/events/:id — public
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log(">>> ID reçu par la route:", id); // ← ajoute cette ligne

    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            sessions: {
                include: { room: true, speakers: true, questions: true },
                orderBy: { startTime: "asc" },
            },
        },
    });

    if (!event) return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });
    return NextResponse.json(event);
}

// PUT /api/events/:id — admin
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const body = await req.json();
    const { title, description, startDate, endDate, location } = body;

    const event = await prisma.event.update({
        where: { id },
        data: {
            title,
            description,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            location,
        },
    });

    return NextResponse.json(event);
}

// DELETE /api/events/:id — admin
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const { id } = await params;
    console.log(">>> DELETE id reçu:", id);
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ message: "Événement supprimé" });
}