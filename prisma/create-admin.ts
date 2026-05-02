import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
    const hash = await bcrypt.hash("admin123", 12);
    const admin = await prisma.admin.upsert({
        where: { email: "admin@eventsync.com" },
        update: { passwordHash: hash },
        create: { email: "admin@eventsync.com", passwordHash: hash },
    });
    return NextResponse.json({ message: "Admin créé", email: admin.email });
}