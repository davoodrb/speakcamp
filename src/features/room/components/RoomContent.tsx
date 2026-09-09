import {
  ControlBar,
  ParticipantLoop,
  RoomAudioRenderer,
  useParticipants,
} from "@livekit/components-react";
import "@livekit/components-styles";
import ParticipantCard from "./ParticipantCard";

function RoomContent() {
  const participants = useParticipants();

  return (
    <div className="space-y-4">
      <ControlBar controls={{ camera: false, screenShare: false }} />
      <div className="container mx-auto flex flex-wrap gap-4 items-stretch justify-center">
        <ParticipantLoop participants={participants}>
          <ParticipantCard />
        </ParticipantLoop>
      </div>

      <RoomAudioRenderer />
    </div>
  );
}

export default RoomContent;
