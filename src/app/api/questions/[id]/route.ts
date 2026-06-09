import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

// GET /api/questions/:id — public (pour l'édition dans react-admin)
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const question = await prisma.question.findUnique({
        where: { id },
        include: {
            session: { include: { event: true } },
        },
    });
    if (!question) {
        return NextResponse.json({ error: "Question non trouvée" }, { status: 404 });
    }
    return NextResponse.json(question);
}

// PUT /api/questions/:id — admin (modifier la visibilité)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const body = await req.json();
    const { content, authorName, upvotes } = body;

    const question = await prisma.question.update({
        where: { id },
        data: {
            content: content !== undefined ? content : undefined,
            authorName: authorName !== undefined ? authorName : undefined,
            upvotes: upvotes !== undefined ? upvotes : undefined,
        },
    });
    return NextResponse.json(question);
}

// DELETE /api/questions/:id — admin (supprimer une question)
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const { id } = await params;
    await prisma.question.delete({ where: { id } });
    return NextResponse.json({ success: true });
}