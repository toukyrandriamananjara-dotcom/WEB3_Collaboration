"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Room } from "@/types";

export default function AdminRoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchRooms(); }, []);

    async function fetchRooms() {
        try {
            const res = await fetch("/api/rooms");
            if (res.ok) setRooms(await res.json());
        } finally { setLoading(false); }
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/rooms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim() }),
            });
            if (res.ok) {
                setName("");
                fetchRooms();
            }
        } finally { setSubmitting(false); }
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-10">
                <Link
                    href="/admin/dashboard"
                    className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-3 inline-block"
                >
                    ← Dashboard
                </Link>
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Salles</h1>
            </div>

            {/* Formulaire d'ajout */}
            <div className="glass-card p-6 mb-8 fade-up">
                <h2 className="text-lg font-bold text-foreground mb-5">Ajouter une salle</h2>
                <form onSubmit={handleCreate} className="flex gap-3">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom de la salle (ex: Salle Ampère)"
                        required
                        className="input flex-1"
                    />
                    <button
                        type="submit"
                        disabled={submitting || !name.trim()}
                        className="btn-primary shrink-0"
                    >
                        {submitting ? "Ajout..." : "Ajouter"}
                    </button>
                </form>
            </div>

            {/* Grille des salles */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                </div>
            ) : rooms.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl p-16 text-center">
                    <p className="text-xs font-mono text-muted-foreground">Aucune salle créée</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 fade-up-1">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="glass-card p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-all"
                        >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                                <span className="text-xl">🏛️</span>
                            </div>
                            <p className="font-medium text-foreground">{room.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}