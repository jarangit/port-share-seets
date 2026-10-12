import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Cluster } from "@/components/ui/layout";
import { CheckCheck, ShieldCheck } from "lucide-react";
import { copy } from "@/content/copy";

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
          <Icon icon={CheckCheck} size="xs" /> {copy.trust.verified}
        </Badge>
      ) : (
        <Badge variant="secondary">
          <Icon icon={ShieldCheck} size="xs" /> {copy.trust.partial}
        </Badge>
      )}
    </Cluster>
  );
}
