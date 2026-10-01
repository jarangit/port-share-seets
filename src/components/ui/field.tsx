import type { ReactNode } from "react";
import { Text } from "@/components/ui/typography";

/* Field — form label + control pair */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2">
        <Text as="label" size="caption" weight="bold" tone="soft">
          {label}
        </Text>
      </div>
      {children}
    </div>
  );
}
