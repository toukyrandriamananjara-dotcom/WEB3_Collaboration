import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/questions/:id/upvote — public
export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const question = await prisma.question.update({
        where: { id },
        data: { upvotes: { increment: 1 } },
    });

    return NextResponse.json(question);
}