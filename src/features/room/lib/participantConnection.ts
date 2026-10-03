import { ConnectionQuality } from "livekit-client";

export type ParticipantConnectionStatus =
  | "connecting"
  | "connected"
  | "reconnecting";

/** How long a not-yet-active participant shows as connecting before we assume healthy. */
export const CONNECTING_GRACE_MS = 10_000;

interface ParticipantConnectionInput {
  quality: ConnectionQuality;
  /** Whether we are currently subscribed to the remote mic publication. */
  isSubscribed: boolean;
  /** Whether a mic TrackPublication exists at all (false = muted / unpublished). */
  hasPublication: boolean;
  /** Whether an actual remote MediaStreamTrack is attached. */
  hasTrack: boolean;
  /** Server-reported presence: true once the participant is ACTIVE in the room. */
  isActive: boolean;
  /** `participant.joinedAt` as epoch ms, if known. */
  joinedAtMs?: number;
  /** Current time as epoch ms (injectable for tests). Defaults to `Date.now()`. */
  nowMs?: number;
}

/**
 * Maps LiveKit SFU state to a simple 3-state UI status.
 *
 * There is no per-pair mesh PeerConnection in LiveKit (client <-> SFU only),
 * so "my connection to participant X" is approximated from:
 * - SFU-reported `connectionQuality` for X (Lost fires before disconnect)
 * - our subscription to X's mic track (publishing but not yet subscribed = connecting)
 * - server-reported presence (`isActive` / `joinedAt`)
 *
 * A muted listener who never publishes has no mic TrackPublication and may
 * keep `connectionQuality === Unknown` indefinitely — that is healthy and maps
 * to `connected`. Only a participant that is actively publishing but whose
 * media hasn't arrived yet maps to `connecting` via track state.
 *
 * Priority: reconnecting > connecting > connected.
 */
export function getParticipantConnectionStatus({
  quality,
  isSubscribed,
  hasPublication,
  hasTrack,
  isActive,
  joinedAtMs,
  nowMs = Date.now(),
}: ParticipantConnectionInput): ParticipantConnectionStatus {
  if (
    quality === ConnectionQuality.Lost ||
    quality === ConnectionQuality.Poor
  ) {
    return "reconnecting";
  }

  // They are trying to publish audio but we haven't received it yet.
  if (hasPublication && (!isSubscribed || !hasTrack)) {
    return "connecting";
  }

  // Not yet ACTIVE in the room: joining. Bound by a grace period so a
  // participant stuck without presence updates doesn't show connecting forever.
  if (!isActive) {
    if (joinedAtMs === undefined) {
      return "connecting";
    }
    return nowMs - joinedAtMs <= CONNECTING_GRACE_MS
      ? "connecting"
      : "connected";
  }

  return "connected";
}
