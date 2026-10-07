"use client";
import { useMemo, useState } from "react";
import { SearchInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cluster, Grow, Stack } from "@/components/ui/layout";
import { SearchPanel } from "@/components/ui/surface";
import { Text } from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { SegmentedControl } from "@/components/ui/controls";
import { EmptyState } from "@/components/ui/cards";
import { RideOfferCard } from "@/features/rides/components/ride-offer-card";
import { rideOffers } from "@/features/rides/data/rides";
import type { VehicleType } from "@/features/rides/types";
import { vehicleMeta } from "@/components/atoms/badges";
import { Search, CarFront, SlidersHorizontal } from "lucide-react";

type DayTab = "today" | "tomorrow";
type VehicleFilter = "all" | VehicleType;

const dayTabs: { id: DayTab; label: string }[] = [
  { id: "today", label: "วันนี้" },
  { id: "tomorrow", label: "พรุ่งนี้" },
];

const vehicleTabs: { id: VehicleFilter; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "car", label: vehicleMeta.car.label },
  { id: "motorbike", label: vehicleMeta.motorbike.label },
];

export function RideOfferFeed() {
  const [to, setTo] = useState("");
  const [day, setDay] = useState<DayTab>("today");
  const [vehicle, setVehicle] = useState<VehicleFilter>("all");
  const [expanded, setExpanded] = useState(false);

  const results = useMemo(() => {
    const t = to.trim();
    return rideOffers.filter((o) => {
      if (o.seatsLeft === 0) return false;
      if (day === "today" && o.dateLabel !== "วันนี้") return false;
      if (day === "tomorrow" && o.dateLabel !== "พรุ่งนี้") return false;
      if (vehicle !== "all" && o.vehicle.type !== vehicle) return false;
      if (t && !`${o.destination} ${o.via.join(" ")}`.includes(t)) return false;
      return true;
    });
  }, [to, day, vehicle]);

  const hasQuery = to.trim() !== "" || vehicle !== "all";
  const isFiltering = day !== "today" || vehicle !== "all";

  return (
    <Stack gap="md">
      <SearchPanel>
        <Stack gap="sm">
          <Cluster gap="sm" align="center">
            <Grow>
              <SearchInput
                icon={Search}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="ปลายทางของคุณ เช่น อโศก"
              />
            </Grow>
            <Button
              variant={expanded || isFiltering ? "default" : "secondary"}
              size="icon"
              onClick={() => setExpanded((v) => !v)}
              aria-label={expanded ? "ซ่อนตัวกรอง" : "แสดงตัวกรอง"}
              aria-expanded={expanded}
            >
              <Icon icon={SlidersHorizontal} size="xs" />
            </Button>
          </Cluster>
          {expanded && (
            <>
              <SegmentedControl options={dayTabs} value={day} onChange={setDay} />
              <SegmentedControl options={vehicleTabs} value={vehicle} onChange={setVehicle} />
            </>
          )}
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
            hasQuery ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTo("");
                  setDay("today");
                  setVehicle("all");
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
