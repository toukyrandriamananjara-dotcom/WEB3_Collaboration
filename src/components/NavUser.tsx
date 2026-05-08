"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const roleLabel: Record<string, string> = {
    admin: "Admin",
    speaker: "Intervenant",
    user: "Participant",
};

const roleColor: Record<string, string> = {
    admin: "text-red-400 border-red-500/30 bg-red-500/10",
    speaker: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    user: "text-zinc-400 border-zinc-700 bg-zinc-800",
};

export default function NavUser() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="w-20 h-6 bg-zinc-800 rounded-md animate-pulse" />;
    }

    if (!session) {
        return (
            <div className="flex items-center gap-3">
                <Link
                    href="/login"
                    className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-medium"
                >
                    Se connecter
                </Link>
                <Link
                    href="/signup"
                    className="text-xs font-mono tracking-wider text-zinc-900 bg-zinc-100 px-3.5 py-1.5 rounded-md hover:bg-white transition-colors font-semibold"
                >
                    Créer un compte
                </Link>
            </div>
        );
    }

    const role = session.user?.role || "user";
    const name = session.user?.name || session.user?.email || "Utilisateur";

    return (
        <div className="flex items-center gap-3">
      <span
          className={`text-[10px] font-mono tracking-widest uppercase border px-2 py-0.5 rounded-sm ${
              roleColor[role] || roleColor.user
          }`}
      >
        {roleLabel[role] || role}
      </span>
            <span className="text-sm text-zinc-300 font-medium hidden sm:block">
        {name}
      </span>
            {role === "admin" && (
                <Link
                    href="/admin/dashboard"
                    className="text-xs font-mono tracking-wider text-zinc-600 border border-zinc-800 px-3 py-1.5 rounded-md hover:border-zinc-600 hover:text-zinc-400 transition-all"
                >
                    Dashboard
                </Link>
            )}
            <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors border border-zinc-800 px-3 py-1.5 rounded-md hover:border-zinc-700"
            >
                Déconnexion
            </button>
        </div>
    );
}