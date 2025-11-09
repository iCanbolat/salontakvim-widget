/**
 * BringingAnyoneOption Component
 * Number of people selector
 */

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Users } from "lucide-react";

interface BringingAnyoneOptionProps {
  count: number;
  maxCapacity: number;
  onCountChange: (count: number) => void;
}

export function BringingAnyoneOption({
  count,
  maxCapacity,
  onCountChange,
}: BringingAnyoneOptionProps) {
  const handleIncrement = () => {
    if (count < maxCapacity) {
      onCountChange(count + 1);
    }
  };

  const handleDecrement = () => {
    if (count > 1) {
      onCountChange(count - 1);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold">Bringing anyone with you?</h4>
            <p className="text-sm text-muted-foreground">
              Max {maxCapacity} {maxCapacity === 1 ? "person" : "people"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={count <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-semibold text-lg">{count}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrement}
            disabled={count >= maxCapacity}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
