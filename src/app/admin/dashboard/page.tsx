import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Event } from "@/types";
import AdminLogout from "./_components/AdminLogout";

async function getData() {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    try {
        const [eventsRes] = await Promise.all([fetch(`${base}/api/events`, { cache: "no-store" })]);
        const events: Event[] = eventsRes.ok ? await eventsRes.json() : [];
        const totalQuestions = await prisma.question.count();
        return { events, totalQuestions };
    } catch { return { events: [], totalQuestions: 0 }; }
}

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/admin/login");

    const { events, totalQuestions } = await getData();
    const totalSessions = events.reduce((acc, e) => acc + e.sessions.length, 0);

    const stats = [
        { label: "Événements", value: events.length, href: "/admin/dashboard/events" },
        { label: "Sessions", value: totalSessions, href: "/admin/dashboard/events" },
        { label: "Questions", value: totalQuestions, href: "/admin/dashboard/events" },
    ];

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex items-start justify-between mb-12 fade-up">
                <div>
                    <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary mb-2">Administration</p>
                    <h1 className="text-5xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
                </div>
                <AdminLogout />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 fade-up-1">
                {stats.map(({ label, value, href }) => (
                    <Link key={label} href={href}>
                        <div className="glass-card p-6 hover:shadow-md transition-colors group">
                            <p className="text-4xl font-extrabold text-foreground mb-1 group-hover:text-primary transition-colors">{value}</p>
                            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="fade-up-2">
                <h2 className="text-xl font-bold text-foreground mb-5">Gestion</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { title: "Événements", desc: "Créer, modifier et supprimer des événements et leurs sessions", href: "/admin/dashboard/events", icon: "📅" },
                        { title: "Intervenants", desc: "Gérer les profils des speakers et leurs biographies", href: "/admin/dashboard/speakers", icon: "🎤" },
                        { title: "Salles", desc: "Configurer les salles disponibles pour les sessions", href: "/admin/dashboard/rooms", icon: "🏛️" },
                    ].map(({ title, desc, href, icon }) => (
                        <Link key={title} href={href}>
                            <div className="glass-card p-6 hover:shadow-md transition-all group h-full">
                                <span className="text-2xl mb-4 block">{icon}</span>
                                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {events.length > 0 && (
                <div className="mt-12 fade-up-3">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-foreground">Événements récents</h2>
                        <Link href="/admin/dashboard/events" className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors">Voir tout →</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        {events.slice(0, 3).map(event => (
                            <Link key={event.id} href={`/admin/dashboard/events/${event.id}`}>
                                <div className="flex items-center justify-between px-5 py-4 border border-border rounded-xl hover:bg-primary-soft/20 transition-colors group">
                                    <div>
                                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">{event.title}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{event.sessions.length} session{event.sessions.length !== 1 ? "s" : ""} · {event.location}</p>
                                    </div>
                                    <span className="text-foreground/30 group-hover:text-primary transition-colors">→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}