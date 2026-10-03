import {
  useConnectionQualityIndicator,
  useParticipantContext,
} from "@livekit/components-react";
import { useEffect, useState } from "react";
import {
  CONNECTING_GRACE_MS,
  getParticipantConnectionStatus,
  type ParticipantConnectionStatus,
} from "#/features/room/lib/participantConnection";

interface UseParticipantConnectionStatusOptions {
  isSubscribed: boolean;
  hasPublication: boolean;
  hasTrack: boolean;
}

/**
 * Derives a simple 3-state connection status for the current
 * `useParticipantContext()` participant, from the local viewer's perspective.
 *
 * Must be called inside `<ParticipantLoop>` / `ParticipantContext`.
 * Returns "connected" when healthy — callers should render nothing then
 * (overlay-only-when-degraded).
 *
 * Presence (`isActive` / `joinedAt`) — not mic-track existence — determines
 * the connecting state, so muted listeners who never publish correctly show
 * as connected. A grace-period timeout forces a re-render so a `connecting`
 * badge clears even if no further LiveKit event arrives.
 */
export function useParticipantConnectionStatus({
  isSubscribed,
  hasPublication,
  hasTrack,
}: UseParticipantConnectionStatusOptions): ParticipantConnectionStatus {
  const participant = useParticipantContext();
  const { quality } = useConnectionQualityIndicator();
  const [nowMs, setNowMs] = useState(() => Date.now());
  // First time we rendered this card; fallback join time when the server
  // hasn't (yet) provided `joinedAt`.
  const [firstSeenMs] = useState(() => Date.now());

  const isActive = participant.isActive;
  const joinedAtMs = participant.joinedAt?.getTime() ?? firstSeenMs;

  useEffect(() => {
    if (isActive) {
      return;
    }
    const remaining = joinedAtMs + CONNECTING_GRACE_MS - Date.now();
    if (remaining <= 0) {
      return;
    }
    const timer = setTimeout(() => setNowMs(Date.now()), remaining);
    return () => clearTimeout(timer);
  }, [isActive, joinedAtMs]);

  return getParticipantConnectionStatus({
    quality,
    isSubscribed,
    hasPublication,
    hasTrack,
    isActive,
    joinedAtMs,
    nowMs,
  });
}
