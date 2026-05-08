import Link from "next/link";
import { Event } from "@/types";
import { notFound } from "next/navigation";

async function getEvent(id: string): Promise<Event | null> {
    try {
        const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const res = await fetch(`${base}/api/events/${id}`, { cache: "no-store" });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

function isLive(session: Event["sessions"][number]) {
    const now = new Date();
    return new Date(session.startTime) <= now && new Date(session.endTime) >= now;
}

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatDateRange(start: string, end: string) {
    const s = new Date(start);
    const e = new Date(end);
    const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
    if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
        return `${s.getDate()} – ${e.toLocaleDateString("fr-FR", {
            ...opts,
            year: "numeric",
        })}`;
    }
    return `${s.toLocaleDateString("fr-FR", opts)} – ${e.toLocaleDateString("fr-FR", { ...opts, year: "numeric" })}`;
}

export default async function EventPage({
                                            params,
                                        }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const event = await getEvent(id);

    if (!event) notFound();

    // Trier les sessions par heure de début
    const sessionsSorted = [...event.sessions].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Fil d'ariane */}
            <Link
                href="/events"
                className="inline-flex items-center gap-2 text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors mb-10"
            >
                ← Tous les événements
            </Link>

            {/* En-tête de l'événement */}
            <div className="fade-up mb-12">
                <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-red-500 mb-3">
                    {formatDateRange(event.startDate, event.endDate)} · {event.location}
                </p>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-100 leading-tight mb-4">
                    {event.title}
                </h1>
                {event.description && (
                    <p className="text-base text-zinc-400 max-w-2xl leading-relaxed border-l-2 border-zinc-800 pl-5">
                        {event.description}
                    </p>
                )}
            </div>

            {/* Sessions */}
            <div className="fade-up-1">
                <h2 className="text-2xl font-bold text-zinc-200 mb-6">
                    Sessions ({event.sessions.length})
                </h2>

                {sessionsSorted.length === 0 ? (
                    <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center">
                        <p className="text-xs font-mono text-zinc-600">
                            Aucune session trouvée pour cet événement
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {sessionsSorted.map((session) => {
                            const live = isLive(session);
                            return (
                                <Link key={session.id} href={`/sessions/${session.id}`}>
                                    <div
                                        className={`border rounded-xl p-5 transition-all group cursor-pointer ${
                                            live
                                                ? "border-red-500/30 bg-red-500/5 hover:bg-red-500/10"
                                                : "border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {live && (
                                                        <span className="badge-live">
                              <span className="live-dot" />
                              EN DIRECT
                            </span>
                                                    )}
                                                    <h3 className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                                                        {session.title}
                                                    </h3>
                                                </div>
                                                <div className="flex flex-wrap gap-3 text-xs">
                          <span className="font-mono text-zinc-500">
                            {formatTime(session.startTime)} –{" "}
                              {formatTime(session.endTime)}
                          </span>
                                                    <span className="text-zinc-600">
                            {session.room?.name}
                          </span>
                                                    <span className="text-zinc-600">
                            {session.speakers
                                ?.map((s) => s.fullName)
                                .join(", ")}
                          </span>
                                                </div>
                                            </div>
                                            <span className="text-zinc-700 group-hover:text-zinc-500 transition-colors mt-1">
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
    );
}