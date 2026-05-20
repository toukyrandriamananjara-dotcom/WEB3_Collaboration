"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Session, Speaker, Room } from "@/types";

export default function AdminEditSessionPage() {
    const params = useParams();
    const sessionId = params.id as string;
    const router = useRouter();

    const [session, setSession] = useState<Session | null>(null);
    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        capacity: "",
        roomId: "",
        speakerIds: [] as string[],
    });

    useEffect(() => {
        async function load() {
            try {
                const [sessionRes, speakersRes, roomsRes] = await Promise.all([
                    fetch(`/api/sessions/${sessionId}`),
                    fetch("/api/speakers"),
                    fetch("/api/rooms"),
                ]);
                if (sessionRes.ok) {
                    const data: Session = await sessionRes.json();
                    setSession(data);
                    setForm({
                        title: data.title,
                        description: data.description || "",
                        startTime: data.startTime.slice(0, 16),
                        endTime: data.endTime.slice(0, 16),
                        capacity: data.capacity?.toString() || "",
                        roomId: data.roomId || "",
                        speakerIds: data.speakers?.map((s) => s.id) || [],
                    });
                }
                if (speakersRes.ok) setSpeakers(await speakersRes.json());
                if (roomsRes.ok) setRooms(await roomsRes.json());
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [sessionId]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`/api/sessions/${sessionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    startTime: new Date(form.startTime).toISOString(),
                    endTime: new Date(form.endTime).toISOString(),
                    capacity: form.capacity ? parseInt(form.capacity) : undefined,
                    roomId: form.roomId,
                    speakerIds: form.speakerIds,
                }),
            });
            if (res.ok) {
                router.push(`/admin/dashboard/events/${session?.eventId}`);
                router.refresh();
            }
        } finally {
            setSubmitting(false);
        }
    }

    function toggleSpeaker(id: string) {
        setForm((prev) => ({
            ...prev,
            speakerIds: prev.speakerIds.includes(id)
                ? prev.speakerIds.filter((s) => s !== id)
                : [...prev.speakerIds, id],
        }));
    }

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-16 flex items-center gap-3 text-muted-foreground">
                <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span className="text-sm font-mono">Chargement...</span>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-16">
                <p className="text-foreground">Session introuvable.</p>
                <Link
                    href="/admin/dashboard/events"
                    className="text-sm text-primary mt-4 inline-block font-mono"
                >
                    ← Retour
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <Link
                href={`/admin/dashboard/events/${session.eventId}`}
                className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-8"
            >
                ← Retour à l&#39;événement
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-6">Modifier la session</h1>

            <div className="glass-card p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="label">Titre *</label>
                        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="input" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="label">Description</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input resize-none" />
                    </div>
                    <div>
                        <label className="label">Heure de début *</label>
                        <input type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required className="input" />
                    </div>
                    <div>
                        <label className="label">Heure de fin *</label>
                        <input type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required className="input" />
                    </div>
                    <div>
                        <label className="label">Salle *</label>
                        <select value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })} required className="input">
                            <option value="">Sélectionner une salle</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>{room.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">Capacité</label>
                        <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="150" className="input" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="label">Intervenants</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {speakers.map((speaker) => (
                                <button
                                    key={speaker.id}
                                    type="button"
                                    onClick={() => toggleSpeaker(speaker.id)}
                                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                                        form.speakerIds.includes(speaker.id)
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border text-muted-foreground hover:border-primary"
                                    }`}
                                >
                                    {speaker.fullName}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                        <Link href={`/admin/dashboard/events/${session.eventId}`} className="btn-secondary">
                            Annuler
                        </Link>
                        <button type="submit" disabled={submitting} className="btn-primary">
                            {submitting ? "Sauvegarde..." : "Sauvegarder"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}