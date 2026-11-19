import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Go up one level (..), into backend, and create/update a dist folder there
    outDir: "../backend/dist",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      // Any request starting with /api will be forwarded to the backend process
      // Must match the backend's default port (process.env.PORT || 3001 in backend)
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
