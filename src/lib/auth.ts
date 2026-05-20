import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // 1. Admin
                const admin = await prisma.admin.findUnique({
                    where: { email: credentials.email },
                });
                if (admin && await bcrypt.compare(credentials.password, admin.passwordHash)) {
                    return { id: admin.id, email: admin.email, role: "admin", name: "Admin" };
                }

                // 2. Speaker
                const speaker = await prisma.speaker.findUnique({
                    where: { email: credentials.email },
                });
                if (speaker?.passwordHash && await bcrypt.compare(credentials.password, speaker.passwordHash)) {
                    return {
                        id: speaker.id,
                        email: speaker.email!,
                        name: speaker.fullName,
                        role: "speaker",
                    };
                }

                // 3. User
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                if (user && await bcrypt.compare(credentials.password, user.passwordHash)) {
                    return { id: user.id, email: user.email, role: "user", name: user.name };
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    session: { strategy: "jwt" },
    pages: { signIn: "/login" },
};