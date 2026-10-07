"use client";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/layout";
import { SearchPanel } from "@/components/ui/surface";
import { Text } from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { SegmentedControl } from "@/components/ui/controls";
import { EmptyState } from "@/components/ui/cards";
import { RideOfferCard } from "@/components/molecules/ride-offer-card";
import { rideOffers } from "@/data/rides";
import { Search, CarFront } from "lucide-react";

type DayTab = "today" | "tomorrow";

const dayTabs: { id: DayTab; label: string }[] = [
  { id: "today", label: "วันนี้" },
  { id: "tomorrow", label: "พรุ่งนี้" },
];

export function RideOfferFeed() {
  const [to, setTo] = useState("");
  const [day, setDay] = useState<DayTab>("today");

  const results = useMemo(() => {
    const t = to.trim();
    return rideOffers.filter((o) => {
      if (o.seatsLeft === 0) return false;
      if (day === "today" && o.dateLabel !== "วันนี้") return false;
      if (day === "tomorrow" && o.dateLabel !== "พรุ่งนี้") return false;
      if (t && !`${o.destination} ${o.via.join(" ")}`.includes(t)) return false;
      return true;
    });
  }, [to, day]);

  const hasQuery = to.trim() !== "";

  return (
    <Stack gap="md">
      <SearchPanel>
        <Stack gap="sm">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <Icon icon={Search} size="xs" tone="faint" />
            </span>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="ปลายทางของคุณ เช่น อโศก"
              className="pl-11"
            />
          </div>
          <SegmentedControl options={dayTabs} value={day} onChange={setDay} />
        </Stack>
      </SearchPanel>

      <Text size="caption" tone="muted" weight="semibold">
        {day === "today" ? "วันนี้" : "พรุ่งนี้"} •{" "}
        {hasQuery ? `มีรถที่ไปทางนั้น ${results.length} คัน` : `มีรถ ${results.length} คัน`}
      </Text>

      {results.length === 0 ? (
        <EmptyState
          icon={CarFront}
          title="ยังไม่มีรถตรงกับทางที่ค้นหา"
          hint="ลองค้นหาปลายทางใกล้เคียงอีกครั้ง"
          action={
            to ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTo("");
                  setDay("today");
                }}
              >
                <Icon icon={Search} size="xs" /> ล้างการค้นหา
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Stack gap="lg">
          {results.map((o) => (
            <RideOfferCard key={o.id} offer={o} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
