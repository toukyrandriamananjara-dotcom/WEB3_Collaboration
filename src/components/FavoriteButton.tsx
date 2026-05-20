"use client";
import { useFavorites} from "../../hooks/useFavorite";

export default function FavoriteButton({ sessionId }: { sessionId: string }) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const fav = isFavorite(sessionId);

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(sessionId);
            }}
            className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full border transition-all ${
                fav
                    ? "bg-primary text-white border-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
            title={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
            {fav ? "★" : "☆"}
        </button>
    );
}