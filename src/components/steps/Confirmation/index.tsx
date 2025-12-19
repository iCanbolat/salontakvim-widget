/**
 * Confirmation Component
 * Final step to review and confirm appointment
 */

import { useState } from "react";
import { AppointmentDetails } from "./AppointmentDetails";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useBooking, useWidget } from "@/contexts";
import type { CreateAppointmentRequest } from "@/types";

export function ConfirmationStep() {
  const { config, apiService } = useWidget();
  const { state, resetBooking, prevStep } = useBooking();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appointmentId, setAppointmentId] = useState<number | null>(null);

  const currency = config?.store.currency || "USD";

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare appointment data
      const appointmentData: CreateAppointmentRequest = {
        serviceId: state.selectedService?.service.id!,
        staffId: state.selectedStaff?.staff?.id || undefined,
        locationId: state.selectedLocation?.location?.id || undefined,
        startDateTime: `${state.selectedDateTime?.date}T${state.selectedDateTime?.time}:00`,
        numberOfPeople: state.numberOfPeople?.count || 1,
        guestFirstName: state.customerInfo?.firstName!,
        guestLastName: state.customerInfo?.lastName || "",
        guestEmail: state.customerInfo?.email || "",
        guestPhone: state.customerInfo?.phone || "",
        customerNotes: state.customerInfo?.notes || "",
        extrasData: state.selectedExtras.map((extra) => ({
          extraId: extra.extra.id,
          quantity: extra.quantity,
        })),
      };

      // Call API
      if (!apiService) {
        throw new Error("API service not available");
      }
      const response = await apiService.createAppointment(appointmentData);

      setAppointmentId(response.id);
      setIsSuccess(true);

      // Optional: Clear draft from localStorage
      // StorageService.clearDraft(widgetKey);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create appointment"
      );
      console.error("Appointment creation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartNew = () => {
    resetBooking();
    setIsSuccess(false);
    setError(null);
    setAppointmentId(null);
  };

  // Success state
  if (isSuccess && appointmentId) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Appointment Confirmed!</h2>
            <p className="text-muted-foreground">
              Your appointment has been successfully booked
            </p>
            <p className="text-sm text-muted-foreground">
              Appointment ID:{" "}
              <span className="font-mono font-semibold">#{appointmentId}</span>
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <AppointmentDetails appointment={state} currency={currency} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button variant="outline" onClick={handleStartNew}>
            Book Another Appointment
          </Button>
          {config?.settings.redirectUrlAfterBooking && (
            <Button
              onClick={() => {
                window.location.href = config.settings.redirectUrlAfterBooking!;
              }}
            >
              Continue
            </Button>
          )}
        </div>

        {config?.showCompanyEmail && config?.companyEmail && (
          <p className="text-sm text-center text-muted-foreground">
            Questions? Contact us at{" "}
            <a
              href={`mailto:${config.companyEmail}`}
              className="text-primary hover:underline"
            >
              {config.companyEmail}
            </a>
          </p>
        )}
      </div>
    );
  }

  // Review & Confirm state
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Review & Confirm</h2>
        <p className="text-muted-foreground">
          Please review your appointment details before confirming
        </p>
      </div>

      {/* Appointment Details */}
      <div className="max-w-2xl mx-auto">
        <AppointmentDetails appointment={state} currency={currency} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
          Go Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Confirming...</span>
            </>
          ) : (
            "Confirm Appointment"
          )}
        </Button>
      </div>

      {/* Terms Note */}
      <div className="space-y-2 text-center max-w-md mx-auto">
        <p className="text-xs text-muted-foreground">
          By confirming this appointment, you agree to our terms and conditions.
          You will receive a confirmation email with appointment details.
        </p>
        {config?.showCompanyEmail && config?.companyEmail && (
          <p className="text-xs text-muted-foreground">
            For questions, contact us at{" "}
            <a
              href={`mailto:${config.companyEmail}`}
              className="text-primary hover:underline"
            >
              {config.companyEmail}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
