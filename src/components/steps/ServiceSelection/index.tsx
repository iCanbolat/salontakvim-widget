/**
 * ServiceSelection Component
 * Main service selection step with categories and search
 */

import { useState, useMemo } from "react";
import { CategoryList } from "./CategoryList";
import { ServiceList } from "./ServiceList";
import { ServiceSearch } from "./ServiceSearch";
import { ServiceSkeleton } from "@/components/shared";
import { useServices } from "@/hooks";
import { useBooking, useWidget } from "@/contexts";
import type { Service } from "@/types";

export function ServiceSelection() {
  const { config } = useWidget();
  const { state, selectService } = useBooking();

  const selectedLocationId = state.selectedLocation?.location?.id;
  const hasLocationSelection = Boolean(state.selectedLocation);

  const {
    data: servicesData,
    isLoading,
    error,
  } = useServices(selectedLocationId, {
    enabled: hasLocationSelection,
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filter services by category and search
  const filteredServices = useMemo(() => {
    if (!servicesData) return [];

    let filtered = servicesData.services;

    // Filter by category
    if (selectedCategoryId !== null) {
      filtered = filtered.filter(
        (service) => service.categoryId === selectedCategoryId
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [servicesData, selectedCategoryId, searchQuery]);

  const handleSelectService = (service: Service) => {
    const categoryName = servicesData?.categories?.find(
      (cat) => cat.id === service.categoryId
    )?.name;

    selectService({
      service,
      categoryName,
    });
  };

  if (!hasLocationSelection) {
    return (
      <div className="flex items-center justify-center min-h-80 text-sm text-muted-foreground">
        Please select a location to see available services.
      </div>
    );
  }

  if (isLoading) {
    return <ServiceSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <p className="text-destructive font-medium">
            Failed to load services
          </p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!servicesData) {
    return null;
  }

  const currency = config?.store.currency || "USD";

  return (
    <div className="space-y-4">
      {/* Search */}
      <ServiceSearch value={searchQuery} onChange={setSearchQuery} />

      {/* Categories - Horizontal scroll on mobile */}
      <CategoryList
        categories={servicesData.categories || []}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Service List - Single column */}
      <ServiceList
        services={filteredServices}
        selectedServiceId={state.selectedService?.service.id ?? null}
        onSelectService={handleSelectService}
        currency={currency}
      />
    </div>
  );
}
