import type { EtaStatus } from "../../../utils/inTransitStorage";
import { cn } from "../../ui/utils";

const ETA_TONES: Record<EtaStatus, string> = {
  on_time: "agrivo-transit-eta--on-time",
  delay_risk: "agrivo-transit-eta--risk",
  delayed: "agrivo-transit-eta--delayed",
};

export function EtaBadge({
  eta,
  etaStatus,
  className,
}: {
  eta: string;
  etaStatus: EtaStatus;
  className?: string;
}) {
  return (
    <span className={cn("agrivo-transit-eta", ETA_TONES[etaStatus], className)}>
      ETA {eta}
    </span>
  );
}
