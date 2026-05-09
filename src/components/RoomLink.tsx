"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RoomLink({
                                     roomId,
                                     roomName,
                                 }: {
    roomId: string;
    roomName: string;
}) {
    const router = useRouter();

    return (
        <span
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/rooms/${roomId}`);
            }}
            className="text-foreground/60 hover:text-primary hover:underline cursor-pointer"
        >
      {roomName}
    </span>
    );
}