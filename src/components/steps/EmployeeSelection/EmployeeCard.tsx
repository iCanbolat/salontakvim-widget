/**
 * EmployeeCard Component
 * Displays a staff member with details (list style)
 */

import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Staff } from "@/types";

interface EmployeeCardProps {
  staff: Staff;
  isSelected?: boolean;
  onSelect: (staff: Staff) => void;
}

export function EmployeeCard({
  staff,
  isSelected,
  onSelect,
}: EmployeeCardProps) {
  console.log(staff);
  
  return (
    <button
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-all hover:border-primary/50 hover:shadow-sm",
        isSelected && "border-primary bg-primary/5"
      )}
      onClick={() => onSelect(staff)}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        {staff.avatar ? (
          <img
            src={staff.avatar}
            alt={staff.name}
            className="h-12 w-12 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted shrink-0">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm leading-tight">{staff.name}</h3>
          {staff.title && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {staff.title}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
