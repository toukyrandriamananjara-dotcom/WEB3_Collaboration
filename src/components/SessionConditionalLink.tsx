"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SessionConditionalLink() {
    const { data: session } = useSession();

    if (!session) return null;

    return (
        <Link
            href="/events"
            className="text-sm text-foreground/80 hover:text-primary transition-colors font-medium"
        >
            Événements
        </Link>
    );
}