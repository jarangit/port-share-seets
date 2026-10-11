"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { SearchInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cluster, Grow, Stack } from "@/components/ui/layout";
import { SearchPanel } from "@/components/ui/surface";
import { Text } from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { SegmentedControl } from "@/components/ui/controls";
import { EmptyState } from "@/components/ui/cards";
import { RideOfferCard } from "@/features/rides/components/ride-offer-card";
import { useRideOffers } from "@/features/rides/hooks/ride-offer-queries";
import {
  RIDE_SEARCH_INPUT_ID,
  SEARCH_VISIBILITY_EVENT,
  type SearchVisibilityDetail,
} from "@/lib/search-shortcut";
import type { VehicleType } from "@/features/rides/types";
import { vehicleMeta } from "@/components/atoms/badges";
import { copy } from "@/content/copy";
import { Search, CarFront, SlidersHorizontal } from "lucide-react";

type DayTab = "today" | "tomorrow";
type VehicleFilter = "all" | VehicleType;

const dayTabs: { id: DayTab; label: string }[] = [
  { id: "today", label: copy.shared.today },
  { id: "tomorrow", label: copy.shared.tomorrow },
];

const vehicleTabs: { id: VehicleFilter; label: string }[] = [
  { id: "all", label: copy.find.allVehicles },
  { id: "car", label: vehicleMeta.car.label },
  { id: "motorbike", label: vehicleMeta.motorbike.label },
];

export function RideOfferFeed() {
  const [to, setTo] = useState("");
  const [day, setDay] = useState<DayTab>("today");
  const [vehicle, setVehicle] = useState<VehicleFilter>("all");
  const [expanded, setExpanded] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  /* Tell the mobile top bar whether the search input is on screen so it
     can offer a shortcut back. Top inset matches the fixed top bar. */
  useEffect(() => {
    const el = searchRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.dispatchEvent(
          new CustomEvent<SearchVisibilityDetail>(SEARCH_VISIBILITY_EVENT, {
            detail: { visible: entry.isIntersecting },
          })
        );
      },
      { rootMargin: "-56px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filters = useMemo(() => ({ q: to, day, vehicleType: vehicle }), [to, day, vehicle]);
  const { data: results = [], isLoading, isError } = useRideOffers(filters);

  const hasQuery = to.trim() !== "" || vehicle !== "all";
  const isFiltering = day !== "today" || vehicle !== "all";

  return (
    <Stack gap="md">
      <SearchPanel>
        <Stack gap="sm">
          <Cluster gap="sm" align="center">
            <Grow>
              <SearchInput
                id={RIDE_SEARCH_INPUT_ID}
                ref={searchRef}
                icon={Search}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder={copy.find.destinationPlaceholder}
              />
            </Grow>
            <Button
              variant={expanded || isFiltering ? "default" : "secondary"}
              size="icon"
              onClick={() => setExpanded((v) => !v)}
              aria-label={expanded ? copy.find.hideFilters : copy.find.showFilters}
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
        {hasQuery
          ? copy.find.resultCountFiltered(day === "today" ? copy.shared.today : copy.shared.tomorrow, results.length)
          : copy.find.resultCount(day === "today" ? copy.shared.today : copy.shared.tomorrow, results.length)}
      </Text>

      {isLoading ? (
        <EmptyState icon={CarFront} title={copy.find.loadingTitle} hint={copy.find.loadingHint} />
      ) : isError ? (
        <EmptyState icon={CarFront} title={copy.find.errorTitle} hint={copy.find.errorHint} />
      ) : results.length === 0 ? (
        <EmptyState
          icon={CarFront}
          title={copy.find.emptyTitle}
          hint={copy.find.emptyHint}
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
                <Icon icon={Search} size="xs" /> {copy.find.clearSearch}
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
