"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/events";
    const errorParam = searchParams.get("error");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(
        errorParam === "unauthorized" ? "Accès refusé — droits insuffisants" : ""
    );

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
                router.push(callbackUrl);
                router.refresh();
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block font-bold text-2xl tracking-tight text-zinc-100 mb-6">
                        Event<span className="text-red-500">Sync</span>
                    </Link>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 mb-2">
                        Connexion
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Accédez à votre espace EventSync
                    </p>
                </div>

                {/* Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Email */}
                        <div>
                            <label className="text-[10px] font-mono tracking-[0.15em] uppercase text-zinc-500 mb-1.5 block">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="vous@example.com"
                                required
                                autoComplete="email"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-[10px] font-mono tracking-[0.15em] uppercase text-zinc-500 mb-1.5 block">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors"
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
                            className="w-full bg-zinc-100 text-zinc-900 font-semibold text-sm py-2.5 rounded-lg hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
                        >
                            {loading ? (
                                <>
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-400 border-t-zinc-800 animate-spin" />
                                    Connexion...
                                </>
                            ) : (
                                "Se connecter"
                            )}
                        </button>
                    </form>
                </div>

                {/* Signup links */}
                <div className="mt-6 text-center space-y-2">
                    <p className="text-sm text-zinc-500">
                        Pas encore de compte ?
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link
                            href="/signup?role=user"
                            className="text-sm text-zinc-300 hover:text-white transition-colors font-medium"
                        >
                            S'inscrire comme participant
                        </Link>
                        <span className="text-zinc-700">·</span>
                        <Link
                            href="/signup?role=speaker"
                            className="text-sm text-zinc-300 hover:text-white transition-colors font-medium"
                        >
                            comme intervenant
                        </Link>
                    </div>
                </div>
            </div>

            {/* 🔹 BOUTON ADMIN FLOTTANT (en bas à droite) */}
            <Link
                href="/admin/login"
                className="fixed bottom-5 right-5 z-50 bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700/90 border border-zinc-700 rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 group shadow-lg"
                title="Accès admin"
            >
                <span className="text-lg font-mono font-bold text-zinc-400 group-hover:text-white transition-colors">
                    ⚙️
                </span>
            </Link>
        </div>
    );
}