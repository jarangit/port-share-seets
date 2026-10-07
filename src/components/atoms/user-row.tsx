import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Cluster, Shrink } from "@/components/ui/layout";
import { Text } from "@/components/ui/typography";
import { TrustBadge } from "@/components/atoms/badges";
import type { UserProfile } from "@/features/users/types";

export function UserRow({ user, sub }: { user: UserProfile; sub?: string }) {
  return (
    <Cluster gap="md">
      <Avatar tone={user.avatarTone}>
        {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
        <AvatarFallback>{user.initials}</AvatarFallback>
      </Avatar>
      <Shrink>
        <Cluster gap="sm">
          <Text as="span" weight="bold" truncate>
            {user.name}
          </Text>
          <TrustBadge verifiedPhone={user.verifiedPhone} verifiedId={user.verifiedId} compact />
        </Cluster>
        {sub && (
          <Text as="span" size="caption" tone="muted" truncate>
            {sub}
          </Text>
        )}
      </Shrink>
    </Cluster>
  );
}
