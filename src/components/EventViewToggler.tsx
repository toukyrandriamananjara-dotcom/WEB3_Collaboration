"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Event } from "@/types";
import PlanningGrid from "./PlanningGrid";
import FavoriteButton from "./FavoriteButton";

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function isLive(session: Event["sessions"][number]) {
    const now = new Date();
    return new Date(session.startTime) <= now && new Date(session.endTime) >= now;
}

export default function EventViewToggler({ event }: { event: Event }) {
    const [view, setView] = useState<"list" | "grid">("list");
    const router = useRouter();

    const sessionsSorted = [...event.sessions].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Sessions</h2>
                <div className="flex bg-secondary border border-border rounded-lg p-1">
                    <button
                        onClick={() => setView("list")}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            view === "list"
                                ? "bg-primary text-white"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Liste
                    </button>
                    <button
                        onClick={() => setView("grid")}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            view === "grid"
                                ? "bg-primary text-white"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Planning
                    </button>
                </div>
            </div>

            {view === "list" && (
                <div className="flex flex-col gap-3">
                    {sessionsSorted.map((session) => {
                        const live = isLive(session);
                        return (
                            <Link key={session.id} href={`/sessions/${session.id}`}>
                                <div
                                    className={`glass-card p-5 transition-all group cursor-pointer flex items-center justify-between gap-4 ${
                                        live ? "border-destructive/30 bg-destructive/5" : ""
                                    }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {live && <span className="badge-live"><span className="live-dot" />EN DIRECT</span>}
                                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                {session.title}
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-xs">
                      <span className="font-mono text-muted-foreground">
                        {formatTime(session.startTime)} – {formatTime(session.endTime)}
                      </span>
                                            {/* Nom de salle cliquable sans <a> à l'intérieur d'un autre <a> */}
                                            <span
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    router.push(`/rooms/${session.room?.id}`);
                                                }}
                                                className="text-foreground/60 hover:text-primary underline-offset-2 hover:underline cursor-pointer"
                                            >
                        {session.room?.name}
                      </span>
                                            <span className="text-foreground/60">
                        {session.speakers?.map((s) => s.fullName).join(", ")}
                      </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <FavoriteButton sessionId={session.id} />
                                        <span className="text-foreground/30 group-hover:text-primary transition-colors">→</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {view === "grid" && <PlanningGrid sessions={event.sessions} />}
        </>
    );
}