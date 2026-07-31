import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "#/features/auth/lib/auth.functions";

export const Route = createFileRoute("/_athenticated")({
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
