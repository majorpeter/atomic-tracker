import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "../backend/src/lib/api.ts"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("icons-material")) {
              return "vendor_icons";
            }
            if (id.includes("@mui") || id.includes("@popperjs")) {
              return "vendor_mui";
            }

            return "vendor";
          }
        },
      },
    },
  },
});
