/**
 * PersonalInfoForm Component
 * Form for customer personal information
 */

import type { CSSProperties } from "react";
import { FormField } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { useWidget } from "@/contexts";
import { formatTurkishPhone, normalizeTurkishPhoneInput } from "@/utils";
import type { CustomerInfo } from "@/types";

interface PersonalInfoFormProps {
  values: Partial<CustomerInfo>;
  errors: Partial<Record<keyof CustomerInfo, string>>;
  onChange: (field: keyof CustomerInfo, value: string) => void;
  onBlurField?: (field: keyof CustomerInfo) => void;
  fieldRequirements: {
    lastNameRequired: boolean;
    emailRequired: boolean;
    phoneRequired: boolean;
  };
}

export function PersonalInfoForm({
  values,
  errors,
  onChange,
  onBlurField,
  fieldRequirements,
}: PersonalInfoFormProps) {
  const { config } = useWidget();
  const primaryColor = config?.styling.primaryColor;

  return (
    <div className="space-y-4">
      {/* First Name */}
      <FormField
        label="First Name"
        required
        error={errors.firstName}
        htmlFor="firstName"
      >
        <Input
          id="firstName"
          type="text"
          placeholder="John"
          value={values.firstName || ""}
          onChange={(e) => onChange("firstName", e.target.value)}
          onBlur={() => onBlurField?.("firstName")}
        />
      </FormField>

      {/* Last Name */}
      <FormField
        label="Last Name"
        required={fieldRequirements.lastNameRequired}
        error={errors.lastName}
        htmlFor="lastName"
      >
        <Input
          id="lastName"
          type="text"
          placeholder="Doe"
          value={values.lastName || ""}
          onChange={(e) => onChange("lastName", e.target.value)}
          onBlur={() => onBlurField?.("lastName")}
        />
      </FormField>

      {/* Email */}
      <FormField
        label="Email"
        required={fieldRequirements.emailRequired}
        error={errors.email}
        htmlFor="email"
        hint="We'll send your appointment confirmation here"
      >
        <Input
          id="email"
          type="email"
          placeholder="john.doe@example.com"
          value={values.email || ""}
          onChange={(e) => onChange("email", e.target.value)}
          onBlur={() => onBlurField?.("email")}
        />
      </FormField>

      {/* Phone */}
      <FormField
        label="Phone"
        required={fieldRequirements.phoneRequired}
        error={errors.phone}
        htmlFor="phone"
        hint="For appointment reminders"
      >
        <Input
          id="phone"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="(5XX) XXX XX XX"
          value={formatTurkishPhone(values.phone || "")}
          onChange={(e) => {
            onChange("phone", normalizeTurkishPhoneInput(e.target.value));
          }}
          onBlur={() => onBlurField?.("phone")}
        />
      </FormField>

      {/* Notes */}
      <FormField
        label="Additional Notes"
        htmlFor="notes"
        hint="Any special requests or information"
      >
        <textarea
          id="notes"
          rows={4}
          className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Tell us anything we should know..."
          value={values.notes || ""}
          onChange={(e) => onChange("notes", e.target.value)}
          onBlur={() => onBlurField?.("notes")}
          style={
            primaryColor
              ? ({ "--ring": primaryColor } as CSSProperties)
              : undefined
          }
        />
      </FormField>
    </div>
  );
}
