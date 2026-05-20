import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "speaker") {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const { content } = await req.json();
    if (!content?.trim()) {
        return NextResponse.json({ error: "Contenu requis" }, { status: 400 });
    }

    const speaker = await prisma.speaker.findUnique({
        where: { email: session.user.email! },
    });
    if (!speaker) {
        return NextResponse.json({ error: "Intervenant introuvable" }, { status: 404 });
    }

    const answer = await prisma.answer.create({
        data: {
            content: content.trim(),
            questionId: id,
            speakerId: speaker.id,
        },
    });

    return NextResponse.json(answer, { status: 201 });
}