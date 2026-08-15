import { createFileRoute } from "@tanstack/react-router";
import EditAccountForm from "#/features/account/components/EditAccountForm";
import { useLogout } from "#/features/auth/hooks/use-auth";
import { Button } from "#/shared/components/ui/button";

export const Route = createFileRoute("/_athenticated/account")({
	loader: ({ context }) => {
		const { session } = context;

		return session.user;
	},

	component: RouteComponent,
});

function RouteComponent() {
	const user = Route.useLoaderData();

	const logout = useLogout();

	return (
		<div className="space-y-8 max-w-xl mx-auto p-4">
			<h2 className="text-xl">Account information</h2>
			<EditAccountForm user={user} />

			<Button variant="outline" onClick={() => logout.mutate()}>
				<span>Logout</span>
			</Button>
		</div>
	);
}
