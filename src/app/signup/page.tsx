"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Role = "user" | "speaker";

export default function SignupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [role, setRole] = useState<Role>(
        (searchParams.get("role") as Role) || "user"
    );

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        fullName: "",
        bio: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function update(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (form.password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }
        // pas de confirmation de mot de passe

        setLoading(true);
        try {
            const endpoint =
                role === "user"
                    ? "/api/auth/signup/user"
                    : "/api/auth/signup/speaker";

            const body =
                role === "user"
                    ? { email: form.email, password: form.password, name: form.name }
                    : {
                        email: form.email,
                        password: form.password,
                        fullName: form.fullName,
                        bio: form.bio,
                    };

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Une erreur s'est produite");
                return;
            }

            // Auto-login after signup
            const result = await signIn("credentials", {
                email: form.email,
                password: form.password,
                redirect: false,
            });

            if (result?.error) {
                router.push("/login");
            } else {
                router.push("/");
                router.refresh();
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Branding gauche (identique login) */}
                <div className="text-center md:text-left fade-up">
                    <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-red-500 mb-3">
                        LIVE · Q&A · PLANNING
                    </p>
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-100 mb-6 leading-tight">
                        L&apos;événementiel mérite une expérience à la hauteur.
                    </h2>
                    <p className="text-base text-zinc-400 leading-relaxed">
                        Suivez les sessions, posez vos questions et vibrez en temps réel avec les autres participants.
                    </p>
                    <p className="mt-6 text-xs font-mono text-zinc-600">
                        © 2026 MyVent
                    </p>
                </div>

                {/* Formulaire droite */}
                <div className="fade-up-1">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 mb-2">
                            Créer votre compte
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Rejoignez MyVent et profitez des événements en direct.
                        </p>
                    </div>

                    {/* Role switcher */}
                    <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-6">
                        {(["user", "speaker"] as Role[]).map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                                    role === r
                                        ? "bg-zinc-100 text-zinc-900"
                                        : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                {r === "user" ? "Participant" : "Intervenant"}
                            </button>
                        ))}
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* User fields */}
                            {role === "user" && (
                                <div>
                                    <label className="text-[10px] font-mono tracking-[0.15em] uppercase text-zinc-500 mb-1.5 block">
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => update("name", e.target.value)}
                                        placeholder="Camille"
                                        required
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                                    />
                                </div>
                            )}

                            {/* Speaker fields */}
                            {role === "speaker" && (
                                <>
                                    <div>
                                        <label className="text-[10px] font-mono tracking-[0.15em] uppercase text-zinc-500 mb-1.5 block">
                                            Nom complet *
                                        </label>
                                        <input
                                            type="text"
                                            value={form.fullName}
                                            onChange={(e) => update("fullName", e.target.value)}
                                            placeholder="Camille Dupont"
                                            required
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono tracking-[0.15em] uppercase text-zinc-500 mb-1.5 block">
                                            Bio courte
                                        </label>
                                        <textarea
                                            value={form.bio}
                                            onChange={(e) => update("bio", e.target.value)}
                                            placeholder="Designer chez..."
                                            rows={3}
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors resize-none"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Commun */}
                            <div>
                                <label className="text-[10px] font-mono tracking-[0.15em] uppercase text-zinc-500 mb-1.5 block">
                                    Adresse e-mail
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => update("email", e.target.value)}
                                    placeholder="vous@exemple.com"
                                    required
                                    autoComplete="email"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-mono tracking-[0.15em] uppercase text-zinc-500 mb-1.5 block">
                                    Mot de passe
                                </label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => update("password", e.target.value)}
                                    placeholder="Au moins 6 caractères"
                                    required
                                    autoComplete="new-password"
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
                                disabled={loading}
                                className="w-full bg-zinc-100 text-zinc-900 font-semibold text-sm py-2.5 rounded-lg hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-400 border-t-zinc-800 animate-spin" />
                                        Création...
                                    </>
                                ) : (
                                    "Créer mon compte"
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-zinc-500">
                            Déjà inscrit ?{" "}
                            <Link
                                href="/login"
                                className="text-zinc-300 hover:text-white transition-colors font-medium"
                            >
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}