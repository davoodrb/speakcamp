import { createFileRoute } from "@tanstack/react-router";
import EditAccountForm from "#/features/account/components/EditAccountForm";

export const Route = createFileRoute("/_athenticated/account")({
	loader: ({ context }) => {
		const { session } = context;

		return session.user;
	},

	component: RouteComponent,
});

function RouteComponent() {
	const user = Route.useLoaderData();

	return (
		<div className="space-y-4 max-w-xl mx-auto p-4">
			<h2 className="text-xl">Account information</h2>
			<EditAccountForm user={user} />
		</div>
	);
}
