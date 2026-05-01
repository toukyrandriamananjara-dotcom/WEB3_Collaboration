import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    debug: true,
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const admin = await prisma.admin.findUnique({
                    where: { email: credentials.email },
                });

                if (!admin) return null;

                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    admin.passwordHash
                );

                if (!passwordMatch) return null;

                return { id: admin.id, email: admin.email };
            },
        }),
    ],
    session: { strategy: "jwt" },
    pages: { signIn: "/admin/login" },
};