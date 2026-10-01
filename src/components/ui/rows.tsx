import type { ReactNode } from "react";
import { Cluster } from "@/components/ui/layout";
import { Surface } from "@/components/ui/surface";
import { Icon } from "@/components/ui/icon";
import type { LucideIcon } from "lucide-react";

/* InfoRow — icon + inline content line (vehicle, meta rows) */
export function InfoRow({ icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon icon={icon} size="xs" />
      {children}
    </div>
  );
}

/* ContactRow — wash band with icon + bold contact text */
export function ContactRow({ icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <Surface tone="wash" pad="md">
      <Cluster gap="sm">
        <Icon icon={icon} size="xs" />
        {children}
      </Cluster>
    </Surface>
  );
}
