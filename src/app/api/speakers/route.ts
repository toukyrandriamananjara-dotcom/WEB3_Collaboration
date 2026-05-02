import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

// GET /api/speakers — public
export async function GET() {
    const speakers = await prisma.speaker.findMany({
        include: { sessions: { include: { event: true, room: true } } },
    });
    return NextResponse.json(speakers);
}

// POST /api/speakers — admin
export async function POST(req: NextRequest) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const body = await req.json();
    const { fullName, photo, bio, externalLinks } = body;

    if (!fullName) {
        return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
    }

    const speaker = await prisma.speaker.create({
        data: { fullName, photo, bio, externalLinks },
    });

    return NextResponse.json(speaker, { status: 201 });
}