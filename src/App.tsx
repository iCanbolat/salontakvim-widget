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

const params = new URLSearchParams(window.location.search);

// Prefer query params provided by loader (slug + token + apiBase) and fall back to envs for local dev.
const WIDGET_KEY = params.get("key") || "demo-widget-key";
const WIDGET_SLUG = params.get("slug") || undefined;
const API_BASE_URL =
  params.get("apiBase") ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000";
const TOKEN = params.get("token") || "";

function App() {
  return (
    <ErrorBoundary>
      <WidgetProvider
        widgetKey={WIDGET_KEY}
        slug={WIDGET_SLUG}
        apiBaseUrl={API_BASE_URL}
        token={TOKEN}
      >
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
