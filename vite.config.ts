import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";

  return {
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Development server config
    server: {
      port: 5173,
      strictPort: false,
      open: true,
    },
    // Build configuration
    build: {
      // Output directory
      outDir: "dist",
      // Generate sourcemaps for production debugging
      sourcemap: !isDevelopment,
      // Minification
      minify: !isDevelopment ? "esbuild" : false,
      // Rollup options
      rollupOptions: {
        output: {
          // Disable code splitting - bundle everything into single file for reliable embedding
          // This ensures window.SalonTakvimWidget is available immediately when script loads
          manualChunks: undefined,
          inlineDynamicImports: true,
          // Asset file names
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split(".");
            const ext = info?.[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || "")) {
              return `assets/images/[name]-[hash][extname]`;
            } else if (/woff|woff2|eot|ttf|otf/i.test(ext || "")) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            // Output main CSS as widget.css for loader
            if (ext === "css") {
              return `widget.css`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          // Output main entry as widget.js for loader compatibility
          entryFileNames: "widget.js",
        },
      },
      // Chunk size warnings
      chunkSizeWarningLimit: 600, // KB
      // CSS code splitting
      cssCodeSplit: true,
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-day-picker",
        "date-fns",
        "lucide-react",
      ],
    },
    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(
        process.env.npm_package_version || "1.0.0"
      ),
    },
  };
});
