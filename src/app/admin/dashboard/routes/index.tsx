import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <h1 className="text-4xl font-bold">Event Admin</h1>
      <p className="max-w-md text-muted-foreground">
        A react-admin dashboard for managing events, attendees, tickets and venues.
      </p>
      <Link
        to="/admin"
        className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Open dashboard →
      </Link>
    </div>
  );
}
