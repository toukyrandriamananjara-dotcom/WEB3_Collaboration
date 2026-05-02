import Link from "next/link";
import { notFound } from "next/navigation";
import { Speaker } from "@/types";

async function getSpeaker(id: string): Promise<Speaker | null> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/speakers/${id}`,
            { cache: "no-store" }
        );
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function isLiveNow(startTime: string, endTime: string): boolean {
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
            {/* Back */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors mb-10"
            >
                ← Retour
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 items-start">
                {/* Left — Profile card */}
                <div className="card p-8 fade-up">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-2xl bg-zinc-800 flex items-center justify-center text-3xl font-bold text-zinc-400 mb-6 overflow-hidden">
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

                    <h1 className="text-2xl font-bold text-zinc-100 mb-3">{speaker.fullName}</h1>

                    {speaker.bio && (
                        <p className="text-sm text-zinc-400 leading-relaxed mb-6">{speaker.bio}</p>
                    )}

                    {/* External links */}
                    {speaker.externalLinks && Object.keys(speaker.externalLinks).length > 0 && (
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
                                            className="flex items-center gap-3 text-sm text-zinc-400 hover:text-zinc-100 transition-colors group"
                                        >
                      <span className="w-7 h-7 flex items-center justify-center bg-zinc-800 rounded-md text-xs group-hover:bg-zinc-700 transition-colors font-mono">
                        {icon}
                      </span>
                                            <span className="truncate">{label}</span>
                                            <span className="ml-auto text-zinc-700 group-hover:text-zinc-500">↗</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right — Sessions */}
                <div className="fade-up-1">
                    <h2 className="text-3xl font-bold tracking-tight mb-6">Sessions</h2>

                    {!speaker.sessions || speaker.sessions.length === 0 ? (
                        <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center">
                            <p className="text-xs font-mono text-zinc-600">Aucune session assignée</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {speaker.sessions.map((session) => {
                                const live = isLiveNow(session.startTime, session.endTime);
                                return (
                                    <Link key={session.id} href={`/sessions/${session.id}`}>
                                        <div
                                            className={`
                        border rounded-xl p-5 transition-all group cursor-pointer
                        ${live
                                                ? "border-red-500/30 bg-red-500/5 hover:bg-red-500/10"
                                                : "border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900"
                                            }
                      `}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {live && (
                                                            <span className="badge-live">
                                <span className="live-dot" />
                                Live
                              </span>
                                                        )}
                                                        <h3 className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                                                            {session.title}
                                                        </h3>
                                                    </div>
                                                    <div className="flex flex-wrap gap-3">
                            <span className="text-xs font-mono text-zinc-500">
                              {formatTime(session.startTime)} – {formatTime(session.endTime)}
                            </span>
                                                        <span className="text-xs text-zinc-600">{session.room.name}</span>
                                                        {session.event && (
                                                            <span className="text-xs text-zinc-600">{session.event.title}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-zinc-700 group-hover:text-zinc-500 transition-colors mt-1">→</span>
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