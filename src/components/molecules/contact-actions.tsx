import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Cluster } from "@/components/ui/layout";
import { Phone, MessageCircle } from "lucide-react";

export function ContactActions({
  phone,
  lineId,
  compact = false,
}: {
  phone: string;
  lineId: string;
  compact?: boolean;
}) {
  const telHref = `tel:${phone.replace(/-/g, "")}`;
  const lineHref = `https://line.me/ti/p/~${lineId}`;
  const size = compact ? "sm" : "default";

  return (
    <Cluster gap="sm">
      <Button size={size} width="grow" asChild>
        <a href={telHref}>
          <Icon icon={Phone} size="xs" /> โทร
        </a>
      </Button>
      <Button size={size} width="grow" variant="secondary" asChild>
        <a href={lineHref} target="_blank" rel="noreferrer">
          <Icon icon={MessageCircle} size="xs" /> LINE
        </a>
      </Button>
    </Cluster>
  );
}
