import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Cluster } from "@/components/ui/layout";
import { CheckCheck, ShieldCheck, CarFront, Motorbike, type LucideIcon } from "lucide-react";
import type { VehicleType } from "@/features/rides/types";

export const vehicleMeta: Record<VehicleType, { label: string; icon: LucideIcon }> = {
  car: { label: "รถยนต์", icon: CarFront },
  motorbike: { label: "มอเตอร์ไซค์", icon: Motorbike },
};

export function VehicleBadge({ type }: { type: VehicleType }) {
  const meta = vehicleMeta[type];
  return (
    <Badge variant="outline">
      <Icon icon={meta.icon} size="xs" /> {meta.label}
    </Badge>
  );
}

export function TrustBadge({
  verifiedPhone,
  verifiedId,
  compact = false,
}: {
  verifiedPhone: boolean;
  verifiedId: boolean;
  compact?: boolean;
}) {
  const both = verifiedPhone && verifiedId;
  return (
    <Cluster gap="sm">
      {both ? (
        <Badge variant="success" size={compact ? "xs" : "default"}>
          <Icon icon={CheckCheck} size="xs" /> ยืนยันแล้ว
        </Badge>
      ) : (
        <Badge variant="secondary">
          <Icon icon={ShieldCheck} size="xs" /> ยืนยันบางส่วน
        </Badge>
      )}
    </Cluster>
  );
}
