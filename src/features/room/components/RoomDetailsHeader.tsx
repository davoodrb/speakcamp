import { Badge } from "#/shared/components/ui/badge";
import { formatEnumLabel } from "#/shared/lib/utils";

interface RoomDetailsHeaderProps {
  language: string;
  level: string;
  desc: string | null;
  liveCount: number;
  maxParticipants: number;
}

function RoomDetailsHeader({
  language,
  level,
  desc,
  liveCount,
  maxParticipants,
}: RoomDetailsHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold tracking-tight">
          {formatEnumLabel(language)}
        </h3>

        <Badge className="rounded-full tracking-wider">
          {formatEnumLabel(level)}
        </Badge>

        <Badge variant="secondary" className="ml-auto tabular-nums">
          {liveCount}/{maxParticipants}
        </Badge>
      </div>

      {desc && (
        <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
      )}
    </div>
  );
}

export default RoomDetailsHeader;
