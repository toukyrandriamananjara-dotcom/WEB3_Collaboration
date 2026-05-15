import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const EventAdmin = lazy(() => import("@/components/EventAdmin"));

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Event Admin Dashboard" },
      { name: "description", content: "Manage events, attendees, tickets and venues." },
    ],
  }),
});

function AdminPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading admin…</div>}>
      <EventAdmin />
    </Suspense>
  );
}
