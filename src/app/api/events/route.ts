import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

// GET /api/events — public
export async function GET() {
    const events = await prisma.event.findMany({
        include: {
            sessions: {
                include: { room: true, speakers: true },
                orderBy: { startTime: "asc" },
            },
        },
        orderBy: { startDate: "asc" },
    });
    return NextResponse.json(events);
}

// POST /api/events — admin
export async function POST(req: NextRequest) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const body = await req.json();
    const { title, description, startDate, endDate, location } = body;

    if (!title || !startDate || !endDate || !location) {
        return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const event = await prisma.event.create({
        data: {
            title,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            location,
        },
    });

    return NextResponse.json(event, { status: 201 });
}