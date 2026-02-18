/**
 * StepsLayout Component
 * Responsive layout: sidebar on lg+, single column on mobile
 */

import { type ReactNode, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { Sidebar } from "./Sidebar";
import { useBooking, useWidget } from "@/contexts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepsLayoutProps {
  children: ReactNode;
  showProgressBar?: boolean;
  onConfirm?: () => void;
  isConfirming?: boolean;
  isConfirmSuccess?: boolean;
}

export function StepsLayout({
  children,
  showProgressBar = true,
  onConfirm,
  isConfirming = false,
  isConfirmSuccess = false,
}: StepsLayoutProps) {
  const { config } = useWidget();
  const { state, canGoNext, canGoPrev, nextStep, prevStep } = useBooking();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mobileScrollContainerRef = useRef<HTMLDivElement>(null);

  const navigationStyle = {
    backgroundColor: config?.styling.sidebarBackgroundColor || undefined,
  };

  // Scroll to top when step changes or confirmation success occurs
  useEffect(() => {
    const scrollOptions: ScrollToOptions = { top: 0, behavior: "smooth" };
    scrollContainerRef.current?.scrollTo(scrollOptions);
    mobileScrollContainerRef.current?.scrollTo(scrollOptions);
  }, [state.currentStep, isConfirmSuccess]);

  const isConfirmationStep = state.currentStep === "confirmation";
  const primaryLabel = isConfirmationStep ? "Confirm Appointment" : "Next";
  const showNavigation = !isConfirmationStep;

  return (
    <div className="w-full">
      <div className="flex flex-col mx-auto">
        {/* Desktop: Sidebar + Content in fixed height container */}
        <div className="hidden md:flex lg:h-[600px]">
          {/* Sidebar */}
          <aside
            className={cn(
              "flex flex-col shrink-0 border-r overflow-y-auto transition-all duration-300",
              isSidebarCollapsed ? "w-16" : "w-80",
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
              ref={scrollContainerRef}
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
                    disabled={
                      isConfirmationStep
                        ? isConfirming || !canGoPrev()
                        : !canGoPrev()
                    }
                    className={cn(!canGoPrev() && "invisible")}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>

                  <Button
                    size="sm"
                    onClick={isConfirmationStep ? onConfirm : nextStep}
                    disabled={isConfirmationStep ? isConfirming : !canGoNext()}
                    className="min-w-[140px]"
                  >
                    {isConfirming ? (
                      <span className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 animate-spin" />
                        Confirming...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {primaryLabel}
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Mobile: Stacked layout */}
        <div className="flex flex-col md:hidden">
          {/* Progress Bar & Content */}
          <div className="p-4">
            {showProgressBar && config?.settings.showProgressBar && (
              <div className="space-y-1.5 mb-4">
                <ProgressBar showPercentage={false} />
                {/* <h2 className="text-lg font-semibold">{currentStepLabel}</h2> */}
              </div>
            )}

            {/* Step Content */}
            <div
              ref={mobileScrollContainerRef}
              className="p-4 h-[400px] overflow-auto"
            >
              {children}
            </div>
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
                  disabled={
                    isConfirmationStep
                      ? isConfirming || !canGoPrev()
                      : !canGoPrev()
                  }
                  className={cn(!canGoPrev() && "invisible")}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>

                <Button
                  size="sm"
                  onClick={isConfirmationStep ? onConfirm : nextStep}
                  disabled={isConfirmationStep ? isConfirming : !canGoNext()}
                  className="min-w-[140px]"
                >
                  {isConfirming ? (
                    <span className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 animate-spin" />
                      Confirming...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {primaryLabel}
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
