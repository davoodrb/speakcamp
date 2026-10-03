import { ConnectionQuality } from "livekit-client";
import { describe, expect, it } from "vitest";
import {
  CONNECTING_GRACE_MS,
  getParticipantConnectionStatus,
} from "./participantConnection";

const NOW = 1_000_000;
const RECENT_JOIN = NOW - 1_000;
const OLD_JOIN = NOW - CONNECTING_GRACE_MS - 1_000;

describe("getParticipantConnectionStatus", () => {
  it("reports connecting for a just-joined participant that is not active yet", () => {
    expect(
      getParticipantConnectionStatus({
        quality: ConnectionQuality.Unknown,
        isSubscribed: false,
        hasPublication: false,
        hasTrack: false,
        isActive: false,
        joinedAtMs: RECENT_JOIN,
        nowMs: NOW,
      }),
    ).toBe("connecting");
  });

  it("reports connecting when publication exists but track not attached yet", () => {
    expect(
      getParticipantConnectionStatus({
        quality: ConnectionQuality.Good,
        isSubscribed: true,
        hasPublication: true,
        hasTrack: false,
        isActive: true,
        joinedAtMs: OLD_JOIN,
        nowMs: NOW,
      }),
    ).toBe("connecting");
  });

  it("reports connecting when not yet subscribed to an active publication", () => {
    expect(
      getParticipantConnectionStatus({
        quality: ConnectionQuality.Excellent,
        isSubscribed: false,
        hasPublication: true,
        hasTrack: false,
        isActive: true,
        joinedAtMs: OLD_JOIN,
        nowMs: NOW,
      }),
    ).toBe("connecting");
  });

  it("reports connected for healthy subscribed track", () => {
    for (const quality of [
      ConnectionQuality.Excellent,
      ConnectionQuality.Good,
    ]) {
      expect(
        getParticipantConnectionStatus({
          quality,
          isSubscribed: true,
          hasPublication: true,
          hasTrack: true,
          isActive: true,
          joinedAtMs: OLD_JOIN,
          nowMs: NOW,
        }),
      ).toBe("connected");
    }
  });

  it("reports connected for muted participant with healthy link", () => {
    expect(
      getParticipantConnectionStatus({
        quality: ConnectionQuality.Good,
        isSubscribed: false,
        hasPublication: false,
        hasTrack: false,
        isActive: true,
        joinedAtMs: OLD_JOIN,
        nowMs: NOW,
      }),
    ).toBe("connected");
  });

  it("reports connected for a muted listener stuck at Unknown quality", () => {
    // Regression: a user who joins muted never publishes, so quality can stay
    // Unknown forever. They are listening fine and must not show connecting.
    expect(
      getParticipantConnectionStatus({
        quality: ConnectionQuality.Unknown,
        isSubscribed: false,
        hasPublication: false,
        hasTrack: false,
        isActive: true,
        joinedAtMs: OLD_JOIN,
        nowMs: NOW,
      }),
    ).toBe("connected");
  });

  it("stops reporting connecting after the grace period even without presence", () => {
    expect(
      getParticipantConnectionStatus({
        quality: ConnectionQuality.Unknown,
        isSubscribed: false,
        hasPublication: false,
        hasTrack: false,
        isActive: false,
        joinedAtMs: OLD_JOIN,
        nowMs: NOW,
      }),
    ).toBe("connected");
  });

  it("reports reconnecting on poor or lost quality even when subscribed", () => {
    for (const quality of [ConnectionQuality.Poor, ConnectionQuality.Lost]) {
      expect(
        getParticipantConnectionStatus({
          quality,
          isSubscribed: true,
          hasPublication: true,
          hasTrack: true,
          isActive: true,
          joinedAtMs: OLD_JOIN,
          nowMs: NOW,
        }),
      ).toBe("reconnecting");
    }
  });

  it("reports reconnecting for degraded listeners without publications", () => {
    expect(
      getParticipantConnectionStatus({
        quality: ConnectionQuality.Lost,
        isSubscribed: false,
        hasPublication: false,
        hasTrack: false,
        isActive: true,
        joinedAtMs: OLD_JOIN,
        nowMs: NOW,
      }),
    ).toBe("reconnecting");
  });
});
