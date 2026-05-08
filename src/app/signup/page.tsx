"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Role = "user" | "speaker";

export default function SignupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [role, setRole] = useState<Role>((searchParams.get("role") as Role) || "user");
    const [form, setForm] = useState({ email: "", password: "", name: "", fullName: "", bio: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function update(field: string, value: string) { setForm(prev => ({ ...prev, [field]: value })); }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        if (form.password.length < 6) { setError("Le mot de passe doit contenir au moins 6 caractères"); return; }

        setLoading(true);
        try {
            const endpoint = role === "user" ? "/api/auth/signup/user" : "/api/auth/signup/speaker";
            const body = role === "user"
                ? { email: form.email, password: form.password, name: form.name }
                : { email: form.email, password: form.password, fullName: form.fullName, bio: form.bio };

            const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const data = await res.json();
            if (!res.ok) { setError(data.error || "Une erreur s'est produite"); return; }

            const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
            if (result?.error) router.push("/login");
            else { router.push("/events"); router.refresh(); }
        } finally { setLoading(false); }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left fade-up">
                    <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary mb-3">LIVE · Q&A · PLANNING</p>
                    <h2 className="text-4xl md:text-4xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">L&apos;événementiel mérite une expérience à la hauteur.</h2>
                    <p className="text-base text-muted-foreground leading-relaxed">Suivez les sessions, posez vos questions et vibrez en temps réel avec les autres participants.</p>
                    <p className="mt-6 text-xs font-mono text-foreground/40">© 2026 MyVent</p>
                </div>

                <div className="fade-up-1">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Créer votre compte</h1>
                        <p className="text-sm text-muted-foreground">Rejoignez MyVent et profitez des événements en direct.</p>
                    </div>

                    <div className="flex bg-secondary border border-border rounded-xl p-1 mb-6">
                        {(["user", "speaker"] as Role[]).map(r => (
                            <button key={r} type="button" onClick={() => setRole(r)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === r ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}>
                                {r === "user" ? "Participant" : "Intervenant"}
                            </button>
                        ))}
                    </div>

                    <div className="glass-card p-8">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {role === "user" && (
                                <div>
                                    <label className="label">Prénom</label>
                                    <input type="text" value={form.name} onChange={e => update("name", e.target.value)} placeholder="Camille" required className="input" />
                                </div>
                            )}
                            {role === "speaker" && (
                                <>
                                    <div>
                                        <label className="label">Nom complet *</label>
                                        <input type="text" value={form.fullName} onChange={e => update("fullName", e.target.value)} placeholder="Camille Dupont" required className="input" />
                                    </div>
                                    <div>
                                        <label className="label">Bio courte</label>
                                        <textarea value={form.bio} onChange={e => update("bio", e.target.value)} placeholder="Designer chez..." rows={3} className="input resize-none" />
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="label">Adresse e-mail</label>
                                <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="vous@exemple.com" required autoComplete="email" className="input" />
                            </div>
                            <div>
                                <label className="label">Mot de passe</label>
                                <input type="password" value={form.password} onChange={e => update("password", e.target.value)} placeholder="Au moins 6 caractères" required autoComplete="new-password" className="input" />
                            </div>
                            {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3"><p className="text-xs text-destructive font-mono">{error}</p></div>}
                            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                                {loading ? <><div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Création...</> : "Créer mon compte"}
                            </button>
                        </form>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">Déjà inscrit ? <Link href="/login" className="text-primary font-medium hover:underline">Se connecter</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}