import { useEffect, useMemo, useState } from "react";
import { Loader2, Tag } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { useBooking, useWidget } from "@/contexts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/utils";
import { validationService } from "@/services/validation.service";

export function PaymentStep() {
  const { config, apiService } = useWidget();
  const { state, setPaymentInfo, getPriceBreakdown } = useBooking();

  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [checkoutClientSecret, setCheckoutClientSecret] = useState<
    string | null
  >(null);
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(
    null,
  );
  const [fallbackCheckoutUrl, setFallbackCheckoutUrl] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState(
    state.paymentInfo?.couponCode || "",
  );
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponApplying, setCouponApplying] = useState(false);

  const price = useMemo(() => getPriceBreakdown(), [getPriceBreakdown]);

  const currency = config?.store.currency || "USD";
  const paymentEnabled = !!config?.payment?.enabled;
  const canProcessPayments = !!config?.payment?.canProcessPayments;
  const publishableKey = config?.payment?.publishableKey;
  const fixedDepositAmount = config?.payment?.fixedDepositAmount ?? 20;
  const netTotal = price.total;
  const payableNow = Math.min(netTotal, fixedDepositAmount);
  const remainingAmount = Math.max(0, netTotal - payableNow);

  const stripePromise = useMemo(() => {
    if (!publishableKey) {
      return null;
    }
    return loadStripe(publishableKey);
  }, [publishableKey]);

  useEffect(() => {
    setCouponCode(state.paymentInfo?.couponCode || "");
  }, [state.paymentInfo?.couponCode]);

  useEffect(() => {
    if (!state.paymentInfo) {
      setPaymentInfo({
        method: paymentEnabled ? "stripe" : "cash",
        amountType: "deposit",
        paymentStatus: paymentEnabled ? "pending" : undefined,
        couponCode: undefined,
        discount: 0,
        subtotal: price.subtotal,
        total: price.total,
        payableNow,
        remainingAmount,
      });
      return;
    }

    setPaymentInfo({
      ...state.paymentInfo,
      method: paymentEnabled ? "stripe" : state.paymentInfo.method || "cash",
      amountType: "deposit",
      subtotal: price.subtotal,
      total: price.total,
      payableNow,
      remainingAmount,
    });
  }, [
    paymentEnabled,
    price.subtotal,
    price.total,
    payableNow,
    remainingAmount,
  ]);

  useEffect(() => {
    if (!paymentEnabled || !canProcessPayments) {
      setCheckoutClientSecret(null);
      setCheckoutSessionId(null);
      setFallbackCheckoutUrl(null);
    }
  }, [paymentEnabled, canProcessPayments]);

  const handleCheckout = async () => {
    if (!apiService || !state.selectedService) {
      setError("Widget not ready");
      return;
    }

    setError(null);
    setIsCreatingCheckout(true);

    try {
      const currentUrl = window.location.href;
      const successUrl = currentUrl.includes("?")
        ? `${currentUrl}&payment_success=1`
        : `${currentUrl}?payment_success=1`;
      const cancelUrl = currentUrl.includes("?")
        ? `${currentUrl}&payment_canceled=1`
        : `${currentUrl}?payment_canceled=1`;

      const response = await apiService.createPaymentCheckoutSession({
        serviceId: state.selectedService.service.id,
        extrasData: state.selectedExtras.map((extra) => ({
          extraId: extra.extra.id,
          quantity: extra.quantity,
        })),
        couponCode: state.paymentInfo?.couponCode,
        customerEmail: state.customerInfo?.email,
        amountType: "deposit",
        successUrl,
        cancelUrl,
      });

      if (response.skipped) {
        setPaymentInfo({
          method: "stripe",
          amountType: "deposit",
          paymentStatus: "paid",
          checkoutSessionId: undefined,
          couponCode: state.paymentInfo?.couponCode,
          discount: state.paymentInfo?.discount || 0,
          subtotal: price.subtotal,
          total: price.total,
          payableNow: 0,
          remainingAmount: 0,
        });
        return;
      }

      if (!response.sessionId) {
        throw new Error("Could not initialize checkout session");
      }

      setCheckoutSessionId(response.sessionId);
      setCheckoutClientSecret(response.checkoutClientSecret || null);
      setFallbackCheckoutUrl(response.checkoutUrl || null);

      setPaymentInfo({
        method: "stripe",
        amountType: "deposit",
        checkoutSessionId: response.sessionId,
        paymentStatus: "pending",
        couponCode: state.paymentInfo?.couponCode,
        discount: state.paymentInfo?.discount || 0,
        subtotal: price.subtotal,
        total: price.total,
        payableNow,
        remainingAmount,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to start checkout");
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (!validationService.isValidCouponCode(code)) {
      setCouponError("Invalid coupon format");
      return;
    }

    setCouponError(null);
    setCouponApplying(true);

    try {
      if (!apiService) {
        throw new Error("Widget is not ready. Please try again.");
      }

      const response = await apiService.validateCoupon({
        code,
        serviceId: state.selectedService?.service.id,
        amount: price.subtotal,
        customerEmail: state.customerInfo?.email || undefined,
      });

      const discount = Number(response.discountAmount || 0);
      const total = Math.max(0, price.subtotal - discount);
      const nextPayableNow = Math.min(total, fixedDepositAmount);

      setPaymentInfo({
        method: state.paymentInfo?.method || "stripe",
        amountType: "deposit",
        checkoutSessionId: undefined,
        paymentStatus: "pending",
        couponCode: code,
        discount,
        subtotal: price.subtotal,
        total,
        payableNow: nextPayableNow,
        remainingAmount: Math.max(0, total - nextPayableNow),
      });

      setCheckoutSessionId(null);
      setCheckoutClientSecret(null);
      setFallbackCheckoutUrl(null);
    } catch (err: any) {
      setCouponError(err?.message || "Coupon could not be applied");
    } finally {
      setCouponApplying(false);
    }
  };

  const handleClearCoupon = () => {
    setCouponCode("");
    setCouponError(null);

    setPaymentInfo({
      method: state.paymentInfo?.method || "stripe",
      amountType: "deposit",
      checkoutSessionId: undefined,
      paymentStatus: "pending",
      couponCode: undefined,
      discount: 0,
      subtotal: price.subtotal,
      total: price.subtotal,
      payableNow: Math.min(price.subtotal, fixedDepositAmount),
      remainingAmount: Math.max(
        0,
        price.subtotal - Math.min(price.subtotal, fixedDepositAmount),
      ),
    });

    setCheckoutSessionId(null);
    setCheckoutClientSecret(null);
    setFallbackCheckoutUrl(null);
  };

  if (!paymentEnabled) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Payment</h2>
        <p className="text-muted-foreground">
          Online payment is not enabled for this store.
        </p>
      </div>
    );
  }

  const isPaid = state.paymentInfo?.paymentStatus === "paid";
  const hasEmbeddedCheckout = !!checkoutClientSecret && !!stripePromise;
  const isCheckoutLocked =
    isPaid ||
    isCreatingCheckout ||
    !!checkoutSessionId ||
    !!checkoutClientSecret;

  const handlePaymentCompleted = () => {
    if (!checkoutSessionId) {
      return;
    }

    setPaymentInfo({
      method: "stripe",
      amountType: "deposit",
      checkoutSessionId,
      paymentStatus: "paid",
      couponCode: state.paymentInfo?.couponCode,
      discount: state.paymentInfo?.discount || 0,
      subtotal: price.subtotal,
      total: price.total,
      payableNow,
      remainingAmount,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Payment</h2>
        <p className="text-muted-foreground">
          A fixed deposit is collected now via secure Stripe checkout.
        </p>
      </div>

      <div className="max-w-2xl rounded-md border bg-muted/20 px-4 py-3 text-sm">
        <p className="font-medium">
          Deposit now: {formatPrice(payableNow, currency)}
        </p>
        <p className="text-muted-foreground mt-1">
          Remaining amount is settled by staff during the appointment.
        </p>
      </div>

      <div className="max-w-2xl rounded-md border p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">
            {formatPrice(price.subtotal, currency)}
          </span>
        </div>
        {(state.paymentInfo?.discount || 0) > 0 && (
          <div className="flex items-center justify-between text-sm text-emerald-600">
            <span className="font-medium">Discount</span>
            <span className="font-semibold">
              -{formatPrice(state.paymentInfo?.discount || 0, currency)}
            </span>
          </div>
        )}
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Net Total</span>
          <span className="font-semibold">
            {formatPrice(netTotal, currency)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Deposit (paid now)</span>
          <span className="font-medium">
            {formatPrice(payableNow, currency)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Remaining at appointment
          </span>
          <span className="font-medium">
            {formatPrice(remainingAmount, currency)}
          </span>
        </div>
      </div>

      <div className="max-w-2xl rounded-md border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <p className="font-medium">Have a coupon?</p>
          </div>
          {!!state.paymentInfo?.couponCode && (
            <span className="text-xs text-emerald-600 font-medium">
              Applied
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="uppercase"
            disabled={couponApplying || isCheckoutLocked}
          />
          {state.paymentInfo?.couponCode ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleClearCoupon}
              disabled={couponApplying || isCheckoutLocked}
            >
              Remove
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleApplyCoupon}
              disabled={couponApplying || isCheckoutLocked}
            >
              Apply
            </Button>
          )}
        </div>
        {couponError && (
          <p className="text-xs text-destructive">{couponError}</p>
        )}
      </div>

      {!canProcessPayments && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Online payment is enabled, but Stripe setup is not complete yet for
          this store.
        </div>
      )}

      {canProcessPayments && !publishableKey && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          Stripe publishable key is missing. Please contact the store
          administrator.
        </div>
      )}

      {isPaid ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Payment completed. You can continue to confirmation.
        </div>
      ) : (
        canProcessPayments && (
          <>
            {!checkoutClientSecret && (
              <Button
                onClick={handleCheckout}
                disabled={isCreatingCheckout || !publishableKey}
              >
                {isCreatingCheckout ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Preparing secure payment...
                  </>
                ) : (
                  "Continue to Secure Payment"
                )}
              </Button>
            )}

            {hasEmbeddedCheckout && (
              <div className="rounded-md border p-2">
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{
                    clientSecret: checkoutClientSecret,
                    onComplete: handlePaymentCompleted,
                  }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            )}

            {!checkoutClientSecret && fallbackCheckoutUrl && (
              <p className="text-xs text-muted-foreground">
                If embedded checkout does not open, use this link:{" "}
                {fallbackCheckoutUrl}
              </p>
            )}
          </>
        )
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
