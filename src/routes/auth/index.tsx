import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { SignInForm } from "#/features/auth/components";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth/")({
  component: RouteComponent,
  validateSearch: searchSchema,
});

function RouteComponent() {
  const { redirect } = Route.useSearch();

  return <SignInForm redirect={redirect} />;
}
