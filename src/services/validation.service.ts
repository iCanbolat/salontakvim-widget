/**
 * Validation Service
 * Handles form validation and business rules
 */

import type {
  CustomerInfo,
  FieldRequirements,
  BookingStep,
  StepValidation,
} from "@/types";

/**
 * Email validation regex (RFC 5322 simplified)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone validation regex (international format)
 * Allows: +1234567890, +1 234 567 890, +1-234-567-890, etc.
 */
const PHONE_REGEX = /^\+?[\d\s-()]+$/;
const TURKEY_GSM_REGEX = /^5\d{9}$/;

/**
 * Validation Service Class
 */
export class ValidationService {
  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    return EMAIL_REGEX.test(email.trim());
  }

  /**
   * Validate phone format
   */
  isValidPhone(phone: string): boolean {
    // Remove spaces and punctuation
    const cleaned = phone.replace(/[\s-()]/g, "");
    // Prefer strict TR GSM when it matches
    if (TURKEY_GSM_REGEX.test(cleaned)) {
      return true;
    }

    // Fallback to generic check (kept for potential future use)
    return PHONE_REGEX.test(phone) && cleaned.length >= 10;
  }

  /**
   * Validate required field
   */
  isRequired(value: string | null | undefined): boolean {
    return value !== null && value !== undefined && value.trim().length > 0;
  }

  /**
   * Validate customer information
   */
  validateCustomerInfo(
    customerInfo: Partial<CustomerInfo>,
    requirements: FieldRequirements
  ): StepValidation {
    const errors: string[] = [];

    // First name is always required
    if (!this.isRequired(customerInfo.firstName)) {
      errors.push("First name is required");
    }

    // Last name validation based on requirements
    if (
      requirements.lastNameRequired &&
      !this.isRequired(customerInfo.lastName)
    ) {
      errors.push("Last name is required");
    }

    // Email validation
    if (requirements.emailRequired) {
      if (!this.isRequired(customerInfo.email)) {
        errors.push("Email is required");
      } else if (!this.isValidEmail(customerInfo.email!)) {
        errors.push("Invalid email format");
      }
    } else if (customerInfo.email && !this.isValidEmail(customerInfo.email)) {
      errors.push("Invalid email format");
    }

    // Phone validation
    if (requirements.phoneRequired) {
      if (!this.isRequired(customerInfo.phone)) {
        errors.push("Phone number is required");
      } else if (!this.isValidPhone(customerInfo.phone!)) {
        errors.push("Invalid phone number format");
      }
    } else if (customerInfo.phone && !this.isValidPhone(customerInfo.phone)) {
      errors.push("Invalid phone number format");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate service selection step
   */
  validateServiceSelection(hasService: boolean): StepValidation {
    return {
      isValid: hasService,
      errors: hasService ? [] : ["Please select a service"],
    };
  }

  /**
   * Validate employee selection step
   */
  validateEmployeeSelection(
    hasEmployee: boolean,
    isRequired: boolean
  ): StepValidation {
    if (!isRequired) {
      return { isValid: true, errors: [] };
    }

    return {
      isValid: hasEmployee,
      errors: hasEmployee ? [] : ["Please select an employee"],
    };
  }

  /**
   * Validate location selection step
   */
  validateLocationSelection(hasLocation: boolean): StepValidation {
    return {
      isValid: hasLocation,
      errors: hasLocation ? [] : ["Please select a location"],
    };
  }

  /**
   * Validate date & time selection step
   */
  validateDateTimeSelection(
    hasDate: boolean,
    hasTime: boolean
  ): StepValidation {
    const errors: string[] = [];

    if (!hasDate) {
      errors.push("Please select a date");
    }

    if (!hasTime) {
      errors.push("Please select a time");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate payment step
   */
  validatePayment(hasPaymentMethod: boolean, isFree: boolean): StepValidation {
    // If service is free, skip validation
    if (isFree) {
      return { isValid: true, errors: [] };
    }

    return {
      isValid: hasPaymentMethod,
      errors: hasPaymentMethod ? [] : ["Please select a payment method"],
    };
  }

  /**
   * Validate entire booking step
   */
  validateStep(
    step: BookingStep,
    state: any,
    requirements: FieldRequirements
  ): StepValidation {
    switch (step) {
      case "service":
        return this.validateServiceSelection(!!state.selectedService);

      case "employee":
        return this.validateEmployeeSelection(
          !!state.selectedStaff,
          requirements.employeeRequired
        );

      case "location":
        return this.validateLocationSelection(!!state.selectedLocation);

      case "extras":
        // Extras are always optional
        return { isValid: true, errors: [] };

      case "dateTime":
        return this.validateDateTimeSelection(
          !!state.selectedDateTime?.date,
          !!state.selectedDateTime?.time
        );

      case "customerInfo":
        return this.validateCustomerInfo(
          state.customerInfo || {},
          requirements
        );

      case "payment":
        return this.validatePayment(
          !!state.paymentInfo?.method,
          state.paymentInfo?.total === 0
        );

      case "confirmation":
        // Confirmation step doesn't need validation
        return { isValid: true, errors: [] };

      default:
        return { isValid: false, errors: ["Unknown step"] };
    }
  }

  /**
   * Sanitize string input (remove HTML, trim)
   */
  sanitizeString(input: string): string {
    return input
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .trim();
  }

  /**
   * Validate coupon code format (alphanumeric, 4-20 chars)
   */
  isValidCouponCode(code: string): boolean {
    const cleaned = code.trim().toUpperCase();
    return /^[A-Z0-9]{4,20}$/.test(cleaned);
  }

  /**
   * Validate number of people (must be positive and within capacity)
   */
  isValidNumberOfPeople(count: number, maxCapacity: number): boolean {
    return count > 0 && count <= maxCapacity;
  }
}

/**
 * Export singleton instance
 */
export const validationService = new ValidationService();
