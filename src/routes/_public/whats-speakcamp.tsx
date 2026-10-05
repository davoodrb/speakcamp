import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  DoorOpenIcon,
  MicIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import { Badge } from "#/shared/components/ui/badge";
import { buttonVariants } from "#/shared/components/ui/button";

export const Route = createFileRoute("/_public/whats-speakcamp")({
  head: () => ({
    meta: [
      {
        title: "What's SpeakCamp? | SpeakCamp",
      },
    ],
  }),
  component: RouteComponent,
});

const VOICE_BARS = [10, 18, 28, 16, 32, 22, 12, 26, 14, 20, 30, 17, 11];

function RouteComponent() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="space-y-12">
        <header className="space-y-6">
          <div aria-hidden="true" className="flex items-center gap-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span className="flex h-8 items-end gap-1">
              {VOICE_BARS.map((height) => (
                <span
                  key={height}
                  style={{ height }}
                  className="w-1 rounded-full bg-primary/70 odd:bg-primary/35"
                />
              ))}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              What&apos;s SpeakCamp?
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              A place to talk and improve speaking
            </h1>

            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              SpeakCamp is a voice chat app for practicing speaking with other
              people. Join a room, start talking, and build confidence through
              real conversation. It is inspired by Free4Talk, rebuilt for people
              in Iran with stable connections and no connection issues.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link to="/" className={buttonVariants()}>
              Browse rooms
              <ArrowRightIcon className="size-4" />
            </Link>
            <Link
              to="/auth/sign-up"
              className={buttonVariants({ variant: "outline" })}
            >
              Create an account
            </Link>
          </div>
        </header>

        <div className="h-px bg-border" />

        <section className="space-y-5">
          <div className="space-y-2">
            <h2 className="text-base font-semibold">How it works</h2>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              No setup, no complicated steps. Talking starts in two moves.
            </p>
          </div>

          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <UserRoundPlusIcon className="size-4" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-medium">Create an account</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Sign up once. That unlocks joining rooms and creating rooms.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <DoorOpenIcon className="size-4" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Join a room or create your own
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Pick an open room and start talking, or create a room and let
                  others join.
                </p>
              </div>
            </li>
          </ol>

          <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
            <MicIcon className="size-4 shrink-0" />
            <p>
              Tip: pick a room with a topic that matches what you want to
              practice.
            </p>
          </div>
        </section>

        <div className="h-px bg-border" />

        <section className="space-y-5">
          <div className="space-y-2">
            <h2 className="text-base font-semibold">Still under development</h2>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              SpeakCamp is still under development and improving. Feedback on
              bugs, ideas, and the overall experience is welcome and helps shape
              what gets built next.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://t.me/davo_od"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants()}
            >
              Message me on Telegram
              <Badge variant="secondary" className="ml-1">
                @davo_od
              </Badge>
            </a>
          </div>

          <p className="text-sm leading-6 text-muted-foreground">
            The source code is public at{" "}
            <a
              href="https://github.com/davoodrb/speakcamp"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              github.com/davoodrb/speakcamp
            </a>
            .
          </p>
        </section>

        <div className="h-px bg-border" />

        <section className="space-y-3">
          <h2 className="text-base font-semibold">About the project</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            This is a learning project and it&apos;s still a work in progress.
            I&apos;m gradually adding features and improving the experience.
          </p>
          <p className="text-xs text-muted-foreground">
            version: {import.meta.env.APP_VERSION}
          </p>
        </section>
      </div>
    </main>
  );
}
