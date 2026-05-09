"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function NavUser() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="w-20 h-6 bg-secondary rounded-md animate-pulse" />;
    }

    if (!session) {
        return (
            <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-foreground/80 hover:text-primary transition-colors font-medium">
                    Se connecter
                </Link>
                <Link href="/signup" className="text-xs font-mono tracking-wider text-white bg-primary px-3.5 py-1.5 rounded-md hover:opacity-90 transition-colors font-semibold shadow-glow">
                    Créer un compte
                </Link>
            </div>
        );
    }

    const role = session.user?.role || "user";
    const name = session.user?.name || session.user?.email || "Utilisateur";

    return (
        <div className="flex items-center gap-3">
      <span className={`text-[10px] font-mono tracking-widest uppercase border px-2 py-0.5 rounded-sm ${
          role === "admin"
              ? "bg-primary-soft text-primary border-primary/30"
              : role === "speaker"
                  ? "bg-accent/50 text-primary border-primary/30"
                  : "bg-secondary text-foreground/60 border-border"
      }`}>
        {role === "admin" ? "Admin" : role === "speaker" ? "Intervenant" : "Participant"}
          {role === "speaker" && (
              <Link
                  href="/speaker/dashboard"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                  Mon espace
              </Link>
          )}
      </span>
            <span className="text-sm text-foreground/80 font-medium hidden sm:block">{name}</span>
            {role === "admin" && (
                <Link href="/admin/dashboard" className="text-xs font-mono text-foreground/60 border border-border px-3 py-1.5 rounded-md hover:border-primary hover:text-primary transition-all">
                    Dashboard
                </Link>
            )}
            <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-xs font-mono text-foreground/60 hover:text-primary transition-colors border border-border px-3 py-1.5 rounded-md hover:border-primary"
            >
                Déconnexion
            </button>
        </div>
    );
}