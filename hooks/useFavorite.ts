"use client";
import { useState, useEffect, useCallback } from "react";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("favorites");
        if (stored) setFavorites(JSON.parse(stored));
    }, []);

    const isFavorite = useCallback(
        (sessionId: string) => favorites.includes(sessionId),
        [favorites]
    );

    const toggleFavorite = useCallback(
        (sessionId: string) => {
            setFavorites((prev) => {
                const updated = prev.includes(sessionId)
                    ? prev.filter((id) => id !== sessionId)
                    : [...prev, sessionId];
                localStorage.setItem("favorites", JSON.stringify(updated));
                return updated;
            });
        },
        []
    );

    return { favorites, isFavorite, toggleFavorite };
}