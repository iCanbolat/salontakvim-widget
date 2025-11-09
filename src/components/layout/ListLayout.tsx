/**
 * ListLayout Component
 * Single page layout with all steps visible
 */

import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";

interface ListLayoutProps {
  children: ReactNode;
}

export function ListLayout({ children }: ListLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader />
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - hidden on mobile */}
          <aside className="hidden md:block md:w-80 shrink-0">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="space-y-8">
              {/* All steps shown in sequence */}
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
