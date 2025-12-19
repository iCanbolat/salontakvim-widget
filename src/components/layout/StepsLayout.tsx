/**
 * StepsLayout Component
 * Responsive layout: sidebar on lg+, single column on mobile
 */

import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { Sidebar } from "./Sidebar";
import { useBooking, useWidget } from "@/contexts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepsLayoutProps {
  children: ReactNode;
  showProgressBar?: boolean;
}

const STEP_LABELS: Record<string, string> = {
  service: "Select Service",
  employee: "Select Employee",
  location: "Select Location",
  extras: "Add Extras",
  dateTime: "Choose Date & Time",
  customerInfo: "Your Information",
  payment: "Payment",
  confirmation: "Confirmation",
};

export function StepsLayout({
  children,
  showProgressBar = true,
}: StepsLayoutProps) {
  const { config } = useWidget();
  const { state, canGoNext, canGoPrev, nextStep, prevStep } = useBooking();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigationStyle = {
    backgroundColor: config?.styling.sidebarBackgroundColor || undefined,
  };

  const currentStepLabel = STEP_LABELS[state.currentStep] || "Unknown Step";
  const showNavigation = state.currentStep !== "confirmation";

  return (
    <div className="w-full">
      <div className="flex flex-col max-w-5xl mx-auto">
        {/* Desktop: Sidebar + Content in fixed height container */}
        <div className="hidden lg:flex lg:h-[600px]">
          {/* Sidebar */}
          <aside
            className={cn(
              "flex flex-col shrink-0 border-r overflow-y-auto transition-all duration-300",
              isSidebarCollapsed ? "w-16" : "w-80"
            )}
            style={{
              backgroundColor:
                config?.styling.sidebarBackgroundColor || undefined,
            }}
          >
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          </aside>

          {/* Main Content */}
          <main
            className="flex-1 min-w-0 flex flex-col relative"
            style={{
              backgroundColor:
                config?.styling.contentBackgroundColor || undefined,
            }}
          >
            {/* Scrollable Content */}
            <div
              className={`flex-1 overflow-y-auto p-6 ${
                state.currentStep === "confirmation" ? "" : "mb-24"
              }`}
            >
              <div>{children}</div>
            </div>

            {/* Navigation Buttons - Fixed at bottom */}
            {showNavigation && (
              <div
                className="absolute bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 p-4"
                style={navigationStyle}
              >
                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevStep}
                    disabled={!canGoPrev()}
                    className={cn(!canGoPrev() && "invisible")}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>

                  <Button
                    size="sm"
                    onClick={nextStep}
                    disabled={!canGoNext()}
                    className="min-w-[100px]"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Mobile: Stacked layout */}
        <div className="flex flex-col lg:hidden">
          {/* Progress Bar & Content */}
          <div className="p-4">
            {showProgressBar && config?.settings.showProgressBar && (
              <div className="space-y-1.5 mb-4">
                <ProgressBar showPercentage={false} />
                <h2 className="text-lg font-semibold">{currentStepLabel}</h2>
              </div>
            )}

            {/* Step Content */}
            <div className="bg-card rounded-lg border p-4">{children}</div>
          </div>

          {/* Navigation Buttons - Fixed at bottom of viewport */}
          {showNavigation && (
            <div
              className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 p-4"
              style={navigationStyle}
            >
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevStep}
                  disabled={!canGoPrev()}
                  className={cn(!canGoPrev() && "invisible")}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>

                <Button
                  size="sm"
                  onClick={nextStep}
                  disabled={!canGoNext()}
                  className="min-w-[100px]"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
