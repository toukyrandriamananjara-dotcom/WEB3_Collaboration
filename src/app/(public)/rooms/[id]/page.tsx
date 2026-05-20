import Link from "next/link";
import { notFound } from "next/navigation";
import { Session } from "@/types";

type RoomWithSessions = {
    id: string;
    name: string;
    sessions: Session[];
};

async function getRoom(id: string): Promise<RoomWithSessions | null> {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/rooms/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
}

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function isLive(session: Session) {
    const now = new Date();
    return new Date(session.startTime) <= now && new Date(session.endTime) >= now;
}

export default async function RoomPage({
                                           params,
                                       }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const room = await getRoom(id);
    if (!room) notFound();

    const sessionsSorted = [...room.sessions].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <Link
                href="/events"
                className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-10"
            >
                ← Événements
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">{room.name}</h1>
            <p className="text-muted-foreground mb-8">Sessions dans cette salle</p>

            {sessionsSorted.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl p-12 text-center">
                    <p className="text-xs font-mono text-muted-foreground">
                        Aucune session dans cette salle.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {sessionsSorted.map((session) => {
                        const live = isLive(session);
                        return (
                            <Link key={session.id} href={`/sessions/${session.id}`}>
                                <div
                                    className={`glass-card p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer ${
                                        live ? "border-destructive/30 bg-destructive/5" : ""
                                    }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            {live && (
                                                <span className="badge-live">
                          <span className="live-dot" />
                          EN DIRECT
                        </span>
                                            )}
                                            <span className="text-sm font-mono text-muted-foreground">
                        {formatTime(session.startTime)} – {formatTime(session.endTime)}
                      </span>
                                        </div>
                                        <h3 className="font-semibold text-foreground mt-1">{session.title}</h3>
                                        {session.speakers?.length > 0 && (
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {session.speakers.map((s) => s.fullName).join(", ")}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-foreground/30 group-hover:text-primary transition-colors">
                    →
                  </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}