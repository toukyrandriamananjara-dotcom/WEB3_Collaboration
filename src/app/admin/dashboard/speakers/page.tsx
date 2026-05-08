"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Speaker } from "@/types";

export default function AdminSpeakersPage() {
    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const emptyForm = { fullName: "", bio: "", photo: "", twitter: "", linkedin: "", github: "", website: "" };
    const [form, setForm] = useState(emptyForm);

    useEffect(() => { fetchSpeakers(); }, []);

    async function fetchSpeakers() {
        try {
            const res = await fetch("/api/speakers");
            if (res.ok) setSpeakers(await res.json());
        } finally { setLoading(false); }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        const body = {
            fullName: form.fullName,
            bio: form.bio || undefined,
            photo: form.photo || undefined,
            externalLinks: {
                ...(form.twitter && { twitter: form.twitter }),
                ...(form.linkedin && { linkedin: form.linkedin }),
                ...(form.github && { github: form.github }),
                ...(form.website && { website: form.website }),
            },
        };
        try {
            const url = editingId ? `/api/speakers/${editingId}` : "/api/speakers";
            const method = editingId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                setForm(emptyForm);
                setShowForm(false);
                setEditingId(null);
                fetchSpeakers();
            }
        } finally { setSubmitting(false); }
    }

    function startEdit(speaker: Speaker) {
        setForm({
            fullName: speaker.fullName,
            bio: speaker.bio || "",
            photo: speaker.photo || "",
            twitter: speaker.externalLinks?.twitter || "",
            linkedin: speaker.externalLinks?.linkedin || "",
            github: speaker.externalLinks?.github || "",
            website: speaker.externalLinks?.website || "",
        });
        setEditingId(speaker.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(id: string) {
        if (!confirm("Supprimer cet intervenant ?")) return;
        setDeletingId(id);
        try {
            await fetch(`/api/speakers/${id}`, { method: "DELETE" });
            fetchSpeakers();
        } finally { setDeletingId(null); }
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <Link
                        href="/admin/dashboard"
                        className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-3 inline-block"
                    >
                        ← Dashboard
                    </Link>
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Intervenants</h1>
                </div>
                <button
                    onClick={() => {
                        if (showForm && editingId) { setEditingId(null); setForm(emptyForm); }
                        setShowForm(!showForm);
                    }}
                    className="btn-primary"
                >
                    {showForm ? "Annuler" : "+ Ajouter un intervenant"}
                </button>
            </div>

            {/* Formulaire (création / modification) */}
            {showForm && (
                <div className="glass-card p-6 mb-8 fade-up">
                    <h2 className="text-lg font-bold text-foreground mb-6">
                        {editingId ? "Modifier l'intervenant" : "Nouvel intervenant"}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="label">Nom complet *</label>
                            <input
                                value={form.fullName}
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                required
                                placeholder="Alice Dupont"
                                className="input"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Biographie</label>
                            <textarea
                                value={form.bio}
                                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                rows={3}
                                placeholder="Courte biographie..."
                                className="input resize-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Photo (URL)</label>
                            <input
                                value={form.photo}
                                onChange={(e) => setForm({ ...form, photo: e.target.value })}
                                placeholder="https://example.com/photo.jpg"
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="label">Twitter</label>
                            <input
                                value={form.twitter}
                                onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                                placeholder="https://twitter.com/..."
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="label">LinkedIn</label>
                            <input
                                value={form.linkedin}
                                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                                placeholder="https://linkedin.com/in/..."
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="label">GitHub</label>
                            <input
                                value={form.github}
                                onChange={(e) => setForm({ ...form, github: e.target.value })}
                                placeholder="https://github.com/..."
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="label">Site web</label>
                            <input
                                value={form.website}
                                onChange={(e) => setForm({ ...form, website: e.target.value })}
                                placeholder="https://..."
                                className="input"
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                                className="btn-secondary"
                            >
                                Annuler
                            </button>
                            <button type="submit" disabled={submitting} className="btn-primary">
                                {submitting ? "Sauvegarde..." : editingId ? "Modifier" : "Créer"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Liste des intervenants */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                </div>
            ) : speakers.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl p-16 text-center">
                    <p className="text-xs font-mono text-muted-foreground">Aucun intervenant</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {speakers.map((speaker) => (
                        <div
                            key={speaker.id}
                            className="glass-card p-5 flex items-start gap-4 hover:shadow-md transition-all"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0 overflow-hidden">
                                {speaker.photo ? (
                                    <img src={speaker.photo} alt={speaker.fullName} className="w-full h-full object-cover" />
                                ) : (
                                    speaker.fullName.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground mb-1">{speaker.fullName}</p>
                                {speaker.bio && (
                                    <p className="text-xs text-muted-foreground line-clamp-2">{speaker.bio}</p>
                                )}
                                <p className="text-xs font-mono text-muted-foreground mt-1">
                                    {speaker.sessions?.length || 0} session{(speaker.sessions?.length || 0) !== 1 ? "s" : ""}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                                <button onClick={() => startEdit(speaker)} className="btn-secondary text-xs py-1.5">
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(speaker.id)}
                                    disabled={deletingId === speaker.id}
                                    className="btn-danger text-xs py-1.5"
                                >
                                    {deletingId === speaker.id ? "..." : "Supprimer"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}