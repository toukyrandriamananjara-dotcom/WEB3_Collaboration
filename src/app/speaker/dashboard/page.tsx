import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SpeakerDashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "speaker") redirect("/login");

    const speaker = await prisma.speaker.findUnique({
        where: { email: session.user.email! },
        include: {
            sessions: {
                include: {
                    event: true,
                    _count: { select: { questions: true } }, // compteur de questions
                },
                orderBy: { startTime: "asc" },
            },
        },
    });

    if (!speaker) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-foreground">Intervenant introuvable</h1>
                <p className="text-muted-foreground">Veuillez contacter un administrateur.</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-foreground mb-6">
                Bienvenue, {speaker.fullName}
            </h1>
            {speaker.sessions.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl p-12 text-center">
                    <p className="text-muted-foreground">Aucune session assignée.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {speaker.sessions.map((session) => {
                        const questionCount = session._count?.questions ?? 0;
                        return (
                            <div
                                key={session.id}
                                className="glass-card p-4 flex items-center justify-between"
                            >
                                <div>
                                    <h3 className="font-semibold text-foreground">{session.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {session.event?.title} ·{" "}
                                        {new Date(session.startTime).toLocaleString("fr-FR", {
                                            day: "numeric",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <Link
                                    href={`/speaker/sessions/${session.id}/questions`}
                                    className="btn-primary text-xs"
                                >
                                    Questions
                                    {questionCount > 0 && ` (${questionCount})`}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}