"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Session, Question } from "@/types";

function isLive(session: Session): boolean {
    const now = new Date();
    return new Date(session.startTime) <= now && new Date(session.endTime) >= now;
}

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function SessionPage({
                                        params,
                                    }: {
    params: { id: string };
}) {
    const [session, setSession] = useState<Session | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [questionText, setQuestionText] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [upvoted, setUpvoted] = useState<Set<string>>(new Set());
    const [error, setError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const fetchQuestions = useCallback(async () => {
        try {
            const res = await fetch(`/api/sessions/${params.id}/questions`);
            if (!res.ok) return;
            setQuestions(await res.json());
        } catch {}
    }, [params.id]);

    useEffect(() => {
        async function fetchSession() {
            try {
                const res = await fetch(`/api/sessions/${params.id}`);
                if (!res.ok) return;
                const data: Session = await res.json();
                setSession(data);
                setQuestions(data.questions || []);
            } finally {
                setLoading(false);
            }
        }
        fetchSession();
        const interval = setInterval(fetchQuestions, 5000);
        return () => clearInterval(interval);
    }, [params.id, fetchQuestions]);

    async function submitQuestion(e: React.FormEvent) {
        e.preventDefault();
        if (!questionText.trim()) return;
        setSubmitting(true);
        setError("");
        try {
            const res = await fetch(`/api/sessions/${params.id}/questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: questionText.trim(),
                    authorName: authorName.trim() || undefined,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Une erreur s'est produite");
            } else {
                setQuestionText("");
                setAuthorName("");
                setSubmitSuccess(true);
                setTimeout(() => setSubmitSuccess(false), 2000);
                fetchQuestions();
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function upvote(questionId: string) {
        if (upvoted.has(questionId)) return;
        setUpvoted((prev) => new Set([...prev, questionId]));
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
            )
        );
        try {
            await fetch(`/api/questions/${questionId}/upvote`, { method: "POST" });
        } catch {}
    }

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="flex items-center gap-3 text-zinc-600">
                    <div className="w-4 h-4 rounded-full border-2 border-zinc-700 border-t-zinc-400 animate-spin" />
                    <span className="text-sm font-mono">Chargement...</span>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-16">
                <p className="text-zinc-400">Session introuvable.</p>
                <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-400 mt-4 inline-block font-mono">
                    ← Retour
                </Link>
            </div>
        );
    }

    const live = isLive(session);
    const upcoming = new Date(session.startTime) > new Date();

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Back */}
            <Link
                href={`/events/${session.event?.id}`}
                className="inline-flex items-center gap-2 text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors mb-10"
            >
                ← {session.event?.title || "Retour"}
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                {/* Left — Session info */}
                <div className="fade-up">
                    {/* Status badge */}
                    <div className="mb-5">
                        {live ? (
                            <span className="badge-live">
                <span className="live-dot" />
                En cours
              </span>
                        ) : upcoming ? (
                            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 border border-zinc-800 px-2.5 py-1 rounded-sm">
                À venir
              </span>
                        ) : (
                            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-600 border border-zinc-800 px-2.5 py-1 rounded-sm">
                Terminée
              </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-100 leading-tight mb-6">
                        {session.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 mb-8">
            <span className="text-xs font-mono text-zinc-400">
              {formatTime(session.startTime)} – {formatTime(session.endTime)}
            </span>
                        <span className="text-xs font-mono text-zinc-600">|</span>
                        <span className="text-xs font-mono text-zinc-400">{session.room.name}</span>
                        {session.capacity && (
                            <>
                                <span className="text-xs font-mono text-zinc-600">|</span>
                                <span className="text-xs font-mono text-zinc-500">{session.capacity} places</span>
                            </>
                        )}
                    </div>

                    {session.description && (
                        <p className="text-base text-zinc-400 leading-relaxed mb-10 max-w-xl border-l-2 border-zinc-800 pl-5">
                            {session.description}
                        </p>
                    )}

                    {/* Speakers */}
                    {session.speakers.length > 0 && (
                        <div>
                            <span className="label">Intervenants</span>
                            <div className="flex flex-col gap-3 mt-2">
                                {session.speakers.map((speaker) => (
                                    <Link key={speaker.id} href={`/speakers/${speaker.id}`}>
                                        <div className="flex items-center gap-4 p-3.5 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-all group">
                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400 shrink-0 overflow-hidden">
                                                {speaker.photo ? (
                                                    <img
                                                        src={speaker.photo}
                                                        alt={speaker.fullName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    speaker.fullName.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                                                    {speaker.fullName}
                                                </p>
                                                {speaker.bio && (
                                                    <p className="text-xs text-zinc-600 truncate mt-0.5">{speaker.bio}</p>
                                                )}
                                            </div>
                                            <span className="text-zinc-700 group-hover:text-zinc-500 transition-colors">→</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right — Q&A Panel */}
                <div
                    className={`
            card overflow-hidden fade-up-1 sticky top-20
            ${live ? "border-red-500/20" : ""}
          `}
                >
                    {/* Panel header */}
                    <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
                        <p className={`text-xs font-mono tracking-widest uppercase ${live ? "text-red-400" : "text-zinc-500"}`}>
                            Questions / Réponses
                        </p>
                        <span className="text-xs font-mono text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-md">
              {questions.length}
            </span>
                    </div>

                    {/* Form — only when live */}
                    {live ? (
                        <form onSubmit={submitQuestion} className="p-4 border-b border-zinc-800">
              <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Posez votre question..."
                  required
                  rows={3}
                  className="input resize-none mb-2 text-sm"
              />
                            <div className="flex gap-2">
                                <input
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                    placeholder="Votre nom (optionnel)"
                                    className="input flex-1 text-xs"
                                />
                                <button
                                    type="submit"
                                    disabled={submitting || !questionText.trim()}
                                    className="btn-primary shrink-0"
                                >
                                    {submitting ? (
                                        <span className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full border border-zinc-700 border-t-zinc-300 animate-spin" />
                    </span>
                                    ) : submitSuccess ? (
                                        "✓"
                                    ) : (
                                        "Envoyer"
                                    )}
                                </button>
                            </div>
                            {error && (
                                <p className="text-xs text-red-400 mt-2 font-mono">{error}</p>
                            )}
                        </form>
                    ) : (
                        <div className="p-4 border-b border-zinc-800">
                            <p className="text-xs font-mono text-zinc-600 text-center py-2">
                                {upcoming
                                    ? "Les questions s'ouvrent au début de la session"
                                    : "Cette session est terminée"}
                            </p>
                        </div>
                    )}

                    {/* Questions list */}
                    <div className="max-h-[460px] overflow-y-auto">
                        {questions.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-xs font-mono text-zinc-700">
                                    {live ? "Soyez le premier à poser une question" : "Aucune question"}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-800/60">
                                {questions.map((q) => (
                                    <div key={q.id} className="flex gap-3 p-4">
                                        {/* Upvote button */}
                                        <button
                                            onClick={() => upvote(q.id)}
                                            disabled={upvoted.has(q.id)}
                                            className={`
                        flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-lg border text-xs font-mono transition-all shrink-0
                        ${upvoted.has(q.id)
                                                ? "border-red-500/50 text-red-400 bg-red-500/10 cursor-default"
                                                : "border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400 cursor-pointer"
                                            }
                      `}
                                        >
                                            <span className="text-[10px]">▲</span>
                                            <span className="font-semibold">{q.upvotes}</span>
                                        </button>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-zinc-200 leading-relaxed">{q.content}</p>
                                            <p className="text-xs text-zinc-600 mt-1.5 font-mono">
                                                {q.authorName || "Anonyme"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}