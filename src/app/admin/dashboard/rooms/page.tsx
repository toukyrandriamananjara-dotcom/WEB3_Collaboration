"use client";

import { useEffect, useState } from "react";
import { Room } from "@/types";
import Link from "next/link";

export default function AdminRoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    async function fetchRooms() {
        try {
            const res = await fetch("/api/rooms");
            if (res.ok) setRooms(await res.json());
        } finally {
            setLoading(false);
        }
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
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Supprimer cette salle ? Les sessions associées perdront leur salle.")) return;
        setDeletingId(id);
        try {
            await fetch(`/api/rooms/${id}`, { method: "DELETE" });
            fetchRooms();
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-10">
                <Link href="/admin/dashboard" className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors mb-3 inline-block">
                    ← Dashboard
                </Link>
                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">Salles</h1>
            </div>

            {/* Create form */}
            <div className="card p-6 mb-8 fade-up">
                <h2 className="text-lg font-bold text-zinc-200 mb-5">Ajouter une salle</h2>
                <form onSubmit={handleCreate} className="flex gap-3">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom de la salle (ex: Salle Ampère)"
                        required
                        className="input flex-1"
                    />
                    <button type="submit" disabled={submitting || !name.trim()} className="btn-primary shrink-0">
                        {submitting ? "Création..." : "Ajouter"}
                    </button>
                </form>
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="w-5 h-5 rounded-full border-2 border-zinc-800 border-t-zinc-500 animate-spin mx-auto" />
                </div>
            ) : rooms.length === 0 ? (
                <div className="border border-dashed border-zinc-800 rounded-xl p-16 text-center">
                    <p className="text-xs font-mono text-zinc-600">Aucune salle créée</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2 fade-up-1">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="card px-5 py-4 flex items-center justify-between hover:border-zinc-700 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                                    <span className="text-xs font-mono text-zinc-500">🏛️</span>
                                </div>
                                <p className="font-medium text-zinc-200">{room.name}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(room.id)}
                                disabled={deletingId === room.id}
                                className="btn-danger text-xs py-1.5"
                            >
                                {deletingId === room.id ? "Suppression..." : "Supprimer"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}