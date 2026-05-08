// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { Room } from "@/types";
//
// async function getRoom(id: string): Promise<Room | null> {
//     const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/rooms/${id}`,
//         { cache: "no-store" }
//     );
//     if (!res.ok) return null;
//     return res.json();
// }
//
// export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
//     const { id } = await params;
//     const room = await getRoom(id);
//     if (!room) notFound();
//
//     const sessionsSorted = room.sessions.sort(
//         (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
//     );
//
//     return (
//         <div className="max-w-6xl mx-auto px-6 py-12">
//             <Link href="/" className="text-xs font-mono text-muted-foreground hover:text-primary mb-4 inline-block">
//                 ← Accueil
//             </Link>
//             <h1 className="text-4xl font-bold text-foreground mb-2">{room.name}</h1>
//             <p className="text-muted-foreground mb-8">Sessions dans cette salle</p>
//
//             <div className="flex flex-col gap-3">
//                 {sessionsSorted.map((session) => {
//                     const live = new Date(session.startTime) <= new Date() && new Date(session.endTime) >= new Date();
//                     return (
//                         <Link key={session.id} href={`/sessions/${session.id}`}>
//                             <div className={`glass-card p-4 flex items-center justify-between hover:shadow-md transition-all ${live ? "border-destructive/30 bg-destructive/5" : ""}`}>
//                                 <div>
//                                     <div className="flex items-center gap-2">
//                                         {live && <span className="badge-live"><span className="live-dot" />En direct</span>}
//                                         <span className="text-sm font-mono text-muted-foreground">
//                       {new Date(session.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
//                                             {" - "}
//                                             {new Date(session.endTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
//                     </span>
//                                     </div>
//                                     <h3 className="font-semibold text-foreground mt-1">{session.title}</h3>
//                                     <p className="text-xs text-muted-foreground mt-0.5">
//                                         {session.speakers?.map(s => s.fullName).join(", ")}
//                                     </p>
//                                 </div>
//                                 <span className="text-foreground/30">→</span>
//                             </div>
//                         </Link>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }