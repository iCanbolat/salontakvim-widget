/**
 * Widget Configuration Types
 * Based on backend API response from /public/widget/:widgetKey/config
 */

// Layout types
export type LayoutType = "list" | "steps";

// Sidebar menu items configuration
export interface SidebarMenuItems {
  service: boolean;
  employee: boolean;
  location: boolean;
  extras: boolean;
  dateTime: boolean;
  customerInfo: boolean;
  payment: boolean;
}

// Styling configuration
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  sidebarBackgroundColor: string;
  contentBackgroundColor: string;
  textColor: string;
  headingColor: string;
  fontFamily: string;
  fontSize: number;
  buttonBorderRadius: number;
}

// Widget settings
export interface WidgetSettings {
  showProgressBar: boolean;
  allowGuestBooking: boolean;
  redirectUrlAfterBooking?: string;
}

// Store information
export interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  email?: string;
  phone?: string;
  currency: string;
}

// Complete widget configuration
export interface WidgetConfig {
  store: StoreInfo;
  layout: LayoutType;
  showCompanyEmail: boolean;
  companyEmail?: string;
  sidebarMenuItems: SidebarMenuItems;
  payment: {
    enabled: boolean;
    canProcessPayments: boolean;
    provider: "stripe_connect" | null;
    allowPartial: boolean;
    defaultDepositPercentage: number;
    fixedDepositAmount: number;
    publishableKey?: string;
  };
  styling: ThemeConfig;
  settings: WidgetSettings;
}

// Widget state
export interface WidgetState {
  config: WidgetConfig | null;
  isLoading: boolean;
  error: string | null;
  widgetKey: string;
}
