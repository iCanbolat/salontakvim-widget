/**
 * Widget Loader Script
 * Embeds the SalonTakvim booking widget into any webpage
 *
 * Usage:
 * <script src="https://cdn.salontakvim.com/widget-loader.js" data-widget-key="wk_xxx" data-mode="inline"></script>
 *
 * Attributes:
 * - data-widget-key (required): Widget unique key
 * - data-mode (optional): 'inline' or 'iframe' (default: inline)
 * - data-container (optional): CSS selector for container (default: creates new div)
 * - data-config (optional): Additional config as JSON string
 */

(function () {
  "use strict";

  // Configuration
  const CDN_URL = "https://cdn.salontakvim.com";
  const WIDGET_CSS = `${CDN_URL}/widget.css`;
  const WIDGET_JS = `${CDN_URL}/widget.js`;
  const DEFAULT_MODE = "inline";

  // Get current script element
  const currentScript = document.currentScript;
  if (!currentScript) {
    console.error("[SalonTakvim Widget] Could not find script element");
    return;
  }

  // Read configuration from data attributes
  const widgetKey = currentScript.getAttribute("data-widget-key");
  const mode = currentScript.getAttribute("data-mode") || DEFAULT_MODE;
  const containerSelector = currentScript.getAttribute("data-container");
  const configJson = currentScript.getAttribute("data-config");

  // Validate widget key
  if (!widgetKey) {
    console.error(
      "[SalonTakvim Widget] Missing required attribute: data-widget-key"
    );
    return;
  }

  // Parse additional config
  let additionalConfig = {};
  if (configJson) {
    try {
      additionalConfig = JSON.parse(configJson);
    } catch (error) {
      console.error("[SalonTakvim Widget] Invalid data-config JSON:", error);
    }
  }

  /**
   * Load CSS file
   */
  function loadCSS() {
    // Check if CSS already loaded
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
    // Check if JS already loaded
    if (window.SalonTakvimWidget) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = WIDGET_JS;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  /**
   * Create container element
   */
  function createContainer() {
    let container;

    if (containerSelector) {
      container = document.querySelector(containerSelector);
      if (!container) {
        console.error(
          `[SalonTakvim Widget] Container not found: ${containerSelector}`
        );
        return null;
      }
    } else {
      // Create new container after the script
      container = document.createElement("div");
      container.id = `salontakvim-widget-${widgetKey}`;
      container.className = "salontakvim-widget-container";
      currentScript.parentNode.insertBefore(
        container,
        currentScript.nextSibling
      );
    }

    return container;
  }

  /**
   * Initialize inline widget
   */
  function initInlineWidget(container) {
    // Create root div for React
    const root = document.createElement("div");
    root.id = `salontakvim-widget-root-${widgetKey}`;
    root.className = "salontakvim-widget-root";
    container.appendChild(root);

    // Initialize widget
    if (window.SalonTakvimWidget && window.SalonTakvimWidget.init) {
      window.SalonTakvimWidget.init({
        container: root,
        widgetKey: widgetKey,
        mode: "inline",
        ...additionalConfig,
      });
    } else {
      console.error("[SalonTakvim Widget] Widget not loaded properly");
    }
  }

  /**
   * Initialize iframe widget
   */
  function initIframeWidget(container) {
    // Build iframe URL
    const params = new URLSearchParams({
      key: widgetKey,
      mode: "iframe",
      ...additionalConfig,
    });
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
