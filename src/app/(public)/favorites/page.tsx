"use client";
import { useEffect, useState } from "react";
import { useFavorites} from "../../../../hooks/useFavorite";
import Link from "next/link";
import { Session } from "@/types";

export default function FavoritesPage() {
    const { favorites } = useFavorites();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            if (favorites.length === 0) {
                setSessions([]);
                setLoading(false);
                return;
            }
            const res = await fetch("/api/sessions/ids", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: favorites }),
            });
            if (res.ok) setSessions(await res.json());
            setLoading(false);
        }
        load();
    }, [favorites]);

    if (loading) {
        return (
            <div className="p-8 flex items-center gap-3 text-muted-foreground">
                <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                Chargement...
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Mes favoris</h1>
            {sessions.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl p-12 text-center">
                    <p className="text-muted-foreground">
                        Vous n&#39;avez pas encore de session favorite.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {sessions.map((session) => {
                        const live =
                            new Date(session.startTime) <= new Date() &&
                            new Date(session.endTime) >= new Date();
                        return (
                            <Link
                                key={session.id}
                                href={`/sessions/${session.id}`}
                                className={`glass-card p-4 hover:shadow-md transition-all flex items-center justify-between ${
                                    live ? "border-destructive/30 bg-destructive/5" : ""
                                }`}
                            >
                                <div>
                                    <h3 className="font-semibold text-foreground">{session.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {session.room?.name} ·{" "}
                                        {new Date(session.startTime).toLocaleTimeString("fr-FR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <span className="text-foreground/30">→</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}