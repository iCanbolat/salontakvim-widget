/**
 * AppointmentDetails Component
 * Displays complete appointment information with compact, modern design
 */

import { Card } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import { formatDateLong, formatTime12Hour, formatPrice } from "@/utils";
import type { AppointmentState } from "@/types";

interface AppointmentDetailsProps {
  appointment: AppointmentState;
  currency: string;
  priceBreakdown?: {
    subtotal: number;
    discount: number;
    total: number;
  };
}

export function AppointmentDetails({
  appointment,
  currency,
  priceBreakdown,
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
    0,
  );
  const totalPrice = servicePrice + extrasPrice;

  // Calculate total duration
  const serviceDuration = selectedService?.service.duration || 0;
  const extrasDuration = selectedExtras.reduce(
    (sum, extra) => sum + extra.extra.duration * extra.quantity,
    0,
  );
  const totalDuration = serviceDuration + extrasDuration;

  const subtotal = priceBreakdown?.subtotal ?? totalPrice;
  const discount = priceBreakdown?.discount ?? 0;
  const total = priceBreakdown?.total ?? totalPrice;

  return (
    <Card className="overflow-hidden">
      {/* Service Section */}
      <div className="bg-muted/30 px-4 py-3 border-b">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">
              {selectedService?.service.name}
            </h3>
            {selectedService?.categoryName && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedService.categoryName}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="font-semibold text-base">
              {formatPrice(servicePrice, currency)}
            </p>
            <p className="text-xs text-muted-foreground">
              {serviceDuration} min
            </p>
          </div>
        </div>
      </div>

      {/* Extras Section */}
      {selectedExtras.length > 0 && (
        <div className="px-4 py-3 border-b bg-muted/10">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Extras
          </p>
          <div className="space-y-2">
            {selectedExtras.map((extra) => (
              <div
                key={extra.extra.id}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <span className="flex-1 min-w-0 truncate">
                  {extra.extra.name} ×{extra.quantity}
                </span>
                <div className="text-right shrink-0">
                  <span className="font-medium">
                    {formatPrice(extra.extra.price * extra.quantity, currency)}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    +{extra.extra.duration * extra.quantity}min
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointment Details */}
      <div className="px-4 py-3 space-y-2.5">
        {/* Date & Time */}
        {selectedDateTime && (
          <>
            <div className="flex items-center gap-2.5 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="font-medium">
                {formatDateLong(selectedDateTime.date)}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="font-medium">
                {formatTime12Hour(selectedDateTime.time)}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{totalDuration} min</span>
            </div>
          </>
        )}

        {/* Staff */}
        {selectedStaff && (
          <div className="flex items-center gap-2.5 text-sm">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-medium">
                {selectedStaff.isAny
                  ? "Any Available Staff"
                  : selectedStaff.staff?.name}
              </span>
              {selectedStaff.staff?.title && (
                <span className="text-muted-foreground ml-1.5">
                  • {selectedStaff.staff.title}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Location */}
        {selectedLocation && (
          <div className="flex items-start gap-2.5 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">
                {selectedLocation.isAny
                  ? "Any Available Location"
                  : selectedLocation.location?.name}
              </p>
              {selectedLocation.location?.address && (
                <p className="text-muted-foreground text-xs mt-0.5">
                  {selectedLocation.location.address}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Customer Info */}
      {customerInfo && (
        <div className="px-4 py-3 border-t bg-muted/10">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Contact Information
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-sm">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="font-medium">
                {customerInfo.firstName} {customerInfo.lastName}
              </span>
            </div>
            {customerInfo.email && (
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate">{customerInfo.email}</span>
              </div>
            )}
            {customerInfo.phone && (
              <div className="flex items-center gap-2.5 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{customerInfo.phone}</span>
              </div>
            )}
            {numberOfPeople && numberOfPeople.count > 1 && (
              <div className="flex items-center gap-2.5 text-sm">
                <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>
                  <span className="font-medium">{numberOfPeople.count}</span>
                  <span className="text-muted-foreground ml-1">people</span>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing Summary */}
      <div className="px-4 py-3 border-t bg-muted/30">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">
              {formatPrice(subtotal, currency)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between text-sm text-emerald-600">
              <span className="font-medium">Discount</span>
              <span className="font-semibold">
                -{formatPrice(discount, currency)}
              </span>
            </div>
          )}
          <div className="h-px bg-border my-2" />
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-xl">
              {formatPrice(total, currency)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
