/**
 * DateTimeSelection Component
 * Date and time picker with availability
 */

import { useState, useEffect, useMemo } from "react";
import { Calendar as DatePickerCalendar } from "@/components/ui/calendar";
import { TimeSlots } from "./TimeSlots";
import { BringingAnyoneOption } from "./BringingAnyoneOption";
import { LoadingSpinner } from "@/components/shared";
import { useAvailability } from "@/hooks";
import { useBooking, useWidget } from "@/contexts";
import { formatDateISO, formatDateLong } from "@/utils";
import { Calendar as CalendarIcon } from "lucide-react";

export function DateTimeSelection() {
  const { state, selectDateTime, clearDateTime, setNumberOfPeople } =
    useBooking();
  const { apiService } = useWidget();

  const serviceId = state.selectedService?.service.id;
  const locationId = state.selectedLocation?.location?.id;
  const extrasDurationMinutes = state.selectedExtras.reduce(
    (sum, extra) => sum + extra.extra.duration * extra.quantity,
    0,
  );

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    state.selectedDateTime?.date
      ? new Date(state.selectedDateTime.date)
      : undefined,
  );

  const serviceCapacity = state.selectedService?.service.capacity || 1;
  const showBringingAnyone = serviceCapacity > 1;

  // Get staffId - if "any employee" selected, fetch first available staff
  const [firstStaffId, setFirstStaffId] = useState<string | undefined>();

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
    extrasDurationMinutes,
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
    extrasDurationMinutes,
    enabled: !!selectedDate && !!state.selectedService && !!staffId,
  });

  // Disable time slots that are already in the past when the selected date is today
  const filteredSlots = useMemo(() => {
    if (!availabilityData?.slots) return [];

    const isToday = selectedDate
      ? selectedDate.toDateString() === new Date().toDateString()
      : false;

    if (!isToday) return availabilityData.slots;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return availabilityData.slots.map((slot) => {
      const [hour, minute] = slot.startTime.split(":").map(Number);
      const slotMinutes = hour * 60 + minute;
      const isPast = slotMinutes <= currentMinutes;

      return {
        ...slot,
        available: slot.available && !isPast,
      };
    });
  }, [availabilityData?.slots, selectedDate]);

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
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Select Date</h2>
        <p className="text-muted-foreground">
          Choose your preferred Date and Time slot
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8">
        {/* Calendar */}
        <div className="flex flex-col items-center lg:items-start">
          <DatePickerCalendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={disabledDates}
            className="rounded-md border shadow-sm"
          />
        </div>

        {/* Time Slots */}
        <div className="flex flex-col min-h-0">
          {selectedDate ? (
            <div className="flex flex-col h-full">
              <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {formatDateLong(selectedDate)}
              </h3>

              <div className="flex-1 min-h-[200px]">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner text="Loading times..." />
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-destructive font-medium">
                        Failed to load availability
                      </p>
                      <p className="text-xs text-muted-foreground">{error}</p>
                    </div>
                  </div>
                ) : availabilityData && availabilityData.slots.length > 0 ? (
                  <TimeSlots
                    slots={filteredSlots}
                    selectedTime={state.selectedDateTime?.time || null}
                    onSelectTime={handleTimeSelect}
                  />
                ) : availabilityData ? (
                  <div className="flex items-center justify-center py-12">
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
                  <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                    Unable to load availability
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full border-2 border-dashed rounded-lg p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <CalendarIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-muted-foreground">
                Select a date
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Please pick a date from the calendar to see available time slots
              </p>
            </div>
          )}
        </div>
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
