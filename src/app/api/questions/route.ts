import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const questions = await prisma.question.findMany({
        include: {
            session: { include: { event: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(questions, {
        headers: {
            "Content-Range": `questions 0-${questions.length - 1}/${questions.length}`,
            "Access-Control-Expose-Headers": "Content-Range",
        },
    });
}