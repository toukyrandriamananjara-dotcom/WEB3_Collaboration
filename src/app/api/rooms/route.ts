import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

// GET /api/rooms — public
export async function GET() {
    const rooms = await prisma.room.findMany({
        include: { sessions: { include: { speakers: true }, orderBy: { startTime: "asc" } } },
    });
    return NextResponse.json(rooms);
}

// POST /api/rooms — admin
export async function POST(req: NextRequest) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const body = await req.json();
    const { name } = body;

    if (!name) {
        return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
    }

    const room = await prisma.room.create({ data: { name } });
    return NextResponse.json(room, { status: 201 });
}