import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Providers from "@/components/Providers";
import NavUser from "@/components/NavUser";

export const metadata: Metadata = {
    title: "EventSync",
    description: "Plateforme de gestion d'événements en temps réel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
        <body className="min-h-screen bg-zinc-950">
        <Providers>
            <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link href="/" className="font-bold text-xl tracking-tight text-zinc-100 hover:text-white transition-colors">
                        Event<span className="text-red-500">Sync</span>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-medium">
                            Événements
                        </Link>
                        {/* NavUser affiche : nom + rôle + logout si connecté, sinon lien Login */}
                        <NavUser />
                    </nav>
                </div>
            </header>

            <main>{children}</main>

            <footer className="border-t border-zinc-800/40 mt-32 py-8">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-700">EventSync © 2026</span>
                    <span className="text-xs font-mono text-zinc-700">Plateforme événementielle</span>
                </div>
            </footer>
        </Providers>
        </body>
        </html>
    );
}