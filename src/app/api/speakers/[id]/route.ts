import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const speaker = await prisma.speaker.findUnique({
        where: { id },
        include: {
            sessions: {
                include: { event: true, room: true },
            },
        },
    });
    if (!speaker)
        return NextResponse.json({ error: "Intervenant introuvable" }, { status: 404 });
    return NextResponse.json(speaker);
}