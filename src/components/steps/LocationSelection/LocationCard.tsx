/**
 * LocationCard Component
 * Displays a location with details (list style)
 */

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Location } from "@/types";

interface LocationCardProps {
  location: Location;
  isSelected?: boolean;
  onSelect: (location: Location) => void;
}

export function LocationCard({
  location,
  isSelected,
  onSelect,
}: LocationCardProps) {
  const fullAddress = [
    location.address,
    location.city,
    location.state,
    location.zipCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <button
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-all hover:border-primary/50 hover:shadow-sm",
        isSelected && "border-primary bg-primary/5"
      )}
      onClick={() => onSelect(location)}
    >
      <div className="space-y-2">
        {/* Location Name */}
        <h3 className="font-medium text-sm leading-tight">{location.name}</h3>

        {/* Address */}
        {fullAddress && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{fullAddress}</span>
          </div>
        )}
      </div>
    </button>
  );
}
