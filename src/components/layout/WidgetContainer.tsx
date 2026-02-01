/**
 * WidgetContainer Component
 * Main container that wraps the entire widget with responsive layout
 */

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useWidget } from "@/contexts";
import { Card } from "@/components/ui/card";

interface WidgetContainerProps {
  children: ReactNode;
  sidebar?: ReactNode;
  header?: ReactNode;
  className?: string;
}

export function WidgetContainer({
  children,
  sidebar,
  header,
  className,
}: WidgetContainerProps) {
  const { config } = useWidget();
  const layout = config?.layout || "steps";
  const isSidebarLayout = layout === "steps"; // steps layout shows sidebar

  return (
    <div
      className={cn("widget-container w-full mx-auto", className)}
      style={{
        fontFamily: config?.styling.fontFamily || "inherit",
      }}
    >
      <Card className="overflow-hidden shadow-lg">
        {header && <div className="border-b bg-muted/30 p-4">{header}</div>}

        <div
          className={cn(
            "flex",
            isSidebarLayout ? "flex-col md:flex-row" : "flex-col",
          )}
        >
          {/* Sidebar - hidden on mobile in sidebar layout */}
          {sidebar && isSidebarLayout && (
            <aside className="hidden md:block md:w-80 border-r bg-muted/20">
              {sidebar}
            </aside>
          )}

          {/* Main content */}
          <main className="flex-1 min-h-[400px] md:min-h-[500px]">
            {children}
          </main>
        </div>
      </Card>
    </div>
  );
}
