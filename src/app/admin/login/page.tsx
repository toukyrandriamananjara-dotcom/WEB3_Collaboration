"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
            if (result?.error) {
                setError("Email ou mot de passe incorrect");
            } else {
                router.push("/admin/dashboard");
                router.refresh();
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6">
            <div className="w-full max-w-sm fade-up">
                {/* Header */}
                <div className="mb-10 text-center">
                    <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-red-500 mb-3">
                        Accès restreint
                    </p>
                    <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">
                        Administration
                    </h1>
                    <p className="text-sm text-zinc-500 mt-2">
                        Connectez-vous pour gérer les événements
                    </p>
                </div>

                {/* Form */}
                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="label" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@eventsync.com"
                                required
                                autoComplete="email"
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="label" htmlFor="password">Mot de passe</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                                className="input"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                                <p className="text-xs text-red-400 font-mono">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                        >
                            {loading ? (
                                <>
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-700 border-t-zinc-300 animate-spin" />
                                    Connexion...
                                </>
                            ) : (
                                "Se connecter"
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors">
                        ← Retour au site
                    </Link>
                </div>
            </div>
        </div>
    );
}