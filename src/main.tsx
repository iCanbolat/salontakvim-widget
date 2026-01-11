import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { BookingWidget } from "@/components/BookingWidget";
import { ErrorBoundary } from "@/components/shared";

// Standalone mode: render into #root ONLY if query params are present (iframe mode)
// This prevents the widget from auto-rendering with default params in embed scenarios
const params = new URLSearchParams(window.location.search);
const isIframeMode =
  params.has("key") || params.has("slug") || params.has("token");
const rootEl = document.getElementById("root");

if (rootEl && isIframeMode) {
  createRoot(rootEl).render(
    <>
      <App />
    </>
  );
}

// Inline embed mode: expose global init function for widget-loader.js
interface WidgetInitOptions {
  container: HTMLElement;
  shadowRoot?: ShadowRoot;
  widgetKey: string;
  slug?: string;
  apiBaseUrl?: string;
  token?: string;
  mode?: "inline" | "iframe";
}

function initWidget(options: WidgetInitOptions) {
  const { container, shadowRoot, widgetKey, slug, apiBaseUrl, token } = options;

  // Use shadow root for style isolation if provided
  const root = createRoot(container);

  // Wrap the widget with a class for additional scoping
  const WidgetWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="salontakvim-widget-wrapper" data-widget-scope="true">
      {children}
    </div>
  );

  root.render(
    <ErrorBoundary>
      <WidgetProvider
        widgetKey={widgetKey}
        slug={slug}
        apiBaseUrl={apiBaseUrl}
        publicToken={token}
      >
        <ThemeProvider shadowRoot={shadowRoot}>
          <BookingProvider>
            <WidgetWrapper>
              <BookingWidget />
            </WidgetWrapper>
          </BookingProvider>
        </ThemeProvider>
      </WidgetProvider>
    </ErrorBoundary>
  );

  return {
    destroy: () => root.unmount(),
  };
}

// Expose to global scope for loader
declare global {
  interface Window {
    SalonTakvimWidget?: {
      init: typeof initWidget;
    };
  }
}

window.SalonTakvimWidget = {
  init: initWidget,
};
