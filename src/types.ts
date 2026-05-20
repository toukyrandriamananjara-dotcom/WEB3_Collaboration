export interface Room {
    id: string;
    name: string;
}

export interface Speaker {
    id: string;
    fullName: string;
    photo?: string;
    bio?: string;
    externalLinks?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
        website?: string;
    };
    sessions?: Session[];
    createdAt: string;
    updatedAt: string;
}

export interface Question {
    id: string;
    content: string;
    authorName: string | null;
    upvotes: number;
    sessionId: string;
    createdAt: string;
    answer?: {
        id: string;
        content: string;
        createdAt: string;
        speaker?: {
            fullName: string;
        };
    } | null;
}

export interface Session {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    capacity?: number;
    eventId: string;
    roomId: string;
    room: Room;
    speakers: Speaker[];
    questions?: Question[];
    event?: Event;
    createdAt: string;
    updatedAt: string;
}

export interface Event {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    location: string;
    sessions: Session[];
    createdAt: string;
    updatedAt: string;
}