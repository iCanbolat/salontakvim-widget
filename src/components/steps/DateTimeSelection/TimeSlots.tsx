/**
 * TimeSlots Component
 * Grid of available time slots
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatTime12Hour } from "@/utils";
import type { TimeSlot } from "@/types";

interface TimeSlotsProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

export function TimeSlots({
  slots,
  selectedTime,
  onSelectTime,
}: TimeSlotsProps) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No available time slots for this date
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">
      {slots.map((slot) => (
        <Button
          key={slot.startTime}
          variant={selectedTime === slot.startTime ? "default" : "outline"}
          size="sm"
          disabled={!slot.available}
          onClick={() => slot.available && onSelectTime(slot.startTime)}
          className={cn(
            "h-9 min-w-18",
            !slot.available && "opacity-40 cursor-not-allowed",
          )}
        >
          {formatTime12Hour(slot.startTime)}
        </Button>
      ))}
    </div>
  );
}
