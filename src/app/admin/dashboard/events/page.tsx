"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Event } from "@/types";

export default function AdminEventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        try {
            const res = await fetch("/api/events");
            if (res.ok) setEvents(await res.json());
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    startDate: new Date(form.startDate).toISOString(),
                    endDate: new Date(form.endDate).toISOString(),
                }),
            });
            if (res.ok) {
                setForm({ title: "", description: "", startDate: "", endDate: "", location: "" });
                setShowForm(false);
                fetchEvents();
            }
        } finally {
            setSubmitting(false);
        }
    }

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <Link
                        href="/admin/dashboard"
                        className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors mb-3 inline-block"
                    >
                        ← Dashboard
                    </Link>
                    <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">
                        Événements
                    </h1>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                >
                    {showForm ? "Annuler" : "+ Nouvel événement"}
                </button>
            </div>

            {/* Create form */}
            {showForm && (
                <div className="card p-6 mb-8 fade-up">
                    <h2 className="text-lg font-bold text-zinc-200 mb-6">
                        Nouvel événement
                    </h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="label">Titre *</label>
                            <input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Nom de l'événement"
                                required
                                className="input"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Description de l'événement"
                                rows={3}
                                className="input resize-none"
                            />
                        </div>
                        <div>
                            <label className="label">Date de début *</label>
                            <input
                                type="datetime-local"
                                value={form.startDate}
                                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                required
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="label">Date de fin *</label>
                            <input
                                type="datetime-local"
                                value={form.endDate}
                                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                required
                                className="input"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Lieu *</label>
                            <input
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                placeholder="Paris, Palais des Congrès"
                                required
                                className="input"
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                                Annuler
                            </button>
                            <button type="submit" disabled={submitting} className="btn-primary">
                                {submitting ? "Création..." : "Créer l'événement"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Events list */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="w-5 h-5 rounded-full border-2 border-zinc-800 border-t-zinc-500 animate-spin mx-auto" />
                </div>
            ) : events.length === 0 ? (
                <div className="border border-dashed border-zinc-800 rounded-xl p-16 text-center">
                    <p className="text-xs font-mono text-zinc-600">Aucun événement créé</p>
                    <button onClick={() => setShowForm(true)} className="btn-secondary text-xs">
                        Créer le premier événement
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="card p-5 flex items-center justify-between gap-6 hover:border-zinc-700 transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-zinc-100 mb-1">{event.title}</h3>
                                <div className="flex flex-wrap gap-3">
                                    <span className="text-xs font-mono text-zinc-500">{event.location}</span>
                                    <span className="text-xs text-zinc-600">
                    {formatDate(event.startDate)} → {formatDate(event.endDate)}
                  </span>
                                    <span className="text-xs text-zinc-600">
                    {event.sessions.length} session{event.sessions.length !== 1 ? "s" : ""}
                  </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Link
                                    href={`/admin/dashboard/events/${event.id}`}
                                    className="btn-secondary text-xs py-1.5"
                                >
                                    Gérer
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}