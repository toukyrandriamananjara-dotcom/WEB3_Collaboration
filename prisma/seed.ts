import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const hash = await bcrypt.hash("admin123", 12);
    await prisma.admin.upsert({
        where: { email: "admin@eventsync.com" },
        update: {},
        create: { email: "admin@eventsync.com", passwordHash: hash },
    });
    console.log("Admin créé : admin@eventsync.com / admin123");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());