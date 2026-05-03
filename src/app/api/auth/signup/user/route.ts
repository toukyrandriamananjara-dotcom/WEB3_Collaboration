import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
        return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { email, passwordHash, name },
    });

    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 });
}