import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventEmitter } from "@/lib/eventEmitter";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const questions = await prisma.question.findMany({
        where: { sessionId: id },
        orderBy: { upvotes: "desc" },
        include: {
            answers: {
                include: { speaker: true },
            },
        },
    });


    const formatted = questions.map((q) => ({
        ...q,
        answer: q.answers.length > 0 ? q.answers[0] : null,
    }));

    return NextResponse.json(formatted);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await prisma.session.findUnique({ where: { id } });

    if (!session) {
        return NextResponse.json({ error: "Session introuvable" }, { status: 404 });
    }

    const now = new Date();
    const isLive = now >= session.startTime && now <= session.endTime;

    if (!isLive) {
        return NextResponse.json(
            { error: "Les questions ne sont acceptées que pendant la session live" },
            { status: 403 }
        );
    }

    const body = await req.json();
    const { content, authorName } = body;

    if (!content?.trim()) {
        return NextResponse.json({ error: "Le contenu est requis" }, { status: 400 });
    }

    const question = await prisma.question.create({
        data: {
            content: content.trim(),
            authorName: authorName?.trim() || null,
            sessionId: id,
        },
    });

    eventEmitter.emit("new-question", { sessionId: id, question });

    return NextResponse.json(question, { status: 201 });
}