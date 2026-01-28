/**
 * CustomerInfo Component
 * Customer information collection step
 */

import { useState, useEffect, useCallback } from "react";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { useBooking } from "@/contexts";
import { validationService } from "@/services";
import type { CustomerInfo } from "@/types";

export function CustomerInfoStep() {
  const { state, setCustomerInfo } = useBooking();

  const [values, setValues] = useState<Partial<CustomerInfo>>(
    state.customerInfo || {},
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof CustomerInfo, string>>
  >({});

  const computeErrors = useCallback((vals: Partial<CustomerInfo>) => {
    const validationErrors: Partial<Record<keyof CustomerInfo, string>> = {};

    if (!vals.firstName?.trim()) {
      validationErrors.firstName = "First name is required";
    }

    if (!vals.lastName?.trim()) {
      validationErrors.lastName = "Last name is required";
    }

    if (!vals.email?.trim()) {
      validationErrors.email = "Email is required";
    } else if (!validationService.isValidEmail(vals.email)) {
      validationErrors.email = "Please enter a valid email address";
    }

    if (!vals.phone?.trim()) {
      validationErrors.phone = "Phone number is required";
    } else if (!validationService.isValidPhone(vals.phone)) {
      validationErrors.phone = "Please enter a valid phone number";
    }

    return validationErrors;
  }, []);

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateField = (field: keyof CustomerInfo) => {
    const validationErrors = computeErrors(values);
    setErrors((prev) => {
      const next = { ...prev };
      if (validationErrors[field]) {
        next[field] = validationErrors[field];
      } else {
        delete next[field];
      }
      return next;
    });
  };

  // Save to context when form is currently valid
  useEffect(() => {
    const validationErrors = computeErrors(values);
    const isValid = Object.keys(validationErrors).length === 0;
    if (isValid) {
      setCustomerInfo(values as CustomerInfo);
    }
  }, [values, computeErrors, setCustomerInfo]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Your Information</h2>
        <p className="text-muted-foreground">
          Please provide your contact details for the appointment
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <PersonalInfoForm
          values={values}
          errors={errors}
          onChange={handleChange}
          onBlurField={validateField}
        />
      </div>
    </div>
  );
}
