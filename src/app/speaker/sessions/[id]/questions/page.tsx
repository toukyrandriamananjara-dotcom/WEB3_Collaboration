"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Question } from "@/types";

type QuestionWithAnswer = Question & {
    answer: { id: string; content: string; createdAt: string } | null;
};

export default function SessionQuestionsPage() {
    const { id } = useParams<{ id: string }>();
    const [questions, setQuestions] = useState<QuestionWithAnswer[]>([]);
    const [answerText, setAnswerText] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadQuestions() {
            setLoading(true);
            try {
                const res = await fetch(`/api/speaker/sessions/${id}/questions`);
                if (res.ok) {
                    const data = await res.json();
                    if (!cancelled) setQuestions(data);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadQuestions();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleAnswer = async (questionId: string) => {
        const text = answerText[questionId]?.trim();
        if (!text) return;
        setSubmitting(true);
        try {
            await fetch(`/api/questions/${questionId}/answer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: text }),
            });
            // Rafraîchir les questions
            const res = await fetch(`/api/speaker/sessions/${id}/questions`);
            if (res.ok) {
                const data = await res.json();
                setQuestions(data);
            }
        } finally {
            setSubmitting(false);
            setAnswerText((prev) => ({ ...prev, [questionId]: "" }));
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center gap-3 text-muted-foreground">
                <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                Chargement...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-foreground mb-6">
                Questions de la session
            </h1>
            {questions.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl p-12 text-center">
                    <p className="text-muted-foreground">Aucune question pour cette session.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {questions.map((q) => (
                        <div key={q.id} className="glass-card p-4">
                            <p className="font-medium text-foreground">{q.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Par {q.authorName || "Anonyme"} — {q.upvotes} upvotes
                            </p>
                            {q.answer ? (
                                <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                                    <p className="text-sm text-primary font-medium">Votre réponse :</p>
                                    <p className="text-sm text-foreground mt-1">{q.answer.content}</p>
                                </div>
                            ) : (
                                <div className="mt-3 flex gap-2">
                                    <input
                                        value={answerText[q.id] || ""}
                                        onChange={(e) =>
                                            setAnswerText((prev) => ({ ...prev, [q.id]: e.target.value }))
                                        }
                                        placeholder="Votre réponse..."
                                        className="input flex-1 text-sm"
                                    />
                                    <button
                                        onClick={() => handleAnswer(q.id)}
                                        disabled={submitting || !answerText[q.id]?.trim()}
                                        className="btn-primary text-xs"
                                    >
                                        {submitting ? "..." : "Répondre"}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}