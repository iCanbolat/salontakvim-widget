/**
 * AnyLocationOption Component
 * Special option for "Any Location" selection (list style)
 */

import { MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnyLocationOptionProps {
  isSelected: boolean;
  onSelect: () => void;
}

export function AnyLocationOption({
  isSelected,
  onSelect,
}: AnyLocationOptionProps) {
  return (
    <button
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-all hover:border-primary/50 hover:shadow-sm",
        isSelected && "border-primary bg-primary/5"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
          <MapPinned className="h-6 w-6 text-primary" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm leading-tight">Any Location</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            No preference - First available
          </p>
        </div>
      </div>
    </button>
  );
}
