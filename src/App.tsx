/**
 * App Component
 * Root component with context providers
 */

import { WidgetProvider } from "@/contexts/WidgetContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { BookingWidget } from "@/components/BookingWidget";
import { ErrorBoundary } from "@/components/shared";
import "./App.css";

// Get widget key from URL or props (for demo, using hardcoded value)
const WIDGET_KEY =
  new URLSearchParams(window.location.search).get("key") || "demo-widget-key";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function App() {
  return (
    <ErrorBoundary>
      <WidgetProvider widgetKey={WIDGET_KEY} apiBaseUrl={API_BASE_URL}>
        <ThemeProvider>
          <BookingProvider>
            <BookingWidget />
          </BookingProvider>
        </ThemeProvider>
      </WidgetProvider>
    </ErrorBoundary>
  );
}

export default App;
