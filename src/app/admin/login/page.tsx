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
            const result = await signIn("credentials", { email, password, redirect: false });
            if (result?.error) setError("Email ou mot de passe incorrect");
            else {
                router.push("/admin/ra");
                router.refresh();
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6">
            <div className="w-full max-w-sm fade-up">
                <div className="mb-10 text-center">
                    <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-destructive mb-3">ACCÈS RESTREINT</p>
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Administration</h1>
                    <p className="text-sm text-muted-foreground mt-2">Connectez-vous pour gérer la plateforme.</p>
                </div>

                <div className="glass-card p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="label" htmlFor="email">Email</label>
                            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@myvent.com" required autoComplete="email" className="input" />
                        </div>
                        <div>
                            <label className="label" htmlFor="password">Mot de passe</label>
                            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••" required autoComplete="current-password" className="input" />
                        </div>
                        {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3"><p className="text-xs text-destructive font-mono">{error}</p></div>}
                        <button type="submit" disabled={loading || !email || !password} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                            {loading ? <><div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Connexion...</> : "Accéder au dashboard"}
                        </button>
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors">← Retour au site</Link>
                </div>
            </div>
        </div>
    );
}