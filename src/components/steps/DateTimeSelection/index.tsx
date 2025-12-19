/**
 * DateTimeSelection Component
 * Date and time picker with availability
 */

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlots } from "./TimeSlots";
import { BringingAnyoneOption } from "./BringingAnyoneOption";
import { LoadingSpinner } from "@/components/shared";
import { useAvailability } from "@/hooks";
import { useBooking, useWidget } from "@/contexts";
import { formatDateISO, formatDateLong } from "@/utils";

export function DateTimeSelection() {
  const { state, selectDateTime, clearDateTime, setNumberOfPeople } =
    useBooking();
  const { apiService } = useWidget();

  const serviceId = state.selectedService?.service.id;
  const locationId = state.selectedLocation?.location?.id;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    state.selectedDateTime?.date
      ? new Date(state.selectedDateTime.date)
      : undefined
  );

  const serviceCapacity = state.selectedService?.service.capacity || 1;
  const showBringingAnyone = serviceCapacity > 1;

  // Get staffId - if "any employee" selected, fetch first available staff
  const [firstStaffId, setFirstStaffId] = useState<number | undefined>();

  useEffect(() => {
    // Reset cached fallback staff when service or location changes
    setFirstStaffId(undefined);
  }, [serviceId, locationId]);

  useEffect(() => {
    // If "any employee" is selected, fetch first available staff
    if (
      state.selectedStaff?.isAny &&
      !firstStaffId &&
      apiService &&
      serviceId
    ) {
      apiService
        .getStaff(serviceId, locationId)
        .then((response) => {
          if (response.staff && response.staff.length > 0) {
            setFirstStaffId(response.staff[0].id);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch staff for availability:", error);
        });
    }
  }, [
    state.selectedStaff?.isAny,
    serviceId,
    locationId,
    apiService,
    firstStaffId,
  ]);

  const staffId =
    state.selectedStaff?.staff?.id ||
    (state.selectedStaff?.isAny ? firstStaffId : undefined);

  console.log("DateTimeSelection - Debug:", {
    selectedDate,
    serviceId: state.selectedService?.service.id,
    staffId,
    isAnyEmployee: state.selectedStaff?.isAny,
    firstStaffId,
    hasStaff: !!state.selectedStaff,
  });

  // Fetch availability for selected date
  const {
    availability: availabilityData,
    isLoading,
    error,
  } = useAvailability({
    serviceId,
    staffId: staffId,
    date: selectedDate ? formatDateISO(selectedDate) : undefined,
    locationId,
    enabled: !!selectedDate && !!state.selectedService && !!staffId,
  });

  console.log("Availability result:", { availabilityData, isLoading, error });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    // Clear selected time when date changes
    if (
      state.selectedDateTime?.date !== (date ? formatDateISO(date) : undefined)
    ) {
      clearDateTime();
    }
  };

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) return;

    selectDateTime({
      date: formatDateISO(selectedDate),
      time,
      isRecurring: false,
    });
  };

  const handlePeopleCountChange = (count: number) => {
    setNumberOfPeople({
      count,
      maxCapacity: serviceCapacity,
    });
  };

  // Disable past dates
  const disabledDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {/* Calendar */}
        <div>
          <h3 className="text-sm font-medium mb-2">Pick a Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={disabledDates}
            className="rounded-md border mx-auto"
          />
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div>
            <h3 className="text-sm font-medium mb-2">
              {formatDateLong(selectedDate)}
            </h3>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner text="Loading times..." />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <p className="text-sm text-destructive font-medium">
                    Failed to load availability
                  </p>
                  <p className="text-xs text-muted-foreground">{error}</p>
                </div>
              </div>
            ) : availabilityData && availabilityData.slots.length > 0 ? (
              <TimeSlots
                slots={availabilityData.slots}
                selectedTime={state.selectedDateTime?.time || null}
                onSelectTime={handleTimeSelect}
              />
            ) : availabilityData ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    No time slots available
                  </p>
                  <p className="text-xs text-muted-foreground">
                    The selected staff member is not available on this date.
                    {state.selectedStaff?.isAny && (
                      <> Try selecting a specific staff member.</>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                Unable to load availability
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bringing Anyone Option */}
      {showBringingAnyone && state.selectedDateTime && (
        <BringingAnyoneOption
          count={state.numberOfPeople?.count || 1}
          maxCapacity={serviceCapacity}
          onCountChange={handlePeopleCountChange}
        />
      )}
    </div>
  );
}
