import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users, {
        headers: { "Content-Range": `users 0-${users.length-1}/${users.length}`, "Access-Control-Expose-Headers": "Content-Range" }
    });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, name, password, role = "user" } = body;
    if (!email || !name || !password) {
        return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
    data: { email, name, passwordHash, role: "user" },
    });
    return NextResponse.json(user, { status: 201 });
}