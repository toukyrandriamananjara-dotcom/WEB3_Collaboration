import { AuthProvider } from "react-admin";

export const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
        const res = await fetch("/api/auth/callback/credentials", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, redirect: false }),
        });
        if (!res.ok) {
            throw new Error("Identifiants incorrects");
        }
        // Vérifie que l'utilisateur est bien admin
        const session = await fetch("/api/auth/session").then((r) => r.json());
        if (session?.user?.role !== "admin") {
            throw new Error("Accès non autorisé");
        }
    },

    logout: async () => {
        await fetch("/api/auth/signout", { method: "POST" });
    },

    checkAuth: async () => {
        const session = await fetch("/api/auth/session").then((r) => r.json());
        if (!session || session.user?.role !== "admin") {
            throw new Error();
        }
    },

    checkError: async (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            return Promise.reject();
        }
        return Promise.resolve();
    },

    getPermissions: async () => {
        const session = await fetch("/api/auth/session").then((r) => r.json());
        return session?.user?.role;
    },
};