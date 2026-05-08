"use client";
import { Session } from "@/types";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function isLive(session: Session): boolean {
    const now = new Date();
    return new Date(session.startTime) <= now && new Date(session.endTime) >= now;
}

export default function PlanningGrid({ sessions }: { sessions: Session[] }) {
    const roomsMap = new Map<string, { roomId: string; roomName: string; sessions: Session[] }>();
    sessions.forEach((session) => {
        const roomId = session.room?.id || "unknown";
        const roomName = session.room?.name || "Inconnue";
        if (!roomsMap.has(roomId)) {
            roomsMap.set(roomId, { roomId, roomName, sessions: [] });
        }
        roomsMap.get(roomId)!.sessions.push(session);
    });

    const rooms = Array.from(roomsMap.values());
    const times = Array.from(new Set(sessions.map((s) => s.startTime)))
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    if (rooms.length === 0 || times.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                Aucune session à afficher.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead>
                <tr>
                    <th className="border border-border bg-white/40 p-2 text-xs font-mono text-muted-foreground w-24">
                        Heure
                    </th>
                    {rooms.map(({ roomId, roomName }) => (
                        <th
                            key={roomId}
                            className="border border-border bg-white/40 p-2 text-xs font-mono text-muted-foreground"
                        >
                            <Link href={`/rooms/${roomId}`} className="hover:text-primary">
                                {roomName}
                            </Link>
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {times.map((time) => (
                    <tr key={time}>
                        <td className="border border-border p-2 text-xs font-mono text-muted-foreground align-top">
                            {formatTime(time)}
                        </td>
                        {rooms.map(({ roomId, sessions: roomSessions }) => {
                            const sessionsAtTime = roomSessions.filter(
                                (s) => s.startTime === time
                            );
                            return (
                                <td key={roomId} className="border border-border p-1 align-top">
                                    {sessionsAtTime.length > 0 && (
                                        <div className="space-y-1">
                                            {sessionsAtTime.map((session) => (
                                                <div key={session.id} className="relative">
                                                    <Link
                                                        href={`/sessions/${session.id}`}
                                                        className="block p-2 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-colors"
                                                    >
                                                        {isLive(session) && (
                                                            <span className="badge-live mb-1">
                                  <span className="live-dot" />
                                  EN DIRECT
                                </span>
                                                        )}
                                                        <div className="text-xs font-semibold text-foreground truncate">
                                                            {session.title}
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground mt-1">
                                                            {session.speakers?.map((s) => s.fullName).join(", ")}
                                                        </div>
                                                    </Link>
                                                    <div className="absolute top-1 right-1">
                                                        <FavoriteButton sessionId={session.id} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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