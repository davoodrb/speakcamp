import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/contact")({
  component: RouteComponent,
});

const todos = [
  "Add report system",
  "Chat system for rooms",
  "Live update room list",
  "Delete account option",
];

function RouteComponent() {
  return (
    <div className="mx-auto max-w-2xl space-y-10 p-6">
      <section className="relative overflow-hidden rounded-xl border bg-leaner-to-br from-primary/10 via-primary/5 to-transparent p-6">
        <div className="absolute -right-8 -top-8 size-32 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative space-y-3">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Get in touch
          </span>
          <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
          <p className="text-sm text-muted-foreground">
            Feel free to contact me about anything — bugs, feature requests, or
            whatever.
          </p>
          <a
            href="https://t.me/davo_od"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Telegram | @davo_od
          </a>
        </div>
      </section>

      <section className="space-y-3 border-l-2 border-primary/40 pl-4">
        <h2 className="text-lg font-semibold tracking-tight">About</h2>
        <p className="text-sm text-muted-foreground">
          This is a learning project. New features will be added over time.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-primary">
            TODO
          </h2>
          <span className="text-sm text-muted-foreground">
            (no specific order)
          </span>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {todos.map((todo) => (
            <li
              key={todo}
              className="flex items-start gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <span
                aria-hidden
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
              />
              <span>{todo}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
