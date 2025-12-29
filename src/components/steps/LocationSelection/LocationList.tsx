/**
 * LocationList Component
 * Grid display of location cards with "Any" option
 */

import { LocationCard } from "./LocationCard";
import { AnyLocationOption } from "./AnyLocationOption";
import { EmptyState } from "@/components/shared";
import { MapPin } from "lucide-react";
import type { Location } from "@/types";

interface LocationListProps {
  locations: Location[];
  selectedLocationId: string | null;
  isAnySelected: boolean;
  onSelectLocation: (location: Location) => void;
  onSelectAny: () => void;
}

export function LocationList({
  locations,
  selectedLocationId,
  isAnySelected,
  onSelectLocation,
  onSelectAny,
}: LocationListProps) {
  if (locations.length === 0) {
    return (
      <EmptyState
        icon={<MapPin className="h-10 w-10" />}
        title="No locations available"
        description="No locations are available for the selected service."
      />
    );
  }

  return (
    <div className="space-y-2" role="radiogroup" aria-label="Select a location">
      {/* Any Location Option - First */}
      <AnyLocationOption isSelected={isAnySelected} onSelect={onSelectAny} />

      {/* Locations */}
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
          isSelected={location.id === selectedLocationId}
          onSelect={onSelectLocation}
        />
      ))}
    </div>
  );
}
