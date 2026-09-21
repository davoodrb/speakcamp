import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authClient } from "#/features/auth/lib/auth-client";
import Header from "#/shared/components/layout/Header";

export const Route = createFileRoute("/_public")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  return (
    <>
      <Header user={session?.user} userIsLoading={isSessionLoading} />
      <Outlet />
    </>
  );
}
