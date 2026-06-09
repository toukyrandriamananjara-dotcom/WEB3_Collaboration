/**import { eventEmitter } from "@/lib/eventEmitter";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
        start(controller) {
            // Écouter les nouvelles questions
            const onNewQuestion = (payload: any) => {
                const message = `data: ${JSON.stringify({ type: "new-question", payload })}\n\n`;
                controller.enqueue(encoder.encode(message));
            };
            eventEmitter.on("new-question", onNewQuestion);

            // Optionnel : ping de maintien
            const interval = setInterval(() => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "ping" })}\n\n`));
            }, 30000);

            req.signal.addEventListener("abort", () => {
                clearInterval(interval);
                eventEmitter.off("new-question", onNewQuestion);
            });
        },
    });
    return new Response(readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}**/