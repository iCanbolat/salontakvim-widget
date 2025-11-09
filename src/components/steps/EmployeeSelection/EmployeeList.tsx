/**
 * EmployeeList Component
 * Grid display of employee cards with "Any" option
 */

import { EmployeeCard } from "./EmployeeCard";
import { AnyEmployeeOption } from "./AnyEmployeeOption";
import { EmptyState } from "@/components/shared";
import { UserX } from "lucide-react";
import type { Staff } from "@/types";

interface EmployeeListProps {
  staff: Staff[];
  selectedStaffId: number | null;
  isAnySelected: boolean;
  onSelectStaff: (staff: Staff) => void;
  onSelectAny: () => void;
}

export function EmployeeList({
  staff,
  selectedStaffId,
  isAnySelected,
  onSelectStaff,
  onSelectAny,
}: EmployeeListProps) {
  if (staff.length === 0) {
    return (
      <EmptyState
        icon={<UserX className="h-10 w-10" />}
        title="No staff available"
        description="No staff members are available for the selected service."
      />
    );
  }

  return (
    <div className="space-y-2">
      {/* Any Employee Option - First */}
      <AnyEmployeeOption isSelected={isAnySelected} onSelect={onSelectAny} />

      {/* Staff Members */}
      {staff.map((member) => (
        <EmployeeCard
          key={member.id}
          staff={member}
          isSelected={member.id === selectedStaffId}
          onSelect={onSelectStaff}
        />
      ))}
    </div>
  );
}
