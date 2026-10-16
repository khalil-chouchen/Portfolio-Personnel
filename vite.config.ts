import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    // Local dev only: `npm run dev:api` serves the Python function that Vercel runs in production.
    proxy: { "/api": "http://127.0.0.1:8787" },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Add this:
  base: "./",
}));
