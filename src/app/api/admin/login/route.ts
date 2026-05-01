import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return NextResponse.json({ error: "Introuvable" }, { status: 401 });
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return NextResponse.json({ error: "Mauvais mot de passe" }, { status: 401 });
    return NextResponse.json({ message: "OK", adminId: admin.id });
}