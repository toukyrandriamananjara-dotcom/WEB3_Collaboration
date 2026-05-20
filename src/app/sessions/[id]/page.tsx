"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { Session, Question } from "@/types";
import { useFavorites} from "../../../../hooks/useFavorite";

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
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { isFavorite, toggleFavorite } = useFavorites();
    const fav = isFavorite(id);

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
            const res = await fetch(`/api/sessions/${id}/questions`);
            if (res.ok) setQuestions(await res.json());
        } catch {}
    }, [id]);

    useEffect(() => {
        async function fetchSession() {
            try {
                const res = await fetch(`/api/sessions/${id}`);
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
    }, [id, fetchQuestions]);

    async function submitQuestion(e: React.FormEvent) {
        e.preventDefault();
        if (!questionText.trim()) return;
        setSubmitting(true);
        setError("");
        try {
            const res = await fetch(`/api/sessions/${id}/questions`, {
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

    if (loading)
        return (
            <div className="max-w-6xl mx-auto px-6 py-16 flex items-center gap-3 text-muted-foreground">
                <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span className="text-sm font-mono">Chargement...</span>
            </div>
        );

    if (!session)
        return (
            <div className="max-w-6xl mx-auto px-6 py-16">
                <p className="text-foreground">Session introuvable.</p>
                <Link
                    href="/"
                    className="text-sm text-primary mt-4 inline-block font-mono"
                >
                    ← Retour
                </Link>
            </div>
        );

    const live = isLive(session);
    const upcoming = new Date(session.startTime) > new Date();

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <Link
                href={`/events/${session.event?.id}`}
                className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-10"
            >
                ← {session.event?.title || "Retour"}
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                {/* Colonne gauche */}
                <div className="fade-up">
                    <div className="mb-5">
                        {live ? (
                            <span className="badge-live">
                <span className="live-dot" />
                En cours
              </span>
                        ) : upcoming ? (
                            <span className="text-[10px] font-mono tracking-widest uppercase text-primary border border-primary/30 bg-primary-soft/50 px-2.5 py-1 rounded-sm">
                À venir
              </span>
                        ) : (
                            <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground border border-border px-2.5 py-1 rounded-sm">
                Terminée
              </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                            {session.title}
                        </h1>
                        <button
                            onClick={() => toggleFavorite(id)}
                            className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full border transition-all ${
                                fav
                                    ? "bg-primary text-white border-primary"
                                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                            }`}
                        >
                            {fav ? "★ Retiré des favoris" : "☆ Ajouter aux favoris"}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-8">
            <span className="text-xs font-mono text-muted-foreground">
              {formatTime(session.startTime)} – {formatTime(session.endTime)}
            </span>
                        <span className="text-xs font-mono text-border">|</span>
                        <span className="text-xs font-mono text-muted-foreground">
              {session.room.name}
            </span>
                        {session.capacity && (
                            <>
                                <span className="text-xs font-mono text-border">|</span>
                                <span className="text-xs font-mono text-muted-foreground">
                  {session.capacity} places
                </span>
                            </>
                        )}
                    </div>

                    {session.description && (
                        <p className="text-base text-muted-foreground leading-relaxed mb-10 max-w-xl border-l-2 border-primary pl-5">
                            {session.description}
                        </p>
                    )}

                    {session.speakers.length > 0 && (
                        <div>
                            <span className="label">Intervenants</span>
                            <div className="flex flex-col gap-3 mt-2">
                                {session.speakers.map((speaker) => (
                                    <Link key={speaker.id} href={`/speakers/${speaker.id}`}>
                                        <div className="flex items-center gap-4 p-3.5 border border-border rounded-xl hover:border-primary transition-all group bg-white/50">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-sm font-bold text-white shrink-0 overflow-hidden">
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
                                                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                                    {speaker.fullName}
                                                </p>
                                                {speaker.bio && (
                                                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                        {speaker.bio}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-foreground/30 group-hover:text-primary transition-colors">
                        →
                      </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Colonne droite Q&R */}
                <div
                    className={`glass-card overflow-hidden fade-up-1 sticky top-20 ${
                        live ? "ring-1 ring-destructive/20" : ""
                    }`}
                >
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                        <p
                            className={`text-xs font-mono tracking-widest uppercase ${
                                live ? "text-destructive" : "text-muted-foreground"
                            }`}
                        >
                            Questions / Réponses
                        </p>
                        <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
              {questions.length}
            </span>
                    </div>

                    {live ? (
                        <form onSubmit={submitQuestion} className="p-4 border-b border-border">
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
                      <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    </span>
                                    ) : submitSuccess ? (
                                        "✓"
                                    ) : (
                                        "Envoyer"
                                    )}
                                </button>
                            </div>
                            {error && (
                                <p className="text-xs text-destructive mt-2 font-mono">{error}</p>
                            )}
                        </form>
                    ) : (
                        <div className="p-4 border-b border-border">
                            <p className="text-xs font-mono text-muted-foreground text-center py-2">
                                {upcoming
                                    ? "Les questions s'ouvrent au début de la session"
                                    : "Cette session est terminée"}
                            </p>
                        </div>
                    )}

                    <div className="max-h-[460px] overflow-y-auto">
                        {questions.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-xs font-mono text-muted-foreground">
                                    {live
                                        ? "Soyez le premier à poser une question"
                                        : "Aucune question"}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {questions.map((q) => (
                                    <div key={q.id} className="flex gap-3 p-4">
                                        <button
                                            onClick={() => upvote(q.id)}
                                            disabled={upvoted.has(q.id)}
                                            className={`flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-lg border text-xs font-mono transition-all shrink-0 ${
                                                upvoted.has(q.id)
                                                    ? "border-primary/50 text-primary bg-primary/10 cursor-default"
                                                    : "border-border text-muted-foreground hover:border-primary hover:text-primary cursor-pointer"
                                            }`}
                                        >
                                            <span className="text-[10px]">▲</span>
                                            <span className="font-semibold">{q.upvotes}</span>
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-foreground leading-relaxed">
                                                {q.content}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1.5 font-mono">
                                                {q.authorName || "Anonyme"}
                                            </p>

                                            {/* Affichage de la réponse */}
                                            {q.answer && (
                                                <div className="mt-2 p-2 bg-primary/5 border border-primary/20 rounded-lg">
                                                    <p className="text-xs text-primary font-medium">
                                                        Réponse de{" "}
                                                        {q.answer.speaker?.fullName || "l'intervenant"} :
                                                    </p>
                                                    <p className="text-sm text-foreground mt-1">
                                                        {q.answer.content}
                                                    </p>
                                                </div>
                                            )}
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