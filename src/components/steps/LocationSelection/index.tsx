/**
 * LocationSelection Component
 * Location selection step with "Any Location" option
 */

import { LocationList } from "./LocationList";
import { LocationSkeleton } from "@/components/shared";
import { useLocations } from "@/hooks";
import { useBooking, useWidget } from "@/contexts";
import type { Location } from "@/types";

export function LocationSelection() {
  const { config } = useWidget();
  const { state, selectLocation } = useBooking();
  const { data: locationsData, isLoading, error } = useLocations();

  const isRequired = config?.fieldRequirements.locationRequired || false;

  const handleSelectLocation = (location: Location) => {
    selectLocation({
      location,
      isAny: false,
    });
  };

  const handleSelectAny = () => {
    selectLocation({
      location: null,
      isAny: true,
    });
  };

  if (isLoading) {
    return <LocationSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <p className="text-destructive font-medium">
            Failed to load locations
          </p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!locationsData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          Select Location
          {!isRequired && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              (Optional)
            </span>
          )}
        </h2>
        <p className="text-muted-foreground">
          Choose your preferred location or select "Any Location"
        </p>
      </div>

      {/* Location List */}
      <LocationList
        locations={locationsData.locations}
        selectedLocationId={state.selectedLocation?.location?.id ?? null}
        isAnySelected={state.selectedLocation?.isAny ?? false}
        onSelectLocation={handleSelectLocation}
        onSelectAny={handleSelectAny}
      />
    </div>
  );
}
