/**
 * AppointmentDetails Component
 * Displays complete appointment information
 */

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, User, DollarSign } from "lucide-react";
import { formatDateLong, formatTime12Hour, formatPrice } from "@/utils";
import type { AppointmentState } from "@/types";

interface AppointmentDetailsProps {
  appointment: AppointmentState;
  currency: string;
}

export function AppointmentDetails({
  appointment,
  currency,
}: AppointmentDetailsProps) {
  const {
    selectedService,
    selectedStaff,
    selectedLocation,
    selectedDateTime,
    selectedExtras,
    customerInfo,
    numberOfPeople,
  } = appointment;

  // Calculate total price
  const servicePrice = selectedService?.service.price || 0;
  const extrasPrice = selectedExtras.reduce(
    (sum, extra) => sum + extra.extra.price * extra.quantity,
    0
  );
  const totalPrice = servicePrice + extrasPrice;

  // Calculate total duration
  const serviceDuration = selectedService?.service.duration || 0;
  const extrasDuration = selectedExtras.reduce(
    (sum, extra) => sum + extra.extra.duration * extra.quantity,
    0
  );
  const totalDuration = serviceDuration + extrasDuration;

  return (
    <Card className="p-6 space-y-6">
      {/* Service */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Service</h3>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{selectedService?.service.name}</p>
            {selectedService?.categoryName && (
              <p className="text-sm text-muted-foreground">
                {selectedService.categoryName}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="font-medium">{formatPrice(servicePrice, currency)}</p>
            <p className="text-sm text-muted-foreground">
              {serviceDuration} min
            </p>
          </div>
        </div>
      </div>

      {/* Extras */}
      {selectedExtras.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Extras</h3>
            {selectedExtras.map((extra) => (
              <div
                key={extra.extra.id}
                className="flex items-start justify-between"
              >
                <div>
                  <p className="font-medium">
                    {extra.extra.name} x{extra.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatPrice(extra.extra.price * extra.quantity, currency)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    +{extra.extra.duration * extra.quantity} min
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Separator />

      {/* Date & Time */}
      <div className="space-y-3">
        {selectedDateTime && (
          <>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {formatDateLong(selectedDateTime.date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {formatTime12Hour(selectedDateTime.time)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Duration: {totalDuration} minutes
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Staff */}
      {selectedStaff && (
        <>
          <Separator />
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {selectedStaff.isAny
                  ? "Any Available Staff"
                  : selectedStaff.staff?.name}
              </p>
              {selectedStaff.staff?.title && (
                <p className="text-sm text-muted-foreground">
                  {selectedStaff.staff.title}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Location */}
      {selectedLocation && (
        <>
          <Separator />
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {selectedLocation.isAny
                  ? "Any Available Location"
                  : selectedLocation.location?.name}
              </p>
              {selectedLocation.location?.address && (
                <p className="text-sm text-muted-foreground">
                  {selectedLocation.location.address}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Customer Info */}
      {customerInfo && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Your Information</h3>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-muted-foreground">Name:</span>{" "}
                <span className="font-medium">
                  {customerInfo.firstName} {customerInfo.lastName}
                </span>
              </p>
              {customerInfo.email && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Email:</span>{" "}
                  <span className="font-medium">{customerInfo.email}</span>
                </p>
              )}
              {customerInfo.phone && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  <span className="font-medium">{customerInfo.phone}</span>
                </p>
              )}
              {numberOfPeople && numberOfPeople.count > 1 && (
                <p className="text-sm">
                  <span className="text-muted-foreground">
                    Number of People:
                  </span>{" "}
                  <span className="font-medium">{numberOfPeople.count}</span>
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Total */}
      <Separator />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold text-lg">Total</span>
        </div>
        <span className="font-bold text-2xl">
          {formatPrice(totalPrice, currency)}
        </span>
      </div>
    </Card>
  );
}
