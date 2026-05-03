import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    const { email, password, fullName, bio } = await req.json();

    if (!email || !password || !fullName) {
        return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const existing = await prisma.speaker.findUnique({ where: { email } });
    if (existing) {
        return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const speaker = await prisma.speaker.create({
        data: { email, passwordHash, fullName, bio },
    });

    return NextResponse.json({ id: speaker.id, email: speaker.email, fullName: speaker.fullName }, { status: 201 });
}