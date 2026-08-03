import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Header from "#/components/layout/header";
import { getSession } from "#/features/auth/lib/auth.functions";

export const Route = createFileRoute("/_athenticated")({
	component: AuthenticatedLayout,
	beforeLoad: async ({ location }) => {
		const session = await getSession();

		if (!session?.session) {
			throw redirect({
				to: "/auth",
				search: {
					redirect: location.href,
				},
			});
		}
	},
});

function AuthenticatedLayout() {
	return (
		<>
			<Header />
			<Outlet />
		</>
	);
}
