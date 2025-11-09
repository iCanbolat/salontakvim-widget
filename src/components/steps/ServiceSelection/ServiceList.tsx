/**
 * ServiceList Component
 * Grid display of service cards
 */

import { ServiceCard } from "./ServiceCard";
import { EmptyState } from "@/components/shared";
import { Inbox } from "lucide-react";
import type { Service } from "@/types";

interface ServiceListProps {
  services: Service[];
  selectedServiceId: number | null;
  onSelectService: (service: Service) => void;
  currency: string;
}

export function ServiceList({
  services,
  selectedServiceId,
  onSelectService,
  currency,
}: ServiceListProps) {
  if (services.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="h-10 w-10" />}
        title="No services found"
        description="Try selecting a different category or search term."
      />
    );
  }

  return (
    <div className="space-y-2">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          isSelected={service.id === selectedServiceId}
          onSelect={onSelectService}
          currency={currency}
        />
      ))}
    </div>
  );
}
