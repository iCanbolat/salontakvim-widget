/**
 * ExtrasList Component
 * Grid display of extra cards
 */

import { ExtraCard } from "./ExtraCard";
import { EmptyState } from "@/components/shared";
import { Package } from "lucide-react";
import type { ServiceExtra } from "@/types";

interface ExtrasListProps {
  extras: ServiceExtra[];
  quantities: Record<string, number>;
  onQuantityChange: (extraId: string, quantity: number) => void;
  currency: string;
}

export function ExtrasList({
  extras,
  quantities,
  onQuantityChange,
  currency,
}: ExtrasListProps) {
  if (extras.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-10 w-10" />}
        title="No extras available"
        description="No additional extras are available for this service."
      />
    );
  }

  return (
    <div className="space-y-2">
      {extras.map((extra) => (
        <ExtraCard
          key={extra.id}
          extra={extra}
          quantity={quantities[extra.id] || 0}
          onQuantityChange={onQuantityChange}
          currency={currency}
        />
      ))}
    </div>
  );
}
