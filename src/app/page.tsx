import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Event } from "@/types";

async function getEvents(): Promise<Event[]> {
  try {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/events`,
        { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth())
    return `${s.getDate()} – ${e.toLocaleDateString("fr-FR", {
      ...opts,
      year: "numeric",
    })}`;
  return `${s.toLocaleDateString("fr-FR", opts)} – ${e.toLocaleDateString("fr-FR", { ...opts, year: "numeric" })}`;
}

function isLive(sessions: Event["sessions"]) {
  const now = new Date();
  return sessions.some(
      (s) => new Date(s.startTime) <= now && new Date(s.endTime) >= now
  );
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const events = await getEvents();
  const liveCount = events.filter((e) => isLive(e.sessions)).length;

  // Si l'utilisateur est connecté, affichage simplifié
  if (session) {
    return (
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="fade-up">
            <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary mb-4">
              {liveCount > 0
                  ? `${liveCount} session${liveCount > 1 ? "s" : ""} en direct aujourd'hui`
                  : "LIVE · Q&A · PLANNING"}
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-5 leading-tight">
              Bienvenue, {session.user?.name || "Utilisateur"}.
            </h1>
            <p className="text-base text-muted-foreground max-w-md leading-relaxed mb-8">
              Retrouvez tous vos événements et sessions favorites.
            </p>
            <Link
                href="/events"
                className="btn-primary inline-flex items-center px-6 py-3 text-sm"
            >
              Voir les événements
            </Link>
          </div>

          {events.length > 0 && (
              <div className="fade-up-1 mt-16">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Prochains événements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((event) => {
                    const live = isLive(event.sessions);
                    return (
                        <Link key={event.id} href={`/events/${event.id}`}>
                          <div
                              className={`glass-card p-5 hover:shadow-md transition-all group h-full cursor-pointer ${
                                  live ? "border-destructive/30" : ""
                              }`}
                          >
                            {live && (
                                <span className="badge-live mb-3">
                          <span className="live-dot" />
                          EN DIRECT
                        </span>
                            )}
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                              {event.title}
                            </h3>
                            {event.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                  {event.description}
                                </p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{event.location}</span>
                              <span>·</span>
                              <span>
                          {formatDateRange(event.startDate, event.endDate)}
                        </span>
                            </div>
                            <p className="text-xs font-mono text-primary mt-2">
                              {event.sessions.length} session
                              {event.sessions.length !== 1 ? "s" : ""}
                            </p>
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

  // Visiteur non connecté : hero original
  return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-16 fade-up">
          <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary mb-4">
            {liveCount > 0
                ? `${liveCount} session${liveCount > 1 ? "s" : ""} en direct aujourd'hui`
                : "LIVE · Q&A · PLANNING"}
          </p>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-foreground mb-5 leading-none">
            L&apos;expérience moderne pour vos événements.
          </h1>
          <p className="text-base text-muted-foreground max-w-md leading-relaxed mb-8">
            Sessions en direct, planning détaillé, questions des participants en temps réel. Tout au même endroit, magnifiquement présenté.
          </p>
          <div className="flex items-center gap-4">
            <Link
                href="/signup"
                className="btn-primary inline-flex items-center px-6 py-3 text-sm"
            >
              Créer un compte gratuit
            </Link>
            <Link
                href="/events"
                className="btn-secondary inline-flex items-center px-6 py-3 text-sm"
            >
              Voir les événements
            </Link>
          </div>
        </div>

        {events.length > 0 && (
            <div className="fade-up-1">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Prochains événements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => {
                  const live = isLive(event.sessions);
                  return (
                      <Link key={event.id} href={`/events/${event.id}`}>
                        <div
                            className={`glass-card p-5 hover:shadow-md transition-all group h-full cursor-pointer ${
                                live ? "border-destructive/30" : ""
                            }`}
                        >
                          {live && (
                              <span className="badge-live mb-3">
                        <span className="live-dot" />
                        EN DIRECT
                      </span>
                          )}
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                            {event.title}
                          </h3>
                          {event.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                {event.description}
                              </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{event.location}</span>
                            <span>·</span>
                            <span>
                        {formatDateRange(event.startDate, event.endDate)}
                      </span>
                          </div>
                          <p className="text-xs font-mono text-primary mt-2">
                            {event.sessions.length} session
                            {event.sessions.length !== 1 ? "s" : ""}
                          </p>
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