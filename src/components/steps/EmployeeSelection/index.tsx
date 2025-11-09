/**
 * EmployeeSelection Component
 * Staff selection step with "Any Employee" option
 */

import { useEffect } from "react";
import { EmployeeList } from "./EmployeeList";
import { StaffSkeleton } from "@/components/shared";
import { useStaff } from "@/hooks";
import { useBooking, useWidget } from "@/contexts";
import type { Staff } from "@/types";

export function EmployeeSelection() {
  const { config } = useWidget();
  const { state, selectStaff } = useBooking();
  const { data: staffData, isLoading, error } = useStaff();

  const isRequired = config?.fieldRequirements.employeeRequired || false;

  const handleSelectStaff = (staff: Staff) => {
    selectStaff({
      staff,
      isAny: false,
    });
  };

  const handleSelectAny = () => {
    selectStaff({
      staff: null,
      isAny: true,
    });
  };

  // Auto-select "Any Employee" if not required and nothing selected
  useEffect(() => {
    if (!isRequired && !state.selectedStaff && staffData?.staff.length) {
      handleSelectAny();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRequired, staffData]);

  if (isLoading) {
    return <StaffSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <p className="text-destructive font-medium">Failed to load staff</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!staffData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          Select Staff Member
          {!isRequired && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              (Optional)
            </span>
          )}
        </h2>
        <p className="text-muted-foreground">
          Choose your preferred staff member or select "Any Employee"
        </p>
      </div>

      {/* Staff List */}
      <EmployeeList
        staff={staffData.staff}
        selectedStaffId={state.selectedStaff?.staff?.id ?? null}
        isAnySelected={state.selectedStaff?.isAny ?? false}
        onSelectStaff={handleSelectStaff}
        onSelectAny={handleSelectAny}
      />
    </div>
  );
}
