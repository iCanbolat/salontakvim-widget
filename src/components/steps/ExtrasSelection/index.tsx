/**
 * ExtrasSelection Component
 * Service extras selection with quantity control
 */

import { useState, useEffect } from "react";
import { ExtrasList } from "./ExtrasList";
import { LoadingSpinner } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWidget, useBooking } from "@/contexts";
import { formatPrice, calculateTotal } from "@/utils";
import type { ServiceExtra, SelectedExtra } from "@/types";

export function ExtrasSelection() {
  const { config } = useWidget();
  const { state, addExtra, clearExtras } = useBooking();

  // Mock extras data - In real app, fetch from API based on selected service
  const [extras] = useState<ServiceExtra[]>([
    {
      id: 1,
      serviceId: state.selectedService?.service.id || 0,
      name: "Deep Conditioning Treatment",
      description: "Intensive moisture treatment for dry and damaged hair",
      price: 25,
      duration: 15,
      maxQuantity: 1,
      position: 1,
    },
    {
      id: 2,
      serviceId: state.selectedService?.service.id || 0,
      name: "Scalp Massage",
      description: "Relaxing scalp massage to improve circulation",
      price: 15,
      duration: 10,
      maxQuantity: 2,
      position: 2,
    },
    {
      id: 3,
      serviceId: state.selectedService?.service.id || 0,
      name: "Hair Styling",
      description: "Professional blow-dry and styling",
      price: 30,
      duration: 20,
      maxQuantity: 1,
      position: 3,
    },
  ]);

  const [isLoading] = useState(false);

  // Initialize quantities from context
  const [quantities, setQuantities] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    state.selectedExtras.forEach((selectedExtra) => {
      initial[selectedExtra.extra.id] = selectedExtra.quantity;
    });
    return initial;
  });

  const handleQuantityChange = (extraId: number, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [extraId]: quantity,
    }));
  };

  // Calculate totals
  const selectedExtras: SelectedExtra[] = extras
    .filter((extra) => quantities[extra.id] > 0)
    .map((extra) => ({
      extra,
      quantity: quantities[extra.id],
    }));

  const totalExtraPrice = calculateTotal(
    selectedExtras.map((se) => se.extra.price * se.quantity)
  );

  const totalExtraDuration = selectedExtras.reduce(
    (sum, se) => sum + se.extra.duration * se.quantity,
    0
  );

  const currency = config?.store.currency || "USD";

  // Update context when quantities change
  useEffect(() => {
    // Use addExtra/removeExtra/clearExtras from BookingContext
    selectedExtras.forEach((se) => {
      addExtra(se);
    });
  }, [JSON.stringify(quantities)]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading extras..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          Add Extras
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            (Optional)
          </span>
        </h2>
        <p className="text-muted-foreground">
          Enhance your service with additional treatments
        </p>
      </div>

      {/* Extras List */}
      <ExtrasList
        extras={extras}
        quantities={quantities}
        onQuantityChange={handleQuantityChange}
        currency={currency}
      />

      {/* Summary */}
      {selectedExtras.length > 0 && (
        <>
          <Separator />
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <h3 className="font-semibold">Selected Extras Summary</h3>
            <div className="space-y-2">
              {selectedExtras.map((se) => (
                <div
                  key={se.extra.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {se.extra.name} x{se.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(se.extra.price * se.quantity, currency)}
                  </span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <div className="space-y-1">
                <div>Total Extras Price</div>
                <div className="text-xs text-muted-foreground font-normal">
                  +{totalExtraDuration} minutes
                </div>
              </div>
              <div className="text-lg">
                {formatPrice(totalExtraPrice, currency)}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Skip Button */}
      <div className="flex justify-end">
        <Button
          variant={selectedExtras.length > 0 ? "outline" : "default"}
          onClick={() => clearExtras()}
        >
          {selectedExtras.length > 0 ? "Clear All" : "Skip Extras"}
        </Button>
      </div>
    </div>
  );
}
