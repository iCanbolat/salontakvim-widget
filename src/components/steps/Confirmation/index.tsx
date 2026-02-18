/**
 * Confirmation Component
 * Final step to review and confirm appointment
 */

import { useMemo } from "react";
import { AppointmentDetails } from "./AppointmentDetails";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useBooking, useWidget } from "@/contexts";

interface ConfirmationStepProps {
  isSuccess: boolean;
  isProcessing?: boolean;
  publicNumber: string | null;
  error: string | null;
  onStartNew: () => void;
}

export function ConfirmationStep({
  isSuccess,
  isProcessing = false,
  publicNumber,
  error,
  onStartNew,
}: ConfirmationStepProps) {
  const { config } = useWidget();
  const { state, getPriceBreakdown } = useBooking();

  const currency = config?.store.currency || "USD";
  const priceBreakdown = useMemo(
    () => getPriceBreakdown(),
    [getPriceBreakdown],
  );
  // Success state
  if (isSuccess && publicNumber) {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-3 py-5">
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
              <span className="font-mono font-semibold">#{publicNumber}</span>
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <AppointmentDetails
            appointment={state}
            currency={currency}
            priceBreakdown={priceBreakdown}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button variant="outline" onClick={onStartNew}>
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
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Review & Confirm</h2>
        <p className="text-muted-foreground">
          {isProcessing
            ? "Payment completed. Finalizing your appointment..."
            : "Reviewing your appointment details."}
        </p>
      </div>

      {/* Appointment Details */}
      <div className="max-w-2xl mx-auto">
        <AppointmentDetails
          appointment={state}
          currency={currency}
          priceBreakdown={priceBreakdown}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {error && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" onClick={onStartNew}>
            Book Another Appointment
          </Button>
        </div>
      )}

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
      <div className="h-10"></div>
    </div>
  );
}
