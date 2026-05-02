import Link from "next/link";
import { Event } from "@/types";

async function getEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/events`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function isEventLive(sessions: Event["sessions"]): boolean {
  const now = new Date();
  return sessions.some(
      (s) => new Date(s.startTime) <= now && new Date(s.endTime) >= now
  );
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${s.getDate()} – ${e.toLocaleDateString("fr-FR", { ...opts, year: "numeric" })}`;
  }
  return `${s.toLocaleDateString("fr-FR", opts)} – ${e.toLocaleDateString("fr-FR", { ...opts, year: "numeric" })}`;
}

export default async function HomePage() {
  const events = await getEvents();

  return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-16 fade-up">
          <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-red-500 mb-4">
            Plateforme événementielle
          </p>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-zinc-100 mb-5 leading-none">
            Événements
          </h1>
          <p className="text-base text-zinc-400 max-w-md leading-relaxed">
            Suivez les sessions en direct, posez vos questions et naviguez dans le planning en temps réel.
          </p>
        </div>

        {/* Events */}
        {events.length === 0 ? (
            <div className="border border-dashed border-zinc-800 rounded-xl p-20 text-center fade-up-1">
              <p className="text-xs font-mono text-zinc-600">Aucun événement disponible pour le moment</p>
            </div>
        ) : (
            <div className="fade-up-1">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_180px_160px_80px] gap-6 px-5 pb-3 border-b border-zinc-800">
                {["Événement", "Lieu", "Dates", "Sessions"].map((h) => (
                    <span key={h} className="text-[10px] font-mono tracking-[0.15em] uppercase text-zinc-600">
                {h}
              </span>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-zinc-800/60">
                {events.map((event) => {
                  const live = isEventLive(event.sessions);
                  return (
                      <Link key={event.id} href={`/events/${event.id}`}>
                        <div className="grid grid-cols-[1fr_180px_160px_80px] gap-6 px-5 py-5 hover:bg-zinc-900/50 transition-colors group cursor-pointer">
                          {/* Title */}
                          <div className="flex items-center gap-3 min-w-0">
                            {live && (
                                <span className="badge-live shrink-0">
                          <span className="live-dot" />
                          Live
                        </span>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-zinc-100 group-hover:text-white transition-colors truncate">
                                {event.title}
                              </p>
                              {event.description && (
                                  <p className="text-xs text-zinc-500 mt-0.5 truncate">{event.description}</p>
                              )}
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-center">
                            <span className="text-sm text-zinc-400 truncate">{event.location}</span>
                          </div>

                          {/* Dates */}
                          <div className="flex items-center">
                      <span className="text-xs font-mono text-zinc-500">
                        {formatDateRange(event.startDate, event.endDate)}
                      </span>
                          </div>

                          {/* Sessions count */}
                          <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-zinc-100">
                        {event.sessions.length}
                      </span>
                          </div>
                        </div>
                      </Link>
                  );
                })}
              </div>
            </div>
        )}
      </div>
  );
}