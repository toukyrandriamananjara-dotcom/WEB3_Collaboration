import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "speaker") {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const questions = await prisma.question.findMany({
        where: { sessionId: id },
        include: {
            answers: { include: { speaker: true } },
        },
        orderBy: { upvotes: "desc" },
    });

    return NextResponse.json(
        questions.map((q) => ({
            ...q,
            answer: q.answers.length > 0 ? q.answers[0] : null,
        }))
    );
}