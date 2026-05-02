"use client";

import { signOut } from "next-auth/react";

export default function AdminLogout() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-xs font-mono text-zinc-600 border border-zinc-800 px-4 py-2 rounded-lg hover:border-zinc-700 hover:text-zinc-400 transition-all"
        >
            Déconnexion
        </button>
    );
}