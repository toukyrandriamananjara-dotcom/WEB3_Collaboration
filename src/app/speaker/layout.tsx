import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SpeakerLayout({
                                                children,
                                            }: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "speaker") {
        redirect("/login?error=unauthorized");
    }

    return (
        <div className="flex min-h-screen">
            <aside className="w-56 border-r border-border bg-white/60 backdrop-blur-sm p-6 flex flex-col gap-4">
                <Link href="/" className="text-xl font-bold text-foreground mb-6">
                    MyVent
                </Link>
                <nav className="flex flex-col gap-1">
                    <Link
                        href="/speaker/dashboard"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-primary-soft/50 hover:text-primary transition-colors"
                    >
                        <span>📊</span> Tableau de bord
                    </Link>
                </nav>
                <div className="mt-auto">
                    <form action="/api/auth/signout" method="post">
                        <button
                            type="submit"
                            className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
                        >
                            Déconnexion
                        </button>
                    </form>
                </div>
            </aside>
            <main className="flex-1 p-6 lg:p-10">{children}</main>
        </div>
    );
}