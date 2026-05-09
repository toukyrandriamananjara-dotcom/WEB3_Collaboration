import Link from "next/link";
import { notFound } from "next/navigation";
import { Speaker } from "@/types";
import FavoriteButton from "@/components/FavoriteButton";
import RoomLink from "@/components/RoomLink"; // <-- importer

async function getSpeaker(id: string): Promise<Speaker | null> {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/speakers/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
}

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function isLive(startTime: string, endTime: string) {
    const now = new Date();
    return new Date(startTime) <= now && new Date(endTime) >= now;
}

export default async function SpeakerPage({
                                              params,
                                          }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const speaker = await getSpeaker(id);
    if (!speaker) notFound();

    const links = [
        { key: "website", label: "Site web", icon: "🌐" },
        { key: "twitter", label: "Twitter", icon: "𝕏" },
        { key: "linkedin", label: "LinkedIn", icon: "in" },
        { key: "github", label: "GitHub", icon: "</>" },
    ] as const;

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <Link
                href="/events"
                className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-10"
            >
                ← Événements
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 items-start">
                {/* Carte profil */}
                <div className="glass-card p-8 fade-up">
                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-3xl font-bold text-white mb-6 overflow-hidden">
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

                    <h1 className="text-2xl font-bold text-foreground mb-3">
                        {speaker.fullName}
                    </h1>

                    {speaker.bio && (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                            {speaker.bio}
                        </p>
                    )}

                    {speaker.externalLinks &&
                        Object.keys(speaker.externalLinks).length > 0 && (
                            <div>
                                <span className="label">Liens</span>
                                <div className="flex flex-col gap-2 mt-2">
                                    {links.map(({ key, label, icon }) => {
                                        const url = speaker.externalLinks?.[key];
                                        if (!url) return null;
                                        return (
                                            <a
                                                key={key}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                                            >
                        <span className="w-7 h-7 flex items-center justify-center bg-primary/10 rounded-md text-xs group-hover:bg-primary/20 transition-colors font-mono">
                          {icon}
                        </span>
                                                <span className="truncate">{label}</span>
                                                <span className="ml-auto text-foreground/30 group-hover:text-primary">
                          ↗
                        </span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                </div>

                {/* Sessions */}
                <div className="fade-up-1">
                    <h2 className="text-3xl font-bold tracking-tight mb-6">Sessions</h2>

                    {!speaker.sessions || speaker.sessions.length === 0 ? (
                        <div className="border border-dashed border-border rounded-xl p-12 text-center">
                            <p className="text-xs font-mono text-muted-foreground">
                                Aucune session assignée
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {speaker.sessions
                                .sort(
                                    (a, b) =>
                                        new Date(a.startTime).getTime() -
                                        new Date(b.startTime).getTime()
                                )
                                .map((session) => {
                                    const live = isLive(session.startTime, session.endTime);
                                    // @ts-ignore _count peut ne pas être typé
                                    const questionCount = session._count?.questions ?? 0;
                                    return (
                                        <Link
                                            key={session.id}
                                            href={`/sessions/${session.id}`}
                                            className="block"
                                        >
                                            <div
                                                className={`glass-card p-5 transition-all group cursor-pointer flex items-center justify-between gap-4 ${
                                                    live
                                                        ? "border-destructive/30 bg-destructive/5"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {live && (
                                                            <span className="badge-live">
                                <span className="live-dot" />
                                EN DIRECT
                              </span>
                                                        )}
                                                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                            {session.title}
                                                        </h3>
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                            <span className="font-mono text-muted-foreground">
                              {formatTime(session.startTime)} –{" "}
                                {formatTime(session.endTime)}
                            </span>
                                                        {session.room && (
                                                            <RoomLink
                                                                roomId={session.room.id}
                                                                roomName={session.room.name}
                                                            />
                                                        )}
                                                        {session.event && (
                                                            <span className="text-foreground/60">
                                {session.event.title}
                              </span>
                                                        )}
                                                        <span className="text-foreground/40">
                              {questionCount} question{questionCount !== 1 && "s"}
                            </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <FavoriteButton sessionId={session.id} />
                                                    <span className="text-foreground/30 group-hover:text-primary transition-colors">
                            →
                          </span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}