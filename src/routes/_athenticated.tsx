import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "#/features/auth/lib/auth.functions";
import Header from "#/shared/components/layout/header";

export const Route = createFileRoute("/_athenticated")({
	component: AuthenticatedLayout,
	beforeLoad: async ({ context, location }) => {
		const session = await getSession();

		if (!session?.session) {
			throw redirect({
				to: "/auth",
				search: {
					redirect: location.href,
				},
			});
		}

		return { ...context, session };
	},

	ssr: false,
});

function AuthenticatedLayout() {
	const { session } = Route.useRouteContext();

	return (
		<>
			<Header user={session.user} />
			<Outlet />
		</>
	);
}
