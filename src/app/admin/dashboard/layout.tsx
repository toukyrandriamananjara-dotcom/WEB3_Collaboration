import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: "🏠" },
    { label: "Événements", href: "/admin/dashboard/events", icon: "📅" },
    { label: "Intervenants", href: "/admin/dashboard/speakers", icon: "🎤" },
    { label: "Salles", href: "/admin/dashboard/rooms", icon: "🏛️" },
];

export default async function AdminLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") redirect("/admin/login");

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-60 border-r border-border bg-white/60 backdrop-blur-sm p-6 flex flex-col gap-4">
                <Link href="/admin/dashboard" className="text-xl font-bold text-foreground mb-6">
                    MyVent <span className="text-primary">Admin</span>
                </Link>
                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-primary-soft/50 hover:text-primary transition-colors"
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="mt-auto">
                    <form action="/api/auth/signout" method="post">
                        <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors">
                            Déconnexion
                        </button>
                    </form>
                </div>
            </aside>

            {/* Contenu principal */}
            <main className="flex-1 p-6 lg:p-10">{children}</main>
        </div>
    );
}