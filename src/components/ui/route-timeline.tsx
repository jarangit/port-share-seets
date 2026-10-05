import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/typography";

/* RouteTimeline — origin → via → destination rail */
export function RouteTimeline({ points }: { points: string[] }) {
  return (
    <div>
      {points.map((p, i, arr) => (
        <div key={p} className="flex gap-4">
          <div className="flex flex-col">
            <span
              className={cn(
                " h-4 w-4 shrink-0 rounded-full",
                i === 0 ? "bg-brand-primary" : i === arr.length - 1 ? "bg-success" : "bg-border"
              )}
            />
            {i < arr.length - 1 && <span className="my-2 w-1 flex-1 bg-border" />}
          </div>
          <div >
            <Text size="body" weight="semibold">
              {p}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
}
