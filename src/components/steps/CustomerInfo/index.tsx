/**
 * CustomerInfo Component
 * Customer information collection step
 */

import { useState, useEffect } from "react";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { Button } from "@/components/ui/button";
import { useBooking, useWidget } from "@/contexts";
import { validationService } from "@/services";
import type { CustomerInfo } from "@/types";

export function CustomerInfoStep() {
  const { config } = useWidget();
  const { state, setCustomerInfo } = useBooking();

  const [values, setValues] = useState<Partial<CustomerInfo>>(
    state.customerInfo || {}
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof CustomerInfo, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof CustomerInfo, boolean>>
  >({});

  const fieldRequirements = config?.fieldRequirements || {
    lastNameRequired: true,
    emailRequired: true,
    phoneRequired: true,
  };

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate on blur or when moving to next step
  const validateForm = (): boolean => {
    const validationErrors: Partial<Record<keyof CustomerInfo, string>> = {};

    // First Name - always required
    if (!values.firstName?.trim()) {
      validationErrors.firstName = "First name is required";
    }

    // Last Name - conditionally required
    if (fieldRequirements.lastNameRequired && !values.lastName?.trim()) {
      validationErrors.lastName = "Last name is required";
    }

    // Email - conditionally required + format validation
    if (fieldRequirements.emailRequired) {
      if (!values.email?.trim()) {
        validationErrors.email = "Email is required";
      } else if (!validationService.isValidEmail(values.email)) {
        validationErrors.email = "Please enter a valid email address";
      }
    } else if (values.email && !validationService.isValidEmail(values.email)) {
      validationErrors.email = "Please enter a valid email address";
    }

    // Phone - conditionally required + format validation
    if (fieldRequirements.phoneRequired) {
      if (!values.phone?.trim()) {
        validationErrors.phone = "Phone number is required";
      } else if (!validationService.isValidPhone(values.phone)) {
        validationErrors.phone = "Please enter a valid phone number";
      }
    } else if (values.phone && !validationService.isValidPhone(values.phone)) {
      validationErrors.phone = "Please enter a valid phone number";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Auto-save to context
  useEffect(() => {
    if (Object.values(touched).some(Boolean)) {
      const isValid = validateForm();
      if (isValid && values.firstName) {
        setCustomerInfo(values as CustomerInfo);
      }
    }
  }, [JSON.stringify(values)]); // eslint-disable-line react-hooks/exhaustive-deps

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
          fieldRequirements={fieldRequirements}
        />
      </div>

      {/* Validation Button (Optional - for testing) */}
      <div className="flex justify-end max-w-2xl">
        <Button
          variant="outline"
          onClick={() => {
            const isValid = validateForm();
            if (isValid) {
              alert("Form is valid!");
            }
          }}
        >
          Validate Form
        </Button>
      </div>
    </div>
  );
}
