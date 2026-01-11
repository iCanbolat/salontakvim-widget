/**
 * ExtraCard Component
 * Displays a service extra with quantity selector (list style)
 */

import { Button } from "@/components/ui/button";
import { Minus, Plus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, formatDuration } from "@/utils";
import type { ServiceExtra } from "@/types";

interface ExtraCardProps {
  extra: ServiceExtra;
  quantity: number;
  onQuantityChange: (extraId: string, quantity: number) => void;
  currency: string;
}

export function ExtraCard({
  extra,
  quantity,
  onQuantityChange,
  currency,
}: ExtraCardProps) {
  const isSelected = quantity > 0;

  const handleIncrement = () => {
    if (quantity < extra.maxQuantity) {
      onQuantityChange(extra.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(extra.id, quantity - 1);
    }
  };

  return (
    <div
      className={cn(
        "p-3 rounded-lg border transition-all",
        isSelected && "border-primary bg-primary/5"
      )}
    >
      <div className="space-y-2.5">
        {/* Header - Name & Price */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-tight">{extra.name}</h3>
            {extra.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {extra.description}
              </p>
            )}
          </div>
          <div className="font-semibold text-sm whitespace-nowrap">
            {formatPrice(extra.price, currency)}
          </div>
        </div>

        {/* Duration & Quantity Selector */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>+{formatDuration(extra.duration)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleDecrement}
              disabled={quantity === 0}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="w-6 text-center text-sm font-medium">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleIncrement}
              disabled={quantity >= extra.maxQuantity}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Total Price for selected quantity */}
        {isSelected && (
          <div className="pt-2 border-t flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-semibold">
              {formatPrice(extra.price * quantity, currency)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
