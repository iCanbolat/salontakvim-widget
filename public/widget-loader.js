/**
 * Widget Loader Script
 * Embeds the SalonTakvim booking widget into any webpage.
 * Designed to be injected by the signed embed bootstrap (script.js).
 *
 * Required data attributes (set by bootstrap):
 * - data-widget-key: Widget unique key
 * - data-slug: Store slug for API routing
 * - data-token: Signed embed token for authenticated API calls
 * - data-api-base: API base URL
 *
 * Optional data attributes:
 * - data-mode: 'inline' or 'iframe' (default: inline)
 * - data-container: CSS selector for container (default: auto-detect)
 */

(function () {
  "use strict";

  // Configuration
  const scriptUrl = document.currentScript?.src;
  const CDN_URL = scriptUrl
    ? new URL(scriptUrl).origin
    : "https://cdn.salontakvim.com";
  const WIDGET_CSS = `${CDN_URL}/widget.css`;
  const WIDGET_JS = `${CDN_URL}/widget.js`;
  const DEFAULT_MODE = "inline";

  // Get current script element
  const currentScript = document.currentScript;
  if (!currentScript) {
    console.error("[SalonTakvim Widget] Could not find script element");
    return;
  }

  // Read configuration from data attributes (set by signed embed bootstrap)
  const widgetKey = currentScript.getAttribute("data-widget-key");
  const slug = currentScript.getAttribute("data-slug");
  const token = currentScript.getAttribute("data-token");
  const apiBase = currentScript.getAttribute("data-api-base");
  const mode = currentScript.getAttribute("data-mode") || DEFAULT_MODE;
  const containerSelector = currentScript.getAttribute("data-container");

  // Validate widget key
  if (!widgetKey && !slug) {
    console.error(
      "[SalonTakvim Widget] Missing required attribute: data-widget-key or data-slug",
    );
    return;
  }

  /**
   * Load CSS file - Skip for inline mode (CSS loaded into Shadow DOM)
   */
  function loadCSS() {
    // For inline mode, CSS is loaded into Shadow DOM, not globally
    // This prevents style bleeding to the host page
    if (mode === "inline") {
      return Promise.resolve();
    }

    // For iframe mode, load CSS globally
    if (document.querySelector(`link[href="${WIDGET_CSS}"]`)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = WIDGET_CSS;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  /**
   * Load JS file
   */
  function loadJS() {
    // Skip if already loaded
    if (window.SalonTakvimWidget) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = WIDGET_JS;
      script.type = "module";
      script.async = true;
      script.onerror = reject;
      document.body.appendChild(script);

      // Poll for SalonTakvimWidget to be defined (module execution may be async)
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.SalonTakvimWidget) {
          clearInterval(checkInterval);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          reject(new Error("Widget module did not initialize in time"));
        }
      }, 100);
    });
  }

  /**
   * Create container element
   */
  function createContainer() {
    let container;

    // Prefer a fixed container if present
    const fixedContainer = document.getElementById("salontakvim-widget");
    if (fixedContainer) {
      return fixedContainer;
    }

    if (containerSelector) {
      // User specified a container selector
      container = document.querySelector(containerSelector);
      if (!container) {
        console.error(
          `[SalonTakvim Widget] Container not found: ${containerSelector}`,
        );
        return null;
      }
    } else {
      // Auto-detect: check if previous sibling is a div (user placed div before script)
      const prevSibling = currentScript.previousElementSibling;
      if (
        prevSibling &&
        prevSibling.tagName === "DIV" &&
        (prevSibling.id?.includes("widget") ||
          prevSibling.id?.includes("salon") ||
          prevSibling.id?.includes("booking") ||
          prevSibling.classList.contains("salontakvim-widget") ||
          prevSibling.children.length === 0)
      ) {
        // Use the previous div as container
        container = prevSibling;
      } else {
        // Create new container after the script
        container = document.createElement("div");
        const defaultId = "salontakvim-widget";
        container.id = document.getElementById(defaultId)
          ? `salontakvim-widget-${widgetKey || slug || "embed"}`
          : defaultId;
        container.className = "salontakvim-widget-container";
        currentScript.parentNode.insertBefore(
          container,
          currentScript.nextSibling,
        );
      }
    }

    return container;
  }

  /**
   * Initialize inline widget with Shadow DOM isolation
   */
  function initInlineWidget(container) {
    // Create shadow DOM for style isolation
    const shadowHost = document.createElement("div");
    shadowHost.className = "salontakvim-shadow-host";
    container.appendChild(shadowHost);

    const shadowRoot = shadowHost.attachShadow({ mode: "open" });

    // Create style element with widget CSS
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = WIDGET_CSS;
    shadowRoot.appendChild(styleLink);

    // Create root div for React inside shadow DOM
    const root = document.createElement("div");
    root.id = `salontakvim-widget-root-${widgetKey || slug || "embed"}`;
    root.className = "salontakvim-widget-root";
    shadowRoot.appendChild(root);

    // Wait for CSS to load before initializing widget
    styleLink.onload = () => {
      if (window.SalonTakvimWidget && window.SalonTakvimWidget.init) {
        window.SalonTakvimWidget.init({
          container: root,
          shadowRoot: shadowRoot,
          widgetKey: widgetKey,
          slug: slug || undefined,
          apiBaseUrl: apiBase || undefined,
          mode: "inline",
          token,
        });
      } else {
        console.error("[SalonTakvim Widget] Widget not loaded properly");
      }
    };

    styleLink.onerror = () => {
      console.error("[SalonTakvim Widget] Failed to load widget CSS");
      // Try to initialize anyway
      if (window.SalonTakvimWidget && window.SalonTakvimWidget.init) {
        window.SalonTakvimWidget.init({
          container: root,
          shadowRoot: shadowRoot,
          widgetKey: widgetKey,
          slug: slug || undefined,
          apiBaseUrl: apiBase || undefined,
          mode: "inline",
          token,
        });
      }
    };
  }

  /**
   * Initialize iframe widget
   */
  function initIframeWidget(container) {
    // Build iframe URL
    const params = new URLSearchParams({
      key: widgetKey,
      mode: "iframe",
    });

    if (token) {
      params.set("token", token);
    }
    if (apiBase) {
      params.set("apiBase", apiBase);
    }
    if (slug) {
      params.set("slug", slug);
    }
    const iframeUrl = `${CDN_URL}/widget.html?${params.toString()}`;

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.src = iframeUrl;
    iframe.className = "salontakvim-widget-iframe";
    iframe.style.width = "100%";
    iframe.style.minHeight = "600px";
    iframe.style.border = "none";
    iframe.style.overflow = "auto";
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("title", "SalonTakvim Booking Widget");

    // Handle iframe messages for dynamic height
    window.addEventListener("message", function (event) {
      if (event.origin !== new URL(CDN_URL).origin) return;

      if (event.data && event.data.type === "WIDGET_HEIGHT_CHANGE") {
        iframe.style.height = `${event.data.height}px`;
      }
    });

    container.appendChild(iframe);
  }

  /**
   * Main initialization
   */
  async function init() {
    try {
      // Get or create container
      const container = createContainer();
      if (!container) return;

      // Add loading indicator
      container.innerHTML =
        '<div class="salontakvim-widget-loading">Loading widget...</div>';

      // Load CSS and JS
      await Promise.all([loadCSS(), loadJS()]);

      // Clear loading indicator
      container.innerHTML = "";

      // Initialize based on mode
      if (mode === "iframe") {
        initIframeWidget(container);
      } else {
        initInlineWidget(container);
      }

      console.log("[SalonTakvim Widget] Initialized successfully");
    } catch (error) {
      console.error("[SalonTakvim Widget] Initialization failed:", error);
      const container = createContainer();
      if (container) {
        container.innerHTML =
          '<div class="salontakvim-widget-error">Failed to load widget. Please try again later.</div>';
      }
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
