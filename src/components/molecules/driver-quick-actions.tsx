import { Button } from "@/components/ui/button";
import { Icon, LineIcon } from "@/components/ui/icon";
import { Cluster } from "@/components/ui/layout";
import { Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FaFacebook } from "react-icons/fa";

/* Facebook brand icon from react-icons — cast to plug into the app's
   Icon API like any LucideIcon. */
const Facebook = FaFacebook as unknown as LucideIcon;

/* DriverQuickActions — phone / LINE / Facebook icon buttons.
   Same look everywhere (offer detail, find cards). Renders nothing
   when hidden (e.g. ride is full). */
export function DriverQuickActions({
  phone,
  lineId,
  facebookUrl,
  driverName,
  hidden = false,
}: {
  phone: string;
  lineId: string;
  facebookUrl?: string;
  driverName: string;
  hidden?: boolean;
}) {
  if (hidden) return null;

  return (
    <Cluster gap="sm">
      <Button
        variant="secondary"
        size="icon"
        asChild
        className="text-ink-soft [&_svg]:size-6"
      >
        <a href={`tel:${phone.replace(/-/g, "")}`} aria-label={`โทรหา ${driverName}`}>
          <Icon icon={Phone} size="xs" />
        </a>
      </Button>
      <Button
        variant="secondary"
        size="icon"
        asChild
        className="text-ink-soft [&_svg]:size-6"
      >
        <a
          href={`https://line.me/ti/p/~${lineId}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`LINE หา ${driverName}`}
        >
          <Icon icon={LineIcon} size="xs" />
        </a>
      </Button>
      {facebookUrl && (
        <Button
          variant="secondary"
          size="icon"
          asChild
          className="text-ink-soft [&_svg]:size-6"
        >
          <a
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`ดูโปรไฟล์ Facebook ของ ${driverName}`}
          >
            <Icon icon={Facebook} size="xs" />
          </a>
        </Button>
      )}
    </Cluster>
  );
}
