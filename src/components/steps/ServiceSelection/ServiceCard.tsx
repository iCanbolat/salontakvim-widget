/**
 * ServiceCard Component
 * Displays a single service with details
 */

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, formatDuration } from "@/utils";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
  isSelected?: boolean;
  onSelect: (service: Service) => void;
  currency: string;
}

export function ServiceCard({
  service,
  isSelected,
  onSelect,
  currency,
}: ServiceCardProps) {
  return (
    <button
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-all hover:border-primary/50 hover:shadow-sm",
        isSelected && "border-primary bg-primary/5"
      )}
      onClick={() => onSelect(service)}
    >
      <div className="space-y-2">
        {/* Service Name & Price */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium text-sm leading-tight line-clamp-2 flex-1">
            {service.name}
          </h3>
          <div className="font-semibold text-sm whitespace-nowrap">
            {formatPrice(service.price, currency)}
          </div>
        </div>

        {/* Description */}
        {service.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {service.description}
          </p>
        )}

        {/* Duration */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDuration(service.duration)}</span>
        </div>
      </div>
    </button>
  );
}
