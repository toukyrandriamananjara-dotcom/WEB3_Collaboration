import Link from "next/link";
import { notFound } from "next/navigation";
import { Event, Session } from "@/types";

async function getEvent(id: string): Promise<Event | null> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/events/${id}`,
            { cache: "no-store" }
        );
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

function isLive(session: Session): boolean {
    const now = new Date();
    return new Date(session.startTime) <= now && new Date(session.endTime) >= now;
}

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default async function EventPage({
                                            params,
                                        }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const event = await getEvent(id);
    if (!event) notFound();

    const liveSessions = event.sessions.filter(isLive);
    const rooms = [
        ...new Map(event.sessions.map((s) => [s.room.id, s.room])).values(),
    ];

    // Group sessions by room for multi-track view
    const sessionsByRoom = rooms.map((room) => ({
        room,
        sessions: event.sessions
            .filter((s) => s.room.id === room.id)
            .sort(
                (a, b) =>
                    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            ),
    }));

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Back */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors mb-10"
            >
                ← Tous les événements
            </Link>

            {/* Header */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 mb-16 pb-12 border-b border-zinc-800 fade-up">
                <div>
                    {liveSessions.length > 0 && (
                        <div className="mb-4">
              <span className="badge-live">
                <span className="live-dot" />
                  {liveSessions.length} session{liveSessions.length > 1 ? "s" : ""} en cours
              </span>
                        </div>
                    )}
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-100 leading-none mb-5">
                        {event.title}
                    </h1>
                    {event.description && (
                        <p className="text-base text-zinc-400 max-w-lg leading-relaxed">
                            {event.description}
                        </p>
                    )}
                </div>

                {/* Info card */}
                <div className="card p-6 h-fit">
                    {[
                        { label: "Lieu", value: event.location },
                        { label: "Début", value: formatDate(event.startDate) },
                        { label: "Fin", value: formatDate(event.endDate) },
                        { label: "Sessions", value: String(event.sessions.length) },
                        { label: "Salles", value: String(rooms.length) },
                    ].map(({ label, value }) => (
                        <div key={label} className="mb-4 last:mb-0">
                            <span className="label">{label}</span>
                            <p className="text-sm font-medium text-zinc-200">{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sessions */}
            {event.sessions.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xs font-mono text-zinc-600">Aucune session programmée</p>
                </div>
            ) : (
                <div className="fade-up-1">
                    <h2 className="text-3xl font-bold tracking-tight mb-8">Planning</h2>

                    {/* Room tabs info */}
                    {rooms.length > 1 && (
                        <div className="flex gap-2 mb-8 flex-wrap">
                            {rooms.map((room) => (
                                <span
                                    key={room.id}
                                    className="text-xs font-mono text-zinc-400 border border-zinc-800 px-3 py-1.5 rounded-md"
                                >
                  {room.name}
                </span>
                            ))}
                        </div>
                    )}

                    {/* Multi-track grid if multiple rooms */}
                    {rooms.length > 1 ? (
                        <div
                            className="grid gap-4"
                            style={{
                                gridTemplateColumns: `repeat(${Math.min(rooms.length, 3)}, 1fr)`,
                            }}
                        >
                            {sessionsByRoom.map(({ room, sessions }) => (
                                <div key={room.id}>
                                    <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-zinc-500 mb-3 px-1">
                                        {room.name}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {sessions.map((session) => (
                                            <SessionCard key={session.id} session={session} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Single track list */
                        <div className="flex flex-col gap-2">
                            {event.sessions
                                .sort(
                                    (a, b) =>
                                        new Date(a.startTime).getTime() -
                                        new Date(b.startTime).getTime()
                                )
                                .map((session) => (
                                    <SessionCard key={session.id} session={session} wide />
                                ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function SessionCard({ session, wide = false }: { session: Session; wide?: boolean }) {
    const live = isLive(session);

    return (
        <Link href={`/sessions/${session.id}`}>
            <div
                className={`
          border rounded-xl p-4 transition-all cursor-pointer group
          ${live
                    ? "border-red-500/30 bg-red-500/5 hover:bg-red-500/10"
                    : "border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900"
                }
          ${wide ? "flex items-center gap-6" : ""}
        `}
            >
                {/* Time */}
                <div className={wide ? "w-24 shrink-0" : "mb-3"}>
                    <p className={`text-sm font-mono font-medium ${live ? "text-red-400" : "text-zinc-400"}`}>
                        {formatTime(session.startTime)}
                    </p>
                    <p className="text-xs font-mono text-zinc-600">
                        {formatTime(session.endTime)}
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        {live && (
                            <span className="badge-live">
                <span className="live-dot" />
                Live
              </span>
                        )}
                        <h3 className="font-semibold text-sm text-zinc-100 group-hover:text-white transition-colors truncate">
                            {session.title}
                        </h3>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-zinc-600">{session.room.name}</span>
                        {session.speakers.length > 0 && (
                            <span className="text-xs text-zinc-500">
                {session.speakers.map((s) => s.fullName).join(", ")}
              </span>
                        )}
                        {session.capacity && (
                            <span className="text-xs text-zinc-700 font-mono">
                {session.capacity} places
              </span>
                        )}
                    </div>
                </div>

                <span className="text-zinc-700 group-hover:text-zinc-500 transition-colors ml-2">→</span>
            </div>
        </Link>
    );
}