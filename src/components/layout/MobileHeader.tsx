/**
 * MobileHeader Component
 * Header for mobile view with hamburger menu
 */

import { useState } from "react";
import { Menu, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingFlow } from "@/hooks";
import { useWidget } from "@/contexts";
import { ProgressBar } from "./ProgressBar";
import { Sidebar } from "./Sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileHeaderProps {
  showBackButton?: boolean;
}

export function MobileHeader({ showBackButton = true }: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { canGoBack, goBack } = useBookingFlow();
  const { config } = useWidget();

  return (
    <div className="md:hidden border-b bg-background">
      {/* Top bar with menu and back button */}
      <div className="flex items-center justify-between p-4">
        {/* Left: Back button or logo */}
        <div className="flex items-center gap-2">
          {showBackButton && canGoBack ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          ) : (
            <div className="text-lg font-semibold">
              {config?.store.name || "Book Appointment"}
            </div>
          )}
        </div>

        {/* Right: Menu button */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Booking Steps</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <Sidebar />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-4">
        <ProgressBar showPercentage />
      </div>
    </div>
  );
}
