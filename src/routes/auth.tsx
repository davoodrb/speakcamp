import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-4">
        <Outlet />
      </div>
    </div>
  );
}
