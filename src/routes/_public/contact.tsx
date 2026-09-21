import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "#/shared/components/ui/badge";

export const Route = createFileRoute("/_public/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="space-y-12">
        <header className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Contact</p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Have something to say?
            </h1>

            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Found a bug, have a feature request, or just want to get in touch?
              Feel free to reach out.
            </p>
          </div>

          <a
            href="https://t.me/davo_od"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Message me on Telegram
            <Badge className="ml-2">@davo_od</Badge>
          </a>
        </header>

        <div className="h-px bg-border" />

        <section className="space-y-3">
          <h2 className="text-base font-semibold">About the project</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            This is a learning project and it's still a work in progress. I'm
            gradually adding features and improving the experience.
          </p>
          <p className="text-xs text-muted-foreground">
            version: {import.meta.env.APP_VERSION}
          </p>
        </section>
      </div>
    </main>
  );
}
