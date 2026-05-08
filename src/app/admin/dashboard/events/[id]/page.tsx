"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Event, Session, Speaker, Room } from "@/types";
import {router} from "next/client";

export default function AdminEventDetailPage() {
    const params = useParams();
    const eventId = params.id as string;

    const [event, setEvent] = useState<Event | null>(null);
    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSessionForm, setShowSessionForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
    });

    const [sessionForm, setSessionForm] = useState({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        capacity: "",
        roomId: "",
        speakerIds: [] as string[],
    });

    useEffect(() => {
        fetchAll();
    }, [eventId]);

    async function fetchAll() {
        try {
            const [evRes, spRes, roRes] = await Promise.all([
                fetch(`/api/events/${eventId}`),
                fetch("/api/speakers"),
                fetch("/api/rooms"),
            ]);
            if (evRes.ok) {
                const data: Event = await evRes.json();
                setEvent(data);
                setEditForm({
                    title: data.title,
                    description: data.description || "",
                    startDate: data.startDate.slice(0, 16),
                    endDate: data.endDate.slice(0, 16),
                    location: data.location,
                });
            }
            if (spRes.ok) setSpeakers(await spRes.json());
            if (roRes.ok) setRooms(await roRes.json());
        } finally {
            setLoading(false);
        }
    }

    async function handleEditEvent(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`/api/events/${eventId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...editForm,
                    startDate: new Date(editForm.startDate).toISOString(),
                    endDate: new Date(editForm.endDate).toISOString(),
                }),
            });
            if (res.ok) {
                setShowEditForm(false);
                fetchAll();
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function handleCreateSession(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`/api/events/${eventId}/sessions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...sessionForm,
                    capacity: sessionForm.capacity ? parseInt(sessionForm.capacity) : undefined,
                    startTime: new Date(sessionForm.startTime).toISOString(),
                    endTime: new Date(sessionForm.endTime).toISOString(),
                }),
            });
            if (res.ok) {
                setSessionForm({ title: "", description: "", startTime: "", endTime: "", capacity: "", roomId: "", speakerIds: [] });
                setShowSessionForm(false);
                fetchAll();
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDeleteSession(sessionId: string) {
        if (!confirm("Supprimer cette session ?")) return;
        setDeletingId(sessionId);
        try {
            await fetch(`/api/sessions/${sessionId}`, { method: "DELETE" });
            fetchAll();
        } finally {
            setDeletingId(null);
        }
    }

    function toggleSpeaker(id: string) {
        setSessionForm((prev) => ({
            ...prev,
            speakerIds: prev.speakerIds.includes(id)
                ? prev.speakerIds.filter((s) => s !== id)
                : [...prev.speakerIds, id],
        }));
    }

    function formatTime(dateStr: string) {
        return new Date(dateStr).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    }

    if (loading) return (
        <div className="max-w-6xl mx-auto px-6 py-16 flex items-center gap-3 text-zinc-600">
            <div className="w-4 h-4 rounded-full border-2 border-zinc-800 border-t-zinc-500 animate-spin" />
            <span className="text-sm font-mono">Chargement...</span>
        </div>
    );

    if (!event) return (
        <div className="max-w-6xl mx-auto px-6 py-16">
            <p className="text-zinc-400">Événement introuvable.</p>
        </div>
    );

    async function handleDeleteEvent() {
        if (!confirm("Supprimer définitivement cet événement et toutes ses sessions ?")) return;
        try {
            await fetch(`/api/events/${eventId}`, { method: "DELETE" });
            router.push("/admin/dashboard/events");
        } catch {}
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Back */}
            <Link href="/admin/dashboard/events" className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors mb-8 inline-block">
                ← Événements
            </Link>

            {/* Event header */}
            <div className="flex items-start justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100 mb-2">{event.title}</h1>
                    <p className="text-sm text-zinc-500">{event.location}</p>
                </div>
                <button
                    onClick={() => setShowEditForm(!showEditForm)}
                    className="btn-secondary shrink-0"
                >
                    {showEditForm ? "Annuler" : "Modifier l'événement"}
                </button>
                <button onClick={handleDeleteEvent} className="btn-danger shrink-0">Supprimer l&#39;événement</button>
            </div>

            {/* Edit event form */}
            {showEditForm && (
                <div className="card p-6 mb-10 fade-up">
                    <h2 className="text-lg font-bold text-zinc-200 mb-6">Modifier l&#39;événement</h2>
                    <form onSubmit={handleEditEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="label">Titre</label>
                            <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required className="input" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Description</label>
                            <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} className="input resize-none" />
                        </div>
                        <div>
                            <label className="label">Début</label>
                            <input type="datetime-local" value={editForm.startDate} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} required className="input" />
                        </div>
                        <div>
                            <label className="label">Fin</label>
                            <input type="datetime-local" value={editForm.endDate} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} required className="input" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Lieu</label>
                            <input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} required className="input" />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowEditForm(false)} className="btn-secondary">Annuler</button>
                            <button type="submit" disabled={submitting} className="btn-primary">{submitting ? "Sauvegarde..." : "Sauvegarder"}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Sessions */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-zinc-200">Sessions ({event.sessions.length})</h2>
                    <button onClick={() => setShowSessionForm(!showSessionForm)} className="btn-primary text-sm">
                        {showSessionForm ? "Annuler" : "+ Ajouter une session"}
                    </button>
                </div>

                {/* New session form */}
                {showSessionForm && (
                    <div className="card p-6 mb-6 fade-up">
                        <h3 className="text-base font-bold text-zinc-200 mb-5">Nouvelle session</h3>
                        <form onSubmit={handleCreateSession} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="label">Titre *</label>
                                <input value={sessionForm.title} onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })} required placeholder="Titre de la session" className="input" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Description</label>
                                <textarea value={sessionForm.description} onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })} rows={2} className="input resize-none" />
                            </div>
                            <div>
                                <label className="label">Heure de début *</label>
                                <input type="datetime-local" value={sessionForm.startTime} onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })} required className="input" />
                            </div>
                            <div>
                                <label className="label">Heure de fin *</label>
                                <input type="datetime-local" value={sessionForm.endTime} onChange={(e) => setSessionForm({ ...sessionForm, endTime: e.target.value })} required className="input" />
                            </div>
                            <div>
                                <label className="label">Salle *</label>
                                <select value={sessionForm.roomId} onChange={(e) => setSessionForm({ ...sessionForm, roomId: e.target.value })} required className="input">
                                    <option value="">Sélectionner une salle</option>
                                    {rooms.map((room) => (
                                        <option key={room.id} value={room.id}>{room.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="label">Capacité (optionnel)</label>
                                <input type="number" value={sessionForm.capacity} onChange={(e) => setSessionForm({ ...sessionForm, capacity: e.target.value })} placeholder="150" className="input" />
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
                                                sessionForm.speakerIds.includes(speaker.id)
                                                    ? "border-zinc-400 bg-zinc-700 text-zinc-100"
                                                    : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
                                            }`}
                                        >
                                            {speaker.fullName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowSessionForm(false)} className="btn-secondary">Annuler</button>
                                <button type="submit" disabled={submitting} className="btn-primary">{submitting ? "Création..." : "Créer la session"}</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Sessions list */}
                {event.sessions.length === 0 ? (
                    <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center">
                        <p className="text-xs font-mono text-zinc-600">Aucune session pour cet événement</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {event.sessions
                            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                            .map((session) => (
                                <div key={session.id} className="card p-4 flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="text-center w-16 shrink-0">
                                            <p className="text-xs font-mono text-zinc-400">{formatTime(session.startTime)}</p>
                                            <p className="text-xs font-mono text-zinc-600">{formatTime(session.endTime)}</p>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-zinc-200 truncate">{session.title}</p>
                                            <p className="text-xs text-zinc-600 mt-0.5">
                                                {session.room.name} · {session.speakers.map((s) => s.fullName).join(", ")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Link href={`/admin/dashboard/sessions/${session.id}`} className="btn-secondary text-xs py-1.5">
                                            Modifier
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteSession(session.id)}
                                            disabled={deletingId === session.id}
                                            className="btn-danger text-xs py-1.5"
                                        >
                                            {deletingId === session.id ? "..." : "Supprimer"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}