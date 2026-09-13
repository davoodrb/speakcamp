import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-4 space-y-4">
        <Outlet />
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
