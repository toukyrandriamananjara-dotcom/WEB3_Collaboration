import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const baseNavItems = [
    { label: "Événements", href: "/events", icon: "📅" },
];

export default async function PublicLayout({
                                               children,
                                           }: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    const showFavorites = session?.user?.role === "user";

    const navItems = showFavorites
        ? [...baseNavItems, { label: "Favoris", href: "/favorites", icon: "⭐" }]
        : baseNavItems;

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-56 border-r border-border bg-white/60 backdrop-blur-sm p-6 flex flex-col gap-4">
                <Link href="/" className="text-xl font-bold text-foreground mb-6">
                    MyVent
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
            </aside>
            <main className="flex-1 p-6 lg:p-10">{children}</main>
        </div>
    );
}