import { createFileRoute } from "@tanstack/react-router";
import ActivityStats from "#/features/account/components/ActivityStats";
import EditAccountForm from "#/features/account/components/EditAccountForm";
import { useLogout } from "#/features/auth/hooks/use-auth";
import { Button } from "#/shared/components/ui/button";

export const Route = createFileRoute("/_athenticated/account")({
  loader: ({ context: { session } }) => session.user,
  component: RouteComponent,
});

function RouteComponent() {
  const user = Route.useLoaderData();
  const logout = useLogout();

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <header className="mb-8 space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">Account</h1>
      </header>

      <section className="space-y-6">
        <div className="space-y-0.5">
          <h2 className="text-sm font-medium tracking-tight">Profile</h2>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-6">
          <EditAccountForm user={user} />
        </div>
      </section>

      <section className="mt-10 space-y-4 border-t border-border/60 pt-8">
        <div className="space-y-0.5">
          <h2 className="text-sm font-medium tracking-tight">Activity</h2>
        </div>

        <ActivityStats />
      </section>

      <section className="mt-10 space-y-4 border-t border-border/60 pt-8">
        <div className="space-y-0.5">
          <h2 className="text-sm font-medium tracking-tight">Session</h2>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          <span>{logout.isPending ? "Signing out…" : "Sign out"}</span>
        </Button>
      </section>
    </div>
  );
}
