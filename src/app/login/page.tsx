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
    const [error, setError] = useState(errorParam === "unauthorized" ? "Accès refusé — droits insuffisants" : "");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const result = await signIn("credentials", { email, password, redirect: false });
            if (result?.error) setError("Email ou mot de passe incorrect");
            else { router.push(callbackUrl); router.refresh(); }
        } finally { setLoading(false); }
    }

    return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left fade-up">
                    <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary mb-3">LIVE · Q&A · PLANNING</p>
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">L&apos;événementiel mérite une expérience à la hauteur.</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">Suivez les sessions, posez vos questions et vibrez en temps réel avec les autres participants.</p>
                    <p className="mt-6 text-xs font-mono text-foreground/40">© 2026 MyVent</p>
                </div>

                <div className="fade-up-1">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">Bon retour</h1>
                        <p className="text-sm text-muted-foreground">Connectez-vous pour retrouver vos événements.</p>
                    </div>

                    <div className="glass-card p-8">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="label">Adresse e-mail</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.com" required autoComplete="email" className="input" />
                            </div>
                            <div>
                                <label className="label">Mot de passe</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" className="input" />
                            </div>
                            {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3"><p className="text-xs text-destructive font-mono">{error}</p></div>}
                            <button type="submit" disabled={loading || !email || !password} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                                {loading ? <><div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Connexion...</> : "Se connecter"}
                            </button>
                        </form>
                    </div>

                    <div className="mt-6 space-y-3">
                        <p className="text-center text-sm text-muted-foreground"><a href="#" className="text-primary hover:underline">Mot de passe oublié ?</a></p>
                        <p className="text-center text-sm text-muted-foreground">Pas encore de compte ? <Link href="/signup" className="text-primary font-medium hover:underline">Créer un compte</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}