"use client";
import { Session, Room } from "@/types";
import Link from "next/link";

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function PlanningGrid({ sessions }: { sessions: Session[] }) {
    // Regroupement par salle
    const roomsMap = new Map<string, { room: Room; sessions: Session[] }>();
    sessions.forEach((session) => {
        const roomId = session.room?.id || "unknown";
        if (!roomsMap.has(roomId)) {
            roomsMap.set(roomId, { room: session.room!, sessions: [] });
        }
        roomsMap.get(roomId)!.sessions.push(session);
    });

    const rooms = Array.from(roomsMap.values());

    // Déterminer les créneaux horaires (toutes les heures de début uniques, triées)
    const times = Array.from(new Set(sessions.map((s) => s.startTime)))
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead>
                <tr>
                    <th className="border border-border bg-white/40 p-2 text-xs font-mono text-muted-foreground w-24">
                        Heure
                    </th>
                    {rooms.map(({ room }) => (
                        <th
                            key={room.id}
                            className="border border-border bg-white/40 p-2 text-xs font-mono text-muted-foreground"
                        >
                            {room.name}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {times.map((time) => (
                    <tr key={time}>
                        <td className="border border-border p-2 text-xs font-mono text-muted-foreground">
                            {formatTime(time)}
                        </td>
                        {rooms.map(({ room, sessions: roomSessions }) => {
                            const session = roomSessions.find(
                                (s) => s.startTime === time
                            );
                            return (
                                <td
                                    key={room.id}
                                    className="border border-border p-1 align-top"
                                >
                                    {session ? (
                                        <Link
                                            href={`/sessions/${session.id}`}
                                            className="block p-2 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-colors"
                                        >
                                            <div className="text-xs font-semibold text-foreground truncate">
                                                {session.title}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground mt-1">
                                                {session.speakers
                                                    ?.map((s) => s.fullName)
                                                    .join(", ")}
                                            </div>
                                        </Link>
                                    ) : null}
                                </td>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}