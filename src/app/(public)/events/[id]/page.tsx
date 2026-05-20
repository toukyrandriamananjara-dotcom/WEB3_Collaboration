import Link from "next/link";
import { Event } from "@/types";
import { notFound } from "next/navigation";
import EventViewToggler from "@/components/EventViewToggler";

async function getEvent(id: string): Promise<Event | null> {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/events/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
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

export default async function EventDetailPage({
                                                  params,
                                              }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const event = await getEvent(id);
    if (!event) notFound();

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <Link
                href="/events"
                className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-10"
            >
                ← Tous les événements
            </Link>

            <div className="fade-up mb-12">
                <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary mb-3">
                    {formatDateRange(event.startDate, event.endDate)} · {event.location}
                </p>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight mb-4">
                    {event.title}
                </h1>
                {event.description && (
                    <p className="text-base text-muted-foreground max-w-2xl leading-relaxed border-l-2 border-primary pl-5">
                        {event.description}
                    </p>
                )}
            </div>

            <EventViewToggler event={event} />
        </div>
    );
}